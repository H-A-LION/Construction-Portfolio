import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_NAME = os.getenv('DB_NAME')
    SERVICE_PORT = int(os.getenv('SERVICE_PORT'))
    API_KEY = os.getenv('INTERNAL_API_KEY')
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001,http://localhost:8000')
    FINGERPRINT_SALT = os.getenv('FINGERPRINT_SALT')

settings = Settings()