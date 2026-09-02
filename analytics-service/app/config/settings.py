import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'your_database')
    SERVICE_PORT = int(os.getenv('SERVICE_PORT', 8000))
    API_KEY = os.getenv('INTERNAL_API_KEY', 'your-secret-key-12345')
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001')
    FINGERPRINT_SALT = os.getenv('FINGERPRINT_SALT', 'default-salt')

settings = Settings()