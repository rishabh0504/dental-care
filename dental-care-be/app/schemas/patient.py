from pydantic import BaseModel, EmailStr, Field
from datetime import date
from enum import Enum
from prisma.enums import PatientStatus
from typing import Optional

class CreatePatientRequest(BaseModel):
    name: str = Field(..., min_length=1)
    age: int = Field(..., ge=0)
    email: EmailStr
    phone: str = Field(..., min_length=6)
    address: str = Field(..., min_length=6)
    status: PatientStatus

class PatientResponse(CreatePatientRequest):
    id: int  # or str if your DB uses UUIDs or strings for IDs

    class Config:
        orm_mode = True  # Enables compatibility with ORM objects (Prisma returns models compatible)

class UpdatePatientRequest(BaseModel):
    name: Optional[str]
    email: Optional[str]
    age: Optional[int]
    phone: Optional[str]
    address: Optional[str]
    status: Optional[str]