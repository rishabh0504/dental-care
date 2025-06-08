from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.patient import CreatePatientRequest, PatientResponse ,UpdatePatientRequest 
from app.services.patient_service import create_patient, get_patient_by_email, get_all_patients,delete_patient_by_id, update_patient_by_id
from fastapi import Body

router = APIRouter(tags=["Patients"])

@router.post("/", response_model=PatientResponse)
async def create_new_patient(patient: CreatePatientRequest):
    try:
        new_patient = await create_patient(patient)
        return new_patient
    except Exception as e:
        # You can customize error handling or use custom exceptions here
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{email}", response_model=PatientResponse)
async def read_patient(email: str):
    patient = await get_patient_by_email(email)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.get("/", response_model=List[PatientResponse])
async def read_all_patients():
    patients = await get_all_patients()
    return patients

@router.delete("/{id}", response_model=PatientResponse)
async def delete_patient(id: str):
    try:
        deleted_patient = await delete_patient_by_id(id)
        return deleted_patient
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{id}", response_model=PatientResponse)
async def update_patient(id: str, updated_data: UpdatePatientRequest = Body(...)):
    try:
        # Convert to dict and exclude unset (None) fields
        update_dict = updated_data.dict(exclude_unset=True)
        updated_patient = await update_patient_by_id(id, update_dict)
        return updated_patient
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))