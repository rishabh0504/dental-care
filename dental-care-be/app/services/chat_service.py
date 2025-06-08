import httpx
import logging
from typing import List
from datetime import datetime
from app.schemas.chat import ChatRequest, ChatResponse
from app.core.config import settings
from app.db.prisma import get_prisma_client

# Configure module-level logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class OllamaChatService:
    def __init__(self):
        self.prisma = get_prisma_client()

    async def chat_with_ollama(self, chat_req: ChatRequest, chatSessionId: int) -> ChatResponse:
        url = f"{settings.OLLAMA_BASE_URL}/api/chat"

        payload = {
            "model": "gemma3:4b",
            "messages": [msg.dict() for msg in chat_req.messages],
            "stream": False
        }

        logger.info(f"Sending chat request to Ollama for session {chatSessionId}")
        logger.debug(f"Payload: {payload}")

        timeout = httpx.Timeout(120.0, read=120.0)

        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                response = await client.post(url, json=payload)
                response.raise_for_status()
            except httpx.HTTPError as e:
                logger.error(f"HTTP error from Ollama: {e}")
                raise
            except Exception as e:
                logger.error(f"Unexpected error during Ollama call: {e}")
                raise

            data = response.json()
            assistant_content = data.get("message", {}).get("content", "")

        logger.info("Ollama response received")
        logger.debug(f"Assistant response content: {assistant_content}")

        # Save user messages
        for msg in chat_req.messages:
            if msg.role == "user":
                logger.debug(f"Saving user message: {msg.content}")
                await self.prisma.chathistory.create(
                    data={
                        "role": "user",
                        "content": msg.content,
                        "sessionId": chatSessionId,
                    }
                )

        # Save assistant response and return ChatResponse
        logger.debug(f"Saving assistant message: {assistant_content}")
        saved_assistant_msg = await self.prisma.chathistory.create(
            data={
                "role": "assistant",
                "content": assistant_content,
                "sessionId": chatSessionId,
            }
        )

        return ChatResponse(
            id=saved_assistant_msg.id,
            role=saved_assistant_msg.role,
            content=saved_assistant_msg.content,
            sessionId=saved_assistant_msg.sessionId,
            createdAt=saved_assistant_msg.createdAt
        )

    async def get_chat_history(self, chatSessionId: int) -> List[ChatResponse]:
        logger.info(f"Fetching chat history for session {chatSessionId}")
        try:
            chats = await self.prisma.chathistory.find_many(
                where={"sessionId": chatSessionId},
                order={"createdAt": "asc"}
            )
        except Exception as e:
            logger.error(f"Error fetching chat history: {e}")
            raise

        logger.debug(f"Fetched {len(chats)} chat entries")

        return [ChatResponse.model_validate(chat) for chat in chats]
