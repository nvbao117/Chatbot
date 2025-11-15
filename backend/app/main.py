# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from backend.app.api.v1 import router as v1_router
from backend.app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Chatbot Study API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prefix = settings.API_V1_STR
app.include_router(v1_router.router, prefix=prefix)

@app.get("/")
def root():
    return {"message": "Chatbot Study API", "version": settings.VERSION}

@app.get("/health")
def health_check():
    return {"status": "ok"}