#!/bin/bash

# 2026 Strategic Planner Setup Script

echo "🚀 Starting 2026 Strategic Planner Setup..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi

# Build and start containers
echo "🏗️  Building Docker containers (this may take a few minutes)..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T backend python manage.py migrate

# Check if superuser should be created
echo ""
echo "📋 Setup complete!"
echo ""
echo "To create an admin user, run:"
echo "  docker-compose exec backend python manage.py createsuperuser"
echo ""
echo "Access the application:"
echo "  🌐 Frontend: http://localhost:3000"
echo "  🔧 Backend API: http://localhost:8000/api/"
echo "  👤 Admin Panel: http://localhost:8000/admin/"
echo ""
echo "To view logs, run:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application, run:"
echo "  docker-compose down"
echo ""
