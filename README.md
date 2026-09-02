# Construction-Portfolio
This project is portfolio web app for construction like company, where we have admin side front end , backend in addition to the  portfolio frontend

# Start backend
cd  backend
composer install
php -S localhost:8000

# Start frontend
cd frontend
npm install
npm start

# Start Admin frontend
cd admin-frontend
npm install
npm start

# open cli mysql
sudo  mysql -u mysqluser -p

# Update remote origin
git remote set-url origin https://github.com/Husyn0/Construction-Portfolio.git



# Create and setup virtual environment:
cd /var/www/analytics-service
python3 -m venv web-fingerprint-analytic
source web-fingerprint-analytic/bin/activate
pip install -r requirements.txt

# Start Python Analytics Service
cd ./analytics-service
source web-fingerprint-analytic/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# Start PHP Backend
php -S localhost:8000 index.html

