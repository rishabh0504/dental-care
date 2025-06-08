FROM python:3.11-slim

# Install system dependencies (libpq-dev for PostgreSQL)
RUN apt-get update && \
    apt-get install -y libpq-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies including prisma-client-py
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy all source files
COPY . .

# Generate Prisma client using python prisma CLI
RUN prisma generate
RUN prisma migrate deploy

# Expose FastAPI port
EXPOSE 8000

# Run the FastAPI app with reload (dev)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
