# python server
cd analytics-service/
source web-fingerprint-analytic/bin/activate
python3 -m http.server 8001 --directory app/main.py

# Portfolio
cd frontend
npm start

# admin side
cd admin-frontend
npm start

# php server
cd backend
php -S localhost:8000 index.php
