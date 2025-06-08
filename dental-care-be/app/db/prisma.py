from prisma import Prisma
from typing import Optional
import logging

logger = logging.getLogger(__name__)

_prisma: Optional[Prisma] = None

def get_prisma_client() -> Prisma:
    global _prisma

    if _prisma is None:
        logger.info("Creating new Prisma client instance.")
        _prisma = Prisma()

    return _prisma

async def connect_prisma():
    client = get_prisma_client()
    if not client.is_connected():
        try:
            await client.connect()
            logger.info("Prisma DB connected.")
        except Exception as e:
            logger.error(f"Failed to connect to Prisma DB: {e}")
            raise

async def disconnect_prisma():
    client = get_prisma_client()
    if client.is_connected():
        await client.disconnect()
        logger.info("Prisma DB disconnected.")
