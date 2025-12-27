# Troubleshooting Guide

This guide helps you resolve common issues when setting up and running Strategic Horizon.

## Table of Contents
1. [Django Migration Errors](#django-migration-errors)
2. [Database Connection Issues](#database-connection-issues)
3. [Virtual Environment Issues](#virtual-environment-issues)
4. [Port Already in Use](#port-already-in-use)

---

## Django Migration Errors

### Error: `ModuleNotFoundError: No module named 'django.db.migrations.migration'`

**Problem:** This error occurs when Django is not installed or the installation is corrupted in your virtual environment.

**Full Error Message:**
```
Traceback (most recent call last):
  File "/home/user/StrategicHorizon/backend/manage.py", line 22, in <module>
    main()
  ...
  File "/path/to/.venv/lib/python3.12/site-packages/django/db/migrations/__init__.py", line 1, in <module>
    from .migration import Migration, swappable_dependency  # NOQA
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
ModuleNotFoundError: No module named 'django.db.migrations.migration'
```

**Solution:**

1. **Ensure you're in the backend directory:**
   ```bash
   cd backend
   ```

2. **Activate your virtual environment:**
   ```bash
   # On Linux/macOS
   source venv/bin/activate
   
   # On Windows
   venv\Scripts\activate
   ```

3. **Verify your virtual environment is active:**
   You should see `(venv)` at the beginning of your command prompt.

4. **Install/Reinstall dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Verify Django installation:**
   ```bash
   python -c "import django; print(f'Django {django.VERSION} installed at {django.__file__}')"
   ```
   
   You should see output like:
   ```
   Django (5, 1, 4, 'final', 0) installed at /path/to/venv/lib/python3.12/site-packages/django/__init__.py
   ```

6. **Try running migrations again:**
   ```bash
   python manage.py migrate
   ```

### Error: `django.core.exceptions.ImproperlyConfigured: mysqlclient module is required`

**Solution:** This error occurs if you have MySQL configured but the required package is not installed. Either:
- Install `mysqlclient`: `pip install mysqlclient`
- Or switch to PostgreSQL (recommended, see README.md)

---

## Database Connection Issues

### Error: `connection to server at "localhost" (::1), port 5432 failed: Connection refused`

**Problem:** PostgreSQL server is not running or not properly configured.

**Solution:**

1. **Check if PostgreSQL is running:**
   ```bash
   # On Linux
   sudo systemctl status postgresql
   
   # On macOS
   brew services list | grep postgresql
   ```

2. **Start PostgreSQL if it's not running:**
   ```bash
   # On Linux
   sudo systemctl start postgresql
   
   # On macOS
   brew services start postgresql
   ```

3. **Verify database exists:**
   ```bash
   sudo -u postgres psql -l
   ```
   
   Look for `strategic_planner` in the list. If it doesn't exist, create it:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE strategic_planner;
   ALTER USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE strategic_planner TO postgres;
   \q
   ```

4. **Check .env file configuration:**
   Ensure your `backend/.env` file has correct database credentials:
   ```
   DATABASE_NAME=strategic_planner
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   ```

### Error: `FATAL: password authentication failed for user "postgres"`

**Solution:** Database password mismatch.

1. **Reset PostgreSQL password:**
   ```bash
   sudo -u postgres psql
   ALTER USER postgres WITH PASSWORD 'postgres';
   \q
   ```

2. **Update .env file with correct password**

---

## Virtual Environment Issues

### Error: `command not found: python` or `command not found: pip`

**Problem:** Python is not installed or not in your PATH, or virtual environment is not activated.

**Solution:**

1. **Verify Python is installed:**
   ```bash
   python3 --version
   # or
   python --version
   ```

2. **Install Python if needed:**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install python3.12 python3.12-venv python3-pip
   
   # On macOS
   brew install python@3.12
   ```

3. **Create virtual environment if it doesn't exist:**
   ```bash
   cd backend
   python3 -m venv venv
   ```

4. **Activate virtual environment:**
   ```bash
   # On Linux/macOS
   source venv/bin/activate
   
   # On Windows
   venv\Scripts\activate
   ```

### Virtual Environment Not Activating

**Problem:** Activation script not found or permission issues.

**Solution:**

1. **Delete and recreate virtual environment:**
   ```bash
   cd backend
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate  # Linux/macOS
   pip install -r requirements.txt
   ```

2. **On Windows, try:**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
   
   If you get an execution policy error:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

---

## Port Already in Use

### Error: `Error: That port is already in use.`

**Problem:** Port 8000 (backend) or 3000 (frontend) is already in use.

**Solution:**

1. **Find process using the port:**
   ```bash
   # On Linux/macOS
   lsof -i :8000
   # or
   lsof -i :3000
   
   # On Windows
   netstat -ano | findstr :8000
   netstat -ano | findstr :3000
   ```

2. **Kill the process:**
   ```bash
   # On Linux/macOS
   kill -9 <PID>
   
   # On Windows (replace <PID> with the process ID)
   taskkill /PID <PID> /F
   ```

3. **Or use a different port:**
   ```bash
   # Backend
   python manage.py runserver 8001
   
   # Frontend
   PORT=3001 npm start
   ```

---

## Quick Verification

Run this command to verify your setup:

```bash
cd backend
python -c "
import sys
print(f'Python version: {sys.version}')
try:
    import django
    print(f'Django version: {django.__version__}')
except ImportError:
    print('ERROR: Django not installed!')
    sys.exit(1)
try:
    import rest_framework
    print(f'DRF version: {rest_framework.__version__}')
except ImportError:
    print('ERROR: Django REST Framework not installed!')
    sys.exit(1)
print('✓ All core packages installed correctly!')
"
```

Expected output:
```
Python version: 3.12.x
Django version: 5.1.4
DRF version: 3.16.1
✓ All core packages installed correctly!
```

---

## Still Having Issues?

If you're still experiencing issues:

1. **Check Python version:**
   ```bash
   python --version
   ```
   Ensure it's Python 3.12 or higher.

2. **Try a clean installation:**
   ```bash
   cd backend
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Verify requirements.txt is intact:**
   ```bash
   cat requirements.txt
   ```
   Should include Django==5.1.4 and other dependencies.

4. **Check for conflicting Python installations:**
   ```bash
   which python
   which python3
   ```

5. **Create an issue on GitHub** with:
   - Your operating system
   - Python version
   - Full error message
   - Steps you've tried

---

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Python Virtual Environments Guide](https://docs.python.org/3/tutorial/venv.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
