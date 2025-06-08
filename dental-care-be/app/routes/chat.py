from fastapi import APIRouter, Depends, Path
from app.services.chat_service import OllamaChatService
from app.schemas.chat import ChatRequest, ChatResponse
from typing import List

router = APIRouter(tags=["Chat"])

@router.post("/{chatSessionId}", response_model=ChatResponse)
async def ollama_chat(
    chatSessionId: int = Path(..., description="ID of the chat session"),
    chat_req: ChatRequest = Depends(),
    chat_service: OllamaChatService = Depends()
):
    return await chat_service.chat_with_ollama(chat_req, chatSessionId)

@router.get("/{chatSessionId}/history", response_model=List[ChatResponse])
async def get_chat_history(
    chatSessionId: int = Path(..., description="ID of the chat session"),
    chat_service: OllamaChatService = Depends()
):
    return await chat_service.get_chat_history(chatSessionId)