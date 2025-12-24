from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import hashlib
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=5,
    max_overflow=10,
    echo=False
)

app = FastAPI()

class RegisterForm(BaseModel):
    email: str
    password: str
    invite_code: str | None = None

def hash_password(password: str) -> str:
    """对密码进行 SHA-256 哈希"""
    return hashlib.sha256(password.encode()).hexdigest()

def get_or_create_default_invite_code(conn):
    """获取或创建默认邀请码"""
    # 先查找是否存在默认邀请码
    result = conn.execute(
        text("SELECT id FROM invite_codes WHERE code='DEFAULT2024' LIMIT 1")
    ).fetchone()
    
    if result:
        return result.id
    
    # 如果不存在，创建一个
    logger.info("Creating default invite code")
    conn.execute(
        text("INSERT INTO invite_codes (code, isActive, createdAt) VALUES ('DEFAULT2024', 1, NOW())")
    )
    
    # 获取刚创建的ID
    result = conn.execute(
        text("SELECT id FROM invite_codes WHERE code='DEFAULT2024' LIMIT 1")
    ).fetchone()
    
    return result.id if result else None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/register")
def register_user(data: RegisterForm):
    try:
        with engine.begin() as conn:
            # 检查邮箱是否存在
            check = conn.execute(
                text("SELECT id FROM users WHERE email=:email"),
                {"email": data.email}
            ).fetchone()
            
            if check:
                raise HTTPException(status_code=400, detail="Email already exists")
            
            # 处理邀请码
            invite_code_id = None
            if data.invite_code:
                # 用户提供了邀请码，验证它
                invite_result = conn.execute(
                    text("SELECT id FROM invite_codes WHERE code=:code AND isActive=1"),
                    {"code": data.invite_code}
                ).fetchone()
                
                if not invite_result:
                    raise HTTPException(status_code=400, detail="Invalid invite code")
                
                invite_code_id = invite_result.id
            else:
                # 没有提供邀请码，使用或创建默认邀请码
                invite_code_id = get_or_create_default_invite_code(conn)
                
                if not invite_code_id:
                    raise HTTPException(status_code=500, detail="Failed to get invite code")
            
            # 哈希密码并插入用户
            password_hash = hash_password(data.password)
            
            conn.execute(
                text("""
                    INSERT INTO users (email, password, inviteCodeId, createdAt, updatedAt)
                    VALUES (:email, :password, :inviteCodeId, NOW(), NOW())
                """),
                {
                    "email": data.email,
                    "password": password_hash,
                    "inviteCodeId": invite_code_id
                }
            )
            
            logger.info(f"User registered successfully: {data.email}")
        
        return {"message": "Register success"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")