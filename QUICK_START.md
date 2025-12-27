# Quick Start Guide - Strategic Horizon Backend

## If You See "ModuleNotFoundError: No module named 'django.db.migrations.migration'"

**Don't panic!** This is easily fixed. Follow these steps:

```bash
# Step 1: Navigate to backend directory
cd backend

# Step 2: Activate virtual environment
# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Verify everything works
python verify_setup.py

# Step 5: Try your command again
python manage.py migrate
```

## First Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/MachariaP/StrategicHorizon.git
cd StrategicHorizon

# 2. Set up PostgreSQL database (if not already done)
sudo -u postgres psql
CREATE DATABASE strategic_planner;
ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE strategic_planner TO postgres;
\q

# 3. Set up backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Verify setup
python verify_setup.py

# Run migrations
python manage.py migrate

# Seed sample data
python manage.py seed_data

# Start server
python manage.py runserver
```

## Every Time You Work on the Project

```bash
# 1. Navigate to backend
cd backend

# 2. Activate virtual environment (IMPORTANT!)
source venv/bin/activate  # Linux/macOS
# OR
venv\Scripts\activate     # Windows

# 3. Now you can run any Django commands
python manage.py runserver
python manage.py migrate
python manage.py createsuperuser
# etc.
```

## How to Know if Virtual Environment is Active

Look for `(venv)` at the start of your terminal prompt:

```bash
# ✅ GOOD - Virtual environment is active
(venv) user@computer:~/StrategicHorizon/backend$ python manage.py migrate

# ❌ BAD - Virtual environment is NOT active
user@computer:~/StrategicHorizon/backend$ python manage.py migrate
```

## Common Commands

```bash
# Activate virtual environment
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Check setup
python verify_setup.py

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver

# Create admin user
python manage.py createsuperuser

# Seed sample data
python manage.py seed_data

# Django shell
python manage.py shell

# Check for issues
python manage.py check
```

## Troubleshooting

### Virtual Environment Won't Activate

**Solution 1: Recreate it**
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Solution 2: Windows PowerShell execution policy**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Django Not Found

```bash
# Make sure virtual environment is active (look for "(venv)" in prompt)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify
python -c "import django; print(django.__version__)"
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Start PostgreSQL if needed
sudo systemctl start postgresql  # Linux
brew services start postgresql  # macOS
```

### Port Already in Use

```bash
# Use a different port
python manage.py runserver 8001
```

## Getting Help

1. **First**, check if your virtual environment is active
2. **Second**, run `python verify_setup.py` to diagnose issues
3. **Third**, check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions
4. **Fourth**, check [MIGRATION_ERROR_RESOLUTION.md](./MIGRATION_ERROR_RESOLUTION.md) for the migration error fix
5. **Last**, create a GitHub issue with your error details

## Success Checklist

- [ ] Python 3.12+ installed
- [ ] PostgreSQL installed and running
- [ ] Virtual environment created (`venv` directory exists)
- [ ] Virtual environment activated (`(venv)` in prompt)
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Setup verified (`python verify_setup.py` passes)
- [ ] Database created (`strategic_planner`)
- [ ] Migrations run (`python manage.py migrate`)
- [ ] Server starts (`python manage.py runserver`)

## Pro Tips

💡 **Always activate your virtual environment first!** This is the #1 cause of issues.

💡 **Use `python verify_setup.py`** whenever you have doubts about your setup.

💡 **Keep your dependencies updated**: `pip install --upgrade -r requirements.txt`

💡 **Create a script** to activate your environment and start the server:
```bash
#!/bin/bash
cd backend
source venv/bin/activate
python manage.py runserver
```

---

**Happy coding!** 🚀
