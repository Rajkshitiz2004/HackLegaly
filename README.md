# NyayaSetu | Legal Rights Awareness Assistant & Document Privacy Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1.svg?logo=postgresql)](https://www.postgresql.org)
[![Alembic](https://img.shields.io/badge/Alembic-Migrations-red.svg)](https://alembic.sqlalchemy.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)

**NyayaSetu** ("Bridge to Justice") is an India-focused public legal-awareness and document-privacy platform created for Hacktoberfest. It simplifies complex legal documents, educates citizens on statutory rights (tenancy, workplace, consumer, and contracts), and architecturally guarantees that confidential personal information (Aadhaar, PAN, bank accounts, phones) is permanently redacted and authorized with cryptographic consent before external AI processing.

---

## 🌟 Key Features

1. **AI Legal Assistant**:
   - Structured 6-section guidance: Simple Explanation, Statutory Information, Exceptions, Action Checklist, Official Sources, and When to Seek a Lawyer.
   - Grounded in Indian central statutes (Model Tenancy Act 2021, Consumer Protection Act 2019, Indian Contract Act 1872, DPDP Act 2023, MSMED Act 2006).
   - Jurisdiction selector covering National Central and Indian States (Maharashtra, Delhi, Karnataka, Tamil Nadu, etc.).

2. **Document Simplifier & Privacy Gateway**:
   - Accepts PDF, DOCX, and pasted text.
   - Automated Indian PII detection: Aadhaar numbers, PAN cards, Indian mobile phones, bank accounts, IFSC codes, names, and addresses.
   - Dual-scan verification with residual identifier detection.
   - Cryptographic SHA-256 consent gatekeeping enforced in the backend before external AI invocation.
   - Structured analysis: Plain-language summary, clause explanations, risk ratings (LOW/MEDIUM/HIGH), potential red flags, deadlines, and questions to ask a lawyer.

3. **Privacy Centre & Redaction Engine**:
   - Interactive dual-panel workbench comparing raw vs proposed redacted text.
   - Character-level underlying byte removal (prevents selectable text scraping).
   - Pre-loaded synthetic fixtures for instant evaluation.

4. **Contract Version Comparison**:
   - Compares two agreement drafts.
   - Identifies clause shifts in consideration, termination notices, lock-in periods, and liability.
   - Color-coded line-by-line diff viewer.

5. **Legal Knowledge Centre & Resource Directory**:
   - 6 core legal domains with interactive action checklists.
   - Verified emergency helplines: NALSA (15100), Consumer (1915), Cybercrime (1930), and e-Daakhil.

---

## 🏛️ System Architecture & 27 Relational Entities
NyayaSetu implements a 27-entity relational data model mapped to PostgreSQL via SQLAlchemy 2.0 and Alembic.

- **Mermaid ER Diagram & Schema**: See [docs/ER_DIAGRAM.md](docs/ER_DIAGRAM.md)
- **Detailed Service Architecture**: See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Hackathon Demo Script**: See [docs/DEMO_WALKTHROUGH.md](docs/DEMO_WALKTHROUGH.md)

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v20+) & npm
- Python (v3.11+)
- PostgreSQL (or Docker)

### Option A: Local Development Setup

#### 1. Clone & Set Up Backend
```bash
# Navigate to project root
cd HacktoberFest

# Create & activate Python virtual environment
python3 -m venv backend/venv
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run initial migrations and seed Indian statutory data
PYTHONPATH=backend python -c "from app.database import engine, Base, SessionLocal; import app.models; Base.metadata.create_all(bind=engine); from app.seeds.initial_data import seed_database; db = SessionLocal(); seed_database(db); db.close(); print('Ready!')"

# Start FastAPI backend server
PYTHONPATH=backend uvicorn app.main:app --port 8000 --reload
```
API Documentation will be available at: `http://localhost:8000/docs`

#### 2. Start Frontend
In a new terminal:
```bash
cd HacktoberFest/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### Option B: Docker Compose
```bash
cd HacktoberFest
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## 🧪 Automated Testing

### Backend Test Suite (Pytest)
Runs 9 comprehensive automated tests validating Indian PII detection, character removal, second scan, consent gatekeeping, 403 rejection, and statutory grounding:
```bash
PYTHONPATH=backend backend/venv/bin/pytest backend/tests/ -v
```

### Frontend Typecheck & Build
```bash
cd frontend
npm run build
```

---

## 🔒 Security & Privacy Commitments
- **No API Keys in Frontend**: External AI keys (Google Gemini) reside exclusively on the backend.
- **Backend Gatekeeper**: Requests to `/api/documents/analyze` are cryptographically verified against active `PROCESSING_CONSENT` hashes. Any unreviewed or altered text produces `HTTP 403 Forbidden` / `HTTP 422 Unprocessable Content`.
- **Ephemeral Processing**: Documents are processed in volatile memory without raw database storage.

---

## 📜 Disclaimer
NyayaSetu is an educational awareness assistant. It does not provide legal advice or create an attorney-client relationship under the Advocates Act, 1961. For active court matters or free statutory legal aid, dial NALSA Helpline **15100**.
