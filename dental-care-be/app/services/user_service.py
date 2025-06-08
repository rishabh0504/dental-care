import logging
from prisma import Prisma
from app.db.prisma import get_prisma_client
from app.schemas.user import UserSignupRequest, UserSigninRequest
from passlib.context import CryptContext
from datetime import datetime
from app.core.jwt import create_access_token
from prisma.errors import RecordNotFoundError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configure logger
logger = logging.getLogger("user_service")
logger.setLevel(logging.INFO)  # Set to DEBUG for more detailed logs
handler = logging.StreamHandler()  # Or use FileHandler for file logging
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
if not logger.hasHandlers():
    logger.addHandler(handler)

async def create_user(user: UserSignupRequest):
    prisma = get_prisma_client()
    try:
        hashed_password = pwd_context.hash(user.password)
        dob_datetime = datetime.combine(user.dateOfBirth, datetime.min.time())

        new_user = await prisma.user.create(
            data={
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "dateOfBirth": dob_datetime,
                "password": hashed_password
            }
        )

        new_chat_session = await prisma.chatsession.create(
            data={
                "title": f"{new_user.firstName}'s Chat Session",
                "createdBy": new_user.email,
                "updatedBy": new_user.email,
                "userId": new_user.id
            }
        )
        logger.info(f"User created successfully: {user.email}")
        return new_user
    except Exception as e:
        logger.error(f"Error creating user {user.email}: {e}")
        raise

async def authenticate_user(user: UserSigninRequest):
    prisma = get_prisma_client()
    try:
        db_user = await prisma.user.find_unique(where={"email": user.email})
        if not db_user:
            logger.warning(f"Authentication failed: User not found - {user.email}")
            return None
        if not pwd_context.verify(user.password, db_user.password):
            logger.warning(f"Authentication failed: Incorrect password - {user.email}")
            return None

        # Find existing chat session or create one
        chat_session = await prisma.chatsession.find_first(where={"userId": db_user.id})
        if not chat_session:
            chat_session = await prisma.chatsession.create(
                data={
                    "title": f"{db_user.firstName}'s Chat Session",
                    "createdBy": db_user.email,
                    "updatedBy": db_user.email,
                    "userId": db_user.id
                }
            )

        # Prepare JWT payload
        user_data = db_user.__dict__.copy()
        user_data.pop("password", None)
        user_data["chatSessionId"] = chat_session.id  # <-- add chat session ID

        # Convert datetime fields
        for key, value in user_data.items():
            if isinstance(value, datetime):
                user_data[key] = value.isoformat()

        token = create_access_token(user_data)

        logger.info(f"User authenticated successfully: {user.email}")
        return {"access_token": token, "token_type": "bearer"}

    except Exception as e:
        logger.error(f"Error authenticating user {user.email}: {e}")
        raise
