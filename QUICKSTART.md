# Quick Start Guide - 2026 Strategic Planner

Get up and running with the 2026 Strategic Planner in 5 minutes!

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Git installed

## Installation (5 Steps)

### Step 1: Clone the Repository
```bash
git clone https://github.com/MachariaP/StrategicHorizon.git
cd StrategicHorizon
```

### Step 2: Run the Setup Script
```bash
./setup.sh
```

This will:
- Create environment configuration
- Build Docker containers
- Start all services
- Run database migrations

### Step 3: Create an Admin User
```bash
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### Step 4: Access the Application

Open your browser and visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

### Step 5: Create Your First Vision

1. Log in to the admin panel (http://localhost:8000/admin/)
2. Add a new Vision for year 2026
3. Add some Goals linked to your Vision
4. Visit the frontend (http://localhost:3000) to see your dashboard

## Common Commands

### View Application Logs
```bash
docker-compose logs -f
```

### Stop the Application
```bash
docker-compose down
```

### Restart the Application
```bash
docker-compose up
```

### Access Backend Shell
```bash
docker-compose exec backend python manage.py shell
```

### Access Database Shell
```bash
docker-compose exec db psql -U postgres -d strategic_planner
```

## Troubleshooting

### Containers Won't Start
```bash
# Stop all containers
docker-compose down

# Remove volumes (⚠️ This deletes your data!)
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

### Port Already in Use
If ports 3000, 8000, or 5432 are already in use, edit `docker-compose.yml` to change the port mappings.

### Frontend Shows "Failed to Load"
1. Ensure backend is running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Verify you're logged in to the admin panel first

## Next Steps

1. **Explore the Data Models**: See ARCHITECTURE.md for details
2. **Add Sample Data**: Use the admin panel to populate your planner
3. **Customize**: Modify the code to fit your needs
4. **Read the Full Docs**: Check README.md for comprehensive information

## Getting Help

- **Documentation**: See README.md and ARCHITECTURE.md
- **Issues**: Create an issue on GitHub
- **Logs**: Check `docker-compose logs` for error messages

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

- Backend code changes auto-reload (Django dev server)
- Frontend code changes auto-reload (Hot Module Replacement)
- Database data persists across container restarts
- Use `.gitignore` to avoid committing sensitive files

---

**Happy Planning! 🚀**

For detailed documentation, see:
- [README.md](README.md) - Complete setup and usage guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture details
