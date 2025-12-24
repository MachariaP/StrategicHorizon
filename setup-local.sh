#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# 2026 Strategic Planner Local Development Setup Script
# This script sets up the application for local development WITHOUT Docker

echo "🚀 Starting 2026 Strategic Planner Local Setup..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11 or higher."
    exit 1
fi

echo "✅ Python 3 is installed"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed or not in PATH."
    echo "   Please install PostgreSQL 15+ and ensure it's running."
    echo ""
    echo "   Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    echo ""
fi

# Create backend/.env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file from template..."
    cp backend/.env.example backend/.env
    echo "✅ backend/.env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env to match your PostgreSQL configuration:"
    echo "   - DATABASE_HOST=localhost (default)"
    echo "   - DATABASE_USER=postgres (default)"
    echo "   - DATABASE_PASSWORD=postgres (default)"
    echo "   - DATABASE_NAME=strategic_planner (default)"
    echo ""
else
    echo "ℹ️  backend/.env file already exists"
fi

# Setup backend
cd backend

echo "🐍 Setting up Python virtual environment..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "✅ Virtual environment created"
else
    echo "ℹ️  Virtual environment already exists"
fi

echo "📦 Activating virtual environment and installing dependencies..."
source .venv/bin/activate

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "🗄️  Database Setup Instructions:"
echo ""
echo "1. Make sure PostgreSQL is running:"
echo "   Ubuntu/Debian: sudo systemctl start postgresql"
echo "   macOS: brew services start postgresql"
echo ""
echo "2. Create the database (if not exists):"
echo "   sudo -u postgres psql"
echo "   CREATE DATABASE strategic_planner;"
echo "   CREATE USER postgres WITH PASSWORD 'postgres';"
echo "   GRANT ALL PRIVILEGES ON DATABASE strategic_planner TO postgres;"
echo "   \\q"
echo ""
echo "   ⚠️  SECURITY: For production, use a strong password and update your .env file!"
echo ""
echo "3. Run migrations:"
echo "   python manage.py migrate"
echo ""
echo "4. Create a superuser:"
echo "   python manage.py createsuperuser"
echo ""
echo "5. Start the development server:"
echo "   python manage.py runserver"
echo ""
echo "6. In another terminal, set up the frontend:"
echo "   cd frontend"
echo "   npm install"
echo "   npm start"
echo ""
echo "✅ Backend setup complete!"
echo ""
echo "Access the application:"
echo "  🔧 Backend API: http://localhost:8000/api/"
echo "  👤 Admin Panel: http://localhost:8000/admin/"
echo "  🌐 Frontend: http://localhost:3000"
echo ""
