# Decoration Shop Manager

A full-stack inventory & sales dashboard built with **React + Vite** (frontend) and **Django REST Framework** (backend).

---

## Project Structure

```
decoration-shop/
├── backend/          # Django DRF project
│   ├── config/       # settings, urls, wsgi
│   ├── shop/         # models, serializers, views, urls
│   ├── manage.py
│   └── requirements.txt
└── frontend/         # React + Vite project
    ├── src/
    │   ├── api/      # axios client
    │   ├── components/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

---

## Backend Setup (Django DRF)

```bash
cd backend

# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations
python manage.py makemigrations
python manage.py migrate

# 4. (Optional) Create a superuser for Django admin
python manage.py createsuperuser

# 5. Start the dev server
python manage.py runserver
```

The API will be available at **http://127.0.0.1:8000/api/**

---

## Frontend Setup (React + Vite)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

The app will be at **http://localhost:5173**

> The Vite dev server proxies `/api` and `/media` requests to Django automatically — no CORS issues in development.

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/products/` | List all products |
| POST | `/api/products/` | Create a product (multipart) |
| GET | `/api/products/{id}/` | Get a product |
| PUT/PATCH | `/api/products/{id}/` | Update a product |
| DELETE | `/api/products/{id}/` | Delete a product |
| POST | `/api/products/{id}/sell/` | Sell units `{ "quantity": N }` |
| POST | `/api/products/{id}/restock/` | Add stock `{ "quantity": N }` |
| GET | `/api/sales/` | List all sales |

---

## Features

- **Inventory tab** — product grid with image, name, category, price, stock badge
- **Sell Product** — modal to sell units, auto-deducts stock, records sale
- **Restock** — modal to add stock back to a product
- **Sales tab** — full history table with grand total revenue
- **Add Product tab** — form with image upload, validation
- **Delete** — remove a product from inventory

---

## Production Notes

- Change `SECRET_KEY` in `settings.py` to a secure value (use environment variable)
- Set `DEBUG = False` and configure `ALLOWED_HOSTS`
- Use PostgreSQL instead of SQLite for production
- Serve media files via nginx or a cloud storage bucket (S3)
- Build React with `npm run build` and serve from Django or a CDN
