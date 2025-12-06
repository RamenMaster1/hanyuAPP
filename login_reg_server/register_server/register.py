from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# 配置连接池
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # 自动检测失效连接
    pool_recycle=3600,       # 1小时回收连接
    pool_size=5,
    max_overflow=10,
    echo=False               # 生产环境设为False，调试时可设为True查看SQL
)

app = FastAPI()

class RegisterForm(BaseModel):
    email: str
    password: str
    invite_code: str | None = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/register")
def register_user(data: RegisterForm):
    try:
        with engine.begin() as conn:  # 自动管理事务
            # 检查邮箱是否存在
            check = conn.execute(
                text("SELECT id FROM users WHERE email=:email"),
                {"email": data.email}
            ).fetchone()
            
            if check:
                raise HTTPException(status_code=400, detail="Email already exists")
            
            # 插入用户
            conn.execute(
                text("""
                    INSERT INTO users (email, password, invite_code)
                    VALUES (:email, :password, :invite_code)
                """),
                {
                    "email": data.email,
                    "password": data.password,
                    "invite_code": data.invite_code
                }
            )
        
        return {"message": "Register success"}
    
    except HTTPException:
        raise  # 重新抛出业务异常
    except Exception as e:
        # 记录其他数据库错误
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
