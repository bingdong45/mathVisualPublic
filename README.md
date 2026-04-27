# MathVisual

## Prerequisites

- Python 3.10+
- PostgreSQL running locally with a database called `math_animator`

## Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and set your PostgreSQL password
```

## Running the Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

The server starts at `http://127.0.0.1:8000`. Database tables are created automatically on startup.

- Health check: `GET /health`
- API docs: `http://127.0.0.1:8000/docs`

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## Running the Frontend

```bash
cd frontend
npm run dev
```

The app starts at `http://localhost:5173`.
