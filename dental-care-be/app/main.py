from fastapi import FastAPI
from app.db.prisma import connect_prisma, disconnect_prisma
from app.routes import auth
from app.routes import patient
from app.routes import chat

from app.middleware.jwt_auth import JWTAuthMiddleware
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(JWTAuthMiddleware)

app.include_router(auth.router, prefix="/auth")
app.include_router(patient.router, prefix="/patients")
app.include_router(chat.router, prefix="/chat")


@app.on_event("startup")
async def on_startup():
    await connect_prisma()

@app.on_event("shutdown")
async def on_shutdown():
    await disconnect_prisma()
