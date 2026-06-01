# SQLAlchemy is used to connect our FastAPI backend to a database
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file for Sprint 3 backend proof
DATABASE_URL = "sqlite:///./coldguard.db"

# Create the database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create a database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class used by all database models
Base = declarative_base()


# Dependency function used by routes to access the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()