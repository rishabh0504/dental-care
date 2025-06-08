import logging
from prisma import Prisma
from app.db.prisma import get_prisma_client
from app.schemas.patient import CreatePatientRequest

# Configure logger
logger = logging.getLogger("patient_service")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
if not logger.hasHandlers():
    logger.addHandler(handler)

async def create_patient(patient: CreatePatientRequest):
    prisma = get_prisma_client()
    try:

        new_patient = await prisma.patient.create(
            data={
                "name": patient.name,
                "age": patient.age,
                "email": patient.email,
                "phone": patient.phone,
                "address": patient.address,
                "status": patient.status  
            }
        )
        logger.info(f"Patient created successfully: {patient.email}")
        return new_patient
    except Exception as e:
        logger.error(f"Error creating patient {patient.email}: {e}")
        raise

async def get_patient_by_email(email: str):
    prisma = get_prisma_client()
    try:
        patient = await prisma.patient.find_unique(where={"email": email})
        if not patient:
            logger.warning(f"Patient not found: {email}")
            return None
        return patient
    except Exception as e:
        logger.error(f"Error fetching patient {email}: {e}")
        raise

async def get_all_patients():
    prisma = get_prisma_client()
    try:
        patients = await prisma.patient.find_many()
        logger.info(f"Retrieved {len(patients)} patients")
        return patients
    except Exception as e:
        logger.error(f"Error retrieving patients: {e}")
        raise

async def delete_patient_by_id(patient_id: str):
    prisma = get_prisma_client()
    try:
        deleted_patient = await prisma.patient.delete(where={"id": int(patient_id)})
        logger.info(f"Patient deleted successfully: {patient_id}")
        return deleted_patient
    except Exception as e:
        logger.error(f"Error deleting patient {patient_id}: {e}")
        raise
        
async def update_patient_by_id(patient_id: str, updated_data: dict):
    prisma = get_prisma_client()
    try:
        updated_patient = await prisma.patient.update(
            where={"id": int(patient_id)},
            data=updated_data
        )
        logger.info(f"Patient updated successfully: {patient_id}")
        return updated_patient
    except Exception as e:
        logger.error(f"Error updating patient {patient_id}: {e}")
        raise