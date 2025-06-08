from pydantic import BaseModel, EmailStr, Field
from datetime import date

class UserSignupRequest(BaseModel):
    firstName: str = Field(..., min_length=1)
    lastName: str = Field(..., min_length=1)
    email: EmailStr
    dateOfBirth: date
    password: str = Field(..., min_length=6)

class UserSigninRequest(BaseModel):
    email: EmailStr
    password: str
