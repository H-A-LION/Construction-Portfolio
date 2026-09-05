# python server
cd analytics-service/
source web-fingerprint-analytic/bin/activate
# python3 -m http.server 8001 --directory app/main.py
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
# Use the main.py directly
python3 -m app.main
# If you have the module installed
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

# Portfolio
cd frontend
npm start

# admin side
cd admin-frontend
npm start

# php server
cd backend
php -S localhost:8000 index.php
