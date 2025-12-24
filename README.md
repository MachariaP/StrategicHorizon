# 2026 Strategic Planner

A comprehensive full-stack productivity application designed to help users move from high-level vision to monthly execution. Built with Django Rest Framework (backend), React with TypeScript (frontend), and containerized with Docker.

## 🏗️ Architecture Overview

### Technology Stack

**Backend:**
- Django 4.2.8
- Django Rest Framework 3.14.0
- SimpleJWT for authentication
- PostgreSQL database
- Python 3.11

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- TanStack Query (React Query) for data fetching
- Axios for API communication

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 15
- Gunicorn (production WSGI server)

## 📋 Features & Data Models

The application includes the following core modules:

1. **Vision & Theme** - Yearly "North Star" statement and theme
2. **Goals** - Specific, measurable milestones with status tracking
3. **KPIs** - Key Performance Indicators linked to goals (Target vs. Actual)
4. **Non-Negotiables** - Daily/weekly boundaries or rules
5. **Systems** - Recurring processes and habits
6. **People** - Directory of mentors, partners, and supporters
7. **Executions** - Monthly roadmap (Jan–Dec) with task assignments
8. **Obstacles & Mitigations** - Pre-Mortem risk identification
9. **Quarterly Reflections** - Review module for Q1–Q4 pivots

All models include multi-tenancy support via ForeignKey to the User model.

## 🚀 Getting Started

### Prerequisites

**For Docker setup (Recommended):**
- Docker Desktop (includes Docker Compose)
- Git

**For local development:**
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Git

### Installation & Setup

#### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/MachariaP/StrategicHorizon.git
   cd StrategicHorizon
   ```

2. **Build and start the containers**
   ```bash
   docker-compose up --build
   ```
   
   This will:
   - Build the backend (Django) container
   - Build the frontend (React) container
   - Start PostgreSQL database
   - Set up networking between containers

3. **Run database migrations** (in a new terminal)
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

4. **Create a superuser** (for admin access)
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/

#### Option 2: Local Development (Without Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/MachariaP/StrategicHorizon.git
   cd StrategicHorizon
   ```

2. **Set up PostgreSQL database**
   
   Install PostgreSQL and create a database:
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # On macOS
   brew install postgresql
   
   # Create database (using default postgres superuser)
   sudo -u postgres psql
   CREATE DATABASE strategic_planner;
   ALTER USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE strategic_planner TO postgres;
   \q
   ```
   
   **Note:** For production, create a dedicated database user with a strong password.

3. **Configure environment variables**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit the `.env` file if needed. The default values are:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=strategic_planner
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   ```

4. **Set up Python backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

5. **Set up React frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/

## 🔧 Troubleshooting

### Database Connection Issues

**Problem:** `could not translate host name "db" to address`

**Solution:** This occurs when running Django locally without Docker. The application is trying to connect to the Docker service name "db" instead of "localhost".

1. **Create a .env file** in the `backend/` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Verify DATABASE_HOST is set correctly** in your `.env` file:
   ```
   DATABASE_HOST=localhost
   ```
   
   Note: Use `DATABASE_HOST=localhost` for local development, and `DATABASE_HOST=db` when running with Docker.

3. **Ensure PostgreSQL is running locally:**
   ```bash
   # On Ubuntu/Debian
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   
   # On macOS
   brew services list
   brew services start postgresql
   ```

4. **Verify database exists:**
   ```bash
   psql -U postgres -h localhost
   \l  # List databases
   \q  # Quit
   ```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Obtain tokens:**
   ```bash
   POST http://localhost:8000/api/token/
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```

2. **Refresh token:**
   ```bash
   POST http://localhost:8000/api/token/refresh/
   {
     "refresh": "your_refresh_token"
   }
   ```

3. **Use access token in requests:**
   ```
   Authorization: Bearer <access_token>
   ```

## 📡 API Endpoints

All API endpoints are prefixed with `/api/`:

- `/api/visions/` - Vision & Theme management
- `/api/goals/` - Goals CRUD operations
- `/api/kpis/` - KPI tracking
- `/api/non-negotiables/` - Non-negotiables management
- `/api/systems/` - Systems/habits tracking
- `/api/people/` - People directory
- `/api/executions/` - Monthly execution roadmap
- `/api/obstacles/` - Obstacles & mitigations
- `/api/reflections/` - Quarterly reflections

Each endpoint supports standard REST operations (GET, POST, PUT, PATCH, DELETE).

## 🎨 Frontend Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   └── Sidebar.tsx  # Navigation sidebar
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx        # Main dashboard view
│   │   └── ExecutionsView.tsx   # 12-month execution grid
│   ├── api.ts           # API client and endpoints
│   ├── types.ts         # TypeScript interfaces
│   └── App.tsx          # Main app component
└── ...
```

## 🗄️ Backend Structure

```
backend/
├── strategic_planner/   # Django project settings
│   ├── settings.py      # Configuration (CORS, JWT, DB)
│   └── urls.py          # Main URL routing
├── planner/             # Main Django app
│   ├── models.py        # Data models
│   ├── serializers.py   # DRF serializers
│   ├── views.py         # ViewSets
│   ├── urls.py          # App URL routing
│   └── admin.py         # Admin panel configuration
└── manage.py
```

## 🛠️ Development Commands

### Backend (Django)

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create migrations after model changes
docker-compose exec backend python manage.py makemigrations

# Access Django shell
docker-compose exec backend python manage.py shell

# Run tests
docker-compose exec backend python manage.py test
```

### Frontend (React)

```bash
# Install new packages
docker-compose exec frontend npm install <package-name>

# Run linting
docker-compose exec frontend npm run lint

# Build for production
docker-compose exec frontend npm run build
```

### Docker

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# View logs
docker-compose logs -f [service-name]

# Rebuild specific service
docker-compose up --build [service-name]
```

## 📝 Code Quality Standards

### Python (PEP 8)
- Use 4 spaces for indentation
- Maximum line length: 79 characters
- Follow Django naming conventions

### TypeScript/React
- Use ESLint and Prettier for code formatting
- Strict type checking enabled
- Follow functional component patterns
- Use React hooks for state management

## 🔒 Security Considerations

- Sensitive credentials stored in `.env` file (excluded from Git)
- JWT tokens for secure API authentication
- CORS properly configured for frontend-backend communication
- Django secret key should be changed in production
- Database credentials should be updated for production use

## 🌐 Production Deployment

For production deployment:

1. Set `DEBUG=False` in settings
2. Update `SECRET_KEY` to a secure random value
3. Configure proper `ALLOWED_HOSTS`
4. Use production-grade database credentials
5. Set up HTTPS/SSL certificates
6. Use Gunicorn with Nginx as reverse proxy
7. Enable Django's security middleware
8. Set up proper logging and monitoring

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django Rest Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Ensure code passes linting
6. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- MachariaP

---

**Note:** This application is designed for development and educational purposes. Ensure proper security measures are implemented before deploying to production.
