import os

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker

engine = create_engine(os.environ.get("SQLALCHEMY_DATABASE_URL"))
SessionLocal = sessionmaker(bind=engine)
