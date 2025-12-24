from fastapi import FastAPI, HTTPException, Response, Cookie, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
import redis
import uuid
import os
from typing import Optional
import logging
import hashlib

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("REDIS_URL")
SESSION_EXPIRE_SECONDS = 7 * 24 * 3600  # 7天

# 配置数据库连接池
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # 自动检测失效连接
    pool_recycle=3600,       # 1小时回收连接
    pool_size=5,
    max_overflow=10,
    echo=False
)

# 配置 Redis 连接池
redis_client = redis.from_url(
    REDIS_URL, 
    decode_responses=True,
    socket_connect_timeout=5,
    socket_keepalive=True,
    health_check_interval=30
)

app = FastAPI()

class LoginForm(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    """对密码进行 SHA-256 哈希"""
    return hashlib.sha256(password.encode()).hexdigest()

def get_current_user(session_id: Optional[str] = Cookie(None)):
    """从 Cookie 中获取当前用户"""
    if not session_id:
        return None
    
    try:
        user_id = redis_client.get(f"session:{session_id}")
        if not user_id:
            return None
        
        # 刷新 session 过期时间
        redis_client.expire(f"session:{session_id}", SESSION_EXPIRE_SECONDS)
        return {"user_id": int(user_id), "session_id": session_id}
    except redis.RedisError as e:
        logger.error(f"Redis error in get_current_user: {e}")
        return None

@app.get("/health")
def health():
    """健康检查接口"""
    try:
        # 检查数据库连接
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        # 检查 Redis 连接
        redis_client.ping()
        
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")

@app.post("/login")
def login_user(data: LoginForm, response: Response):
    """用户登录"""
    try:
        # 先查询用户
        with engine.begin() as conn:
            user = conn.execute(
                text("SELECT id, email, password FROM users WHERE email=:email"),
                {"email": data.email}
            ).fetchone()
        
        if not user:
            logger.warning(f"Login failed: user not found for email {data.email}")
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        # 验证密码哈希
        password_hash = hash_password(data.password)
        if user.password != password_hash:
            logger.warning(f"Login failed: wrong password for email {data.email}")
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        # 生成 session ID
        session_id = str(uuid.uuid4())
        
        # 将 session 存储到 Redis
        try:
            redis_client.setex(
                f"session:{session_id}",
                SESSION_EXPIRE_SECONDS,
                str(user.id)
            )
        except redis.RedisError as e:
            logger.error(f"Redis error during login: {e}")
            raise HTTPException(status_code=500, detail="Failed to create session")
        
        # 设置 Cookie
        response.set_cookie(
            key="session_id",
            value=session_id,
            max_age=SESSION_EXPIRE_SECONDS,
            path="/",
            httponly=True,
            samesite="lax",
            secure=False
        )
        
        logger.info(f"User {user.id} logged in successfully")
        
        return {
            "message": "Login success",
            "user_id": user.id,
            "email": user.email
        }
    
    except HTTPException:
        raise
    except OperationalError as e:
        logger.error(f"Database error during login: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        logger.error(f"Unexpected error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/me")
def get_me(session_id: Optional[str] = Cookie(None)):
    """获取当前用户信息"""
    if not session_id:
        return {"user": None}
    
    try:
        # 从 Redis 获取 user_id
        user_id = redis_client.get(f"session:{session_id}")
        if not user_id:
            return {"user": None}
        
        # 刷新 session 过期时间
        redis_client.expire(f"session:{session_id}", SESSION_EXPIRE_SECONDS)
        
        # 从数据库获取用户信息
        with engine.begin() as conn:
            user = conn.execute(
                text("SELECT id, email FROM users WHERE id=:id"),
                {"id": user_id}
            ).fetchone()
        
        if not user:
            # 用户不存在，删除无效 session
            redis_client.delete(f"session:{session_id}")
            return {"user": None}
        
        return {
            "user": {
                "user_id": user.id,
                "email": user.email
            }
        }
    
    except redis.RedisError as e:
        logger.error(f"Redis error in get_me: {e}")
        raise HTTPException(status_code=500, detail="Session error")
    except OperationalError as e:
        logger.error(f"Database error in get_me: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        logger.error(f"Unexpected error in get_me: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/logout")
def logout_user(response: Response, session_id: Optional[str] = Cookie(None)):
    """用户登出"""
    if session_id:
        try:
            # 删除 Redis 中的 session
            redis_client.delete(f"session:{session_id}")
        except redis.RedisError as e:
            logger.error(f"Redis error during logout: {e}")
    
    # 清除 Cookie
    response.delete_cookie(
        key="session_id",
        path="/"
    )
    
    return {"message": "Logout success"}
