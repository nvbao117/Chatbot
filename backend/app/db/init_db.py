from __future__ import annotations

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text

from backend.app.core.config import settings
from backend.app.db import Base, engine
from backend.app import models


def create_database_if_not_exists():
    try:
        conn = psycopg2.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database="postgres" 
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (settings.DB_NAME,))
        exists = cursor.fetchone()

        if not exists:
            cursor.execute(f"CREATE DATABASE {settings.DB_NAME}")
            print(f"Created database '{settings.DB_NAME}'")
        else:
            print(f"Database '{settings.DB_NAME}' already exists")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")
        raise

def init_db() -> None: 
    create_database_if_not_exists() 
    
if __name__ == "__main__":
    init_db()
