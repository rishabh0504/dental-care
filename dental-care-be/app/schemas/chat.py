from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class Message(BaseModel):
    role: str = Field(..., example="user")
    content: str = Field(..., example="Hello, who are you?")

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatQueryRequest(BaseModel):
    query: str = Field(..., example="What's the capital of France?")

class ChatResponse(BaseModel):
    id: int = Field(..., example=1)
    role: str = Field(..., example="assistant")
    content: str = Field(..., example="Paris is the capital of France.")
    sessionId: int = Field(..., alias="session_id", example=123)
    createdAt: datetime = Field(..., alias="created_at", example="2025-06-08T12:00:00Z")

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }
