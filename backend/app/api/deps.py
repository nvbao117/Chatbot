from backend.app.db.session import get_db as _get_db

def get_db():
    yield from _get_db()
