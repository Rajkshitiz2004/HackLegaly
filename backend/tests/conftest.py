import pytest
from backend.app.database import engine, Base, SessionLocal
import backend.app.models
from backend.app.seed_data.seed_database import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
