#!/usr/bin/env python3
"""
Setup Verification Script for Strategic Horizon Backend

This script verifies that all dependencies are properly installed
and the environment is correctly configured.

Usage:
    python verify_setup.py
"""

import sys
import os
from pathlib import Path

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_success(message):
    print(f"{GREEN}✓ {message}{RESET}")

def print_error(message):
    print(f"{RED}✗ {message}{RESET}")

def print_warning(message):
    print(f"{YELLOW}⚠ {message}{RESET}")

def print_info(message):
    print(f"{BLUE}ℹ {message}{RESET}")

def check_python_version():
    """Check if Python version meets requirements."""
    print_info("Checking Python version...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 12:
        print_success(f"Python {version.major}.{version.minor}.{version.micro} (requirement: 3.12+)")
        return True
    else:
        print_error(f"Python {version.major}.{version.minor}.{version.micro} (requirement: 3.12+)")
        return False

def check_virtual_env():
    """Check if virtual environment is active."""
    print_info("Checking virtual environment...")
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print_success("Virtual environment is active")
        return True
    else:
        print_warning("Virtual environment is not active")
        print_info("Activate it with: source venv/bin/activate (Linux/macOS) or venv\\Scripts\\activate (Windows)")
        return False

def check_django():
    """Check Django installation."""
    print_info("Checking Django installation...")
    try:
        import django
        print_success(f"Django {django.__version__} installed")
        
        # Check if migrations module is accessible
        try:
            from django.db import migrations
            from django.db.migrations.migration import Migration
            print_success("Django migrations module accessible")
        except ImportError as e:
            print_error(f"Django migrations module not accessible: {e}")
            return False
        
        return True
    except ImportError:
        print_error("Django is not installed")
        print_info("Install it with: pip install -r requirements.txt")
        return False

def check_drf():
    """Check Django REST Framework installation."""
    print_info("Checking Django REST Framework...")
    try:
        import rest_framework
        print_success(f"Django REST Framework {rest_framework.__version__} installed")
        return True
    except ImportError:
        print_error("Django REST Framework is not installed")
        return False

def check_database_driver():
    """Check database driver installation."""
    print_info("Checking PostgreSQL driver...")
    try:
        import psycopg2
        print_success(f"psycopg2 (PostgreSQL driver) is installed")
        return True
    except ImportError:
        print_error("psycopg2 is not installed")
        return False

def check_other_dependencies():
    """Check other critical dependencies."""
    print_info("Checking other dependencies...")
    dependencies = {
        'rest_framework_simplejwt': 'djangorestframework-simplejwt',
        'dotenv': 'python-dotenv',
        'corsheaders': 'django-cors-headers',
        'celery': 'celery',
        'redis': 'redis',
        'django_celery_beat': 'django-celery-beat',
    }
    
    all_installed = True
    for module, package in dependencies.items():
        try:
            __import__(module)
            print_success(f"{package} is installed")
        except ImportError:
            print_error(f"{package} is not installed")
            all_installed = False
    
    return all_installed

def check_requirements_file():
    """Check if requirements.txt exists."""
    print_info("Checking requirements.txt...")
    requirements_path = Path(__file__).parent / 'requirements.txt'
    if requirements_path.exists():
        print_success("requirements.txt exists")
        with open(requirements_path) as f:
            content = f.read()
            # More flexible checking - just look for Django and djangorestframework anywhere in the file
            has_django = 'django' in content.lower()
            has_drf = 'djangorestframework' in content.lower()
            if has_django and has_drf:
                print_success("requirements.txt contains Django and DRF")
                return True
            else:
                print_warning("requirements.txt may be incomplete")
                return False
    else:
        print_error("requirements.txt not found")
        return False

def check_manage_py():
    """Check if manage.py exists."""
    print_info("Checking manage.py...")
    manage_path = Path(__file__).parent / 'manage.py'
    if manage_path.exists():
        print_success("manage.py exists")
        return True
    else:
        print_error("manage.py not found")
        return False

def check_env_file():
    """Check if .env file exists."""
    print_info("Checking .env file...")
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        print_success(".env file exists")
        return True
    else:
        print_warning(".env file not found (optional for development)")
        print_info("You can create one based on .env.example")
        return True  # Not critical for basic setup

def test_django_import():
    """Test Django configuration by importing settings."""
    print_info("Testing Django configuration...")
    try:
        # Try to detect settings module from manage.py if it exists
        manage_path = Path(__file__).parent / 'manage.py'
        settings_module = 'strategic_horizon.settings'  # default
        
        if manage_path.exists():
            with open(manage_path) as f:
                for line in f:
                    if 'DJANGO_SETTINGS_MODULE' in line and '=' in line:
                        # Extract settings module name from manage.py
                        parts = line.split("'")
                        if len(parts) >= 2:
                            settings_module = parts[1]
                            break
        
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
        import django
        django.setup()
        print_success("Django configuration loaded successfully")
        return True
    except Exception as e:
        print_error(f"Failed to load Django configuration: {e}")
        return False

def main():
    """Run all checks."""
    print("=" * 60)
    print("Strategic Horizon Backend Setup Verification")
    print("=" * 60)
    print()
    
    checks = [
        ("Python Version", check_python_version),
        ("Virtual Environment", check_virtual_env),
        ("requirements.txt", check_requirements_file),
        ("manage.py", check_manage_py),
        ("Django", check_django),
        ("Django REST Framework", check_drf),
        ("PostgreSQL Driver", check_database_driver),
        ("Other Dependencies", check_other_dependencies),
        (".env File", check_env_file),
        ("Django Configuration", test_django_import),
    ]
    
    results = []
    for name, check_func in checks:
        result = check_func()
        results.append((name, result))
        print()
    
    # Summary
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\nPassed: {passed}/{total}")
    
    if passed == total:
        print_success("\n✓ All checks passed! Your setup is ready.")
        print_info("\nNext steps:")
        print("  1. Ensure PostgreSQL is running")
        print("  2. Run migrations: python manage.py migrate")
        print("  3. Seed data: python manage.py seed_data")
        print("  4. Start server: python manage.py runserver")
        return 0
    else:
        print_warning("\n⚠ Some checks failed. Please review the output above.")
        print_info("\nCommon fixes:")
        print("  1. Activate virtual environment: source venv/bin/activate")
        print("  2. Install dependencies: pip install -r requirements.txt")
        print("  3. Check Python version: python --version (need 3.12+)")
        print("\nFor more help, see TROUBLESHOOTING.md")
        return 1

if __name__ == '__main__':
    sys.exit(main())
