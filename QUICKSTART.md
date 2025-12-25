# Quick Start Guide - 2026 Strategic Planner

Get up and running with the 2026 Strategic Planner in a few simple steps!

## Prerequisites

- Python 3.11+ installed
- Node.js 18+ installed
- PostgreSQL 15+ installed
- Git installed

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/MachariaP/StrategicHorizon.git
cd StrategicHorizon
```

### Step 2: Set up PostgreSQL Database

Install PostgreSQL and create a database:
```bash
# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# On macOS
brew install postgresql

# Start PostgreSQL service
sudo systemctl start postgresql  # Ubuntu/Debian
brew services start postgresql   # macOS

# Create database (using default postgres superuser)
sudo -u postgres psql
CREATE DATABASE strategic_planner;
ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE strategic_planner TO postgres;
\q
```

**Note:** For production, create a dedicated database user with a strong password.

### Step 3: Set up the Backend

```bash
cd backend

# Create environment file
cp .env.example .env

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser for admin access
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

### Step 4: Set up the Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### Step 5: Access the Application

Open your browser and visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

### Step 6: Create Your First Vision

1. Log in to the admin panel (http://localhost:8000/admin/)
2. Add a new Vision for year 2026
3. Add some Goals linked to your Vision
4. Visit the frontend (http://localhost:3000) to see your dashboard

## Common Commands

### Backend Commands

```bash
# Activate virtual environment
cd backend
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Run migrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver

# Access Django shell
python manage.py shell
```

### Frontend Commands

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### Database Commands

```bash
# Access database shell
psql -U postgres -d strategic_planner

# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # macOS
```

## Troubleshooting

### Database Connection Error

**Problem:** "could not translate host name to address" or connection errors

**Solution:**
1. Create a `.env` file in the `backend/` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. The `.env` file will have `DATABASE_HOST=localhost` by default, which is correct for local development.

3. Ensure PostgreSQL is running locally and the database exists:
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql  # Linux
   brew services list                # macOS
   
   # Create database if needed
   psql -U postgres -h localhost
   CREATE DATABASE strategic_planner;
   \q
   ```

4. Restart the Django server:
   ```bash
   python manage.py runserver
   ```

### Port Already in Use

If ports 3000 or 8000 are already in use:
- **Backend (port 8000)**: Stop any other Django/Python servers, or specify a different port: `python manage.py runserver 8001`
- **Frontend (port 3000)**: Stop any other React/Node servers, or the development server will prompt you to use a different port

### Frontend Shows "Failed to Load"

1. Ensure backend is running: Check terminal where you started `python manage.py runserver`
2. Check backend is accessible: Visit http://localhost:8000/api/
3. Verify you're logged in to the admin panel first
4. Check browser console (F12) for error messages

## Next Steps

1. **Explore the Data Models**: See ARCHITECTURE.md for details
2. **Add Sample Data**: Use the admin panel to populate your planner
3. **Customize**: Modify the code to fit your needs
4. **Read the Full Docs**: Check README.md for comprehensive information

## Getting Help

- **Documentation**: See README.md and ARCHITECTURE.md
- **Issues**: Create an issue on GitHub
- **Logs**: Check your terminal output for error messages

## Quick API Examples

### Get Access Token
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'
```

### List Goals
```bash
curl http://localhost:8000/api/goals/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create a Goal
```bash
curl -X POST http://localhost:8000/api/goals/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Launch MVP",
    "description": "Launch minimum viable product by Q2",
    "status": "pending",
    "target_date": "2026-06-30"
  }'
```

## Development Tips

- Backend code changes auto-reload with Django dev server
- Frontend code changes auto-reload with Hot Module Replacement
- Database data persists in PostgreSQL
- Use `.gitignore` to avoid committing sensitive files

---

**Happy Planning! 🚀**

For detailed documentation, see:
- [README.md](README.md) - Complete setup and usage guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture details
