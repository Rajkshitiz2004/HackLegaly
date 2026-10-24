FROM node:20-alpine AS frontend

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt && pip install --no-cache-dir "psycopg[binary]"

COPY backend /app/backend
COPY alembic.ini /app/alembic.ini
COPY --from=frontend /frontend/dist /app/frontend/dist

ENV PYTHONPATH=/app
ENV DEMO_MODE=true
ENV ALLOWED_ORIGINS=*

EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
