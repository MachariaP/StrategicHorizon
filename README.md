# Strategic Horizon - 2026 Strategic Planner

> 🚀 **Phase 1 Backend Complete** - Professional Django/DRF implementation with UUID models, enhanced APIs, comprehensive security, and full test coverage.

## 📢 Project Status

### ✅ Phase 1: Backend Tuning (COMPLETE)
- **Status**: Production-ready
- **Test Coverage**: 29 tests, 100% passing
- **Security**: 0 vulnerabilities (CodeQL verified)
- **Features**: UUID models, BaseModel inheritance, IsOwner permissions, rate limiting, enhanced serializers with relationship depth, strategic shifts logging
- **Documentation**: Complete (4 comprehensive guides)

### 🔄 Phase 2: Frontend Development (Pending)
- React + TypeScript
- TanStack Query + Zustand
- React Hook Form + Zod
- Responsive UI with Tailwind

---

A comprehensive full-stack strategic planning application that helps users transform their vision into actionable monthly executions. Built with Django REST Framework and React with TypeScript.

## 🎯 Overview

Strategic Horizon is designed to help individuals and teams move from high-level vision to monthly execution through a structured planning framework. The application provides 10 core modules:

1. **Dashboard** - Overview of all planning elements
2. **Vision & Theme** - Yearly "North Star" statement and theme
3. **Goals** - Specific, measurable milestones with status tracking
4. **KPIs** - Key Performance Indicators linked to goals
5. **Non-Negotiables** - Daily/weekly boundaries or rules
6. **Systems** - Recurring processes and habits
7. **People** - Directory of mentors, partners, and supporters
8. **Executions** - Monthly roadmap (Jan–Dec) with task assignments
9. **Obstacles & Mitigations** - Pre-Mortem risk identification
10. **Quarterly Reflections** - Review module for Q1–Q4 pivots

## 🏗️ Architecture

### Phase 1 Backend Enhancements ⭐ NEW

**Professional-Grade Improvements:**
- ✅ **BaseModel** with UUID primary keys, timestamps, and soft delete
- ✅ **Enhanced Serializers** with relationship depth (goal_count, vision_details, kpi_count)
- ✅ **IsOwner Permissions** for secure data isolation
- ✅ **Rate Limiting** (100-200 req/hour per endpoint)
- ✅ **Strategic Shifts Logging** for Vision and Goals changes
- ✅ **LimitOffsetPagination** (20 default, 100 max)
- ✅ **Type Hints** throughout codebase
- ✅ **Comprehensive Tests** (29 tests, 100% passing)

See [PHASE1_IMPLEMENTATION.md](./PHASE1_IMPLEMENTATION.md) for complete details.

### Technology Stack

**Backend:**
- Django 6.0
- Django REST Framework 3.16.1
- SimpleJWT for authentication
- PostgreSQL database (SQLite for dev)
- Python 3.12

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication

### Project Structure

```
StrategicHorizon/
├── backend/
│   ├── strategic_horizon/      # Django project settings
│   ├── core/                   # ⭐ NEW: BaseModel, permissions, pagination
│   ├── auth_app/               # Authentication & user management
│   ├── vision/                 # Vision & Theme module (UUID, enhanced)
│   ├── goals/                  # Goals module (UUID, enhanced)
│   ├── kpis/                   # KPIs module
│   ├── non_negotiables/        # Non-Negotiables module
│   ├── systems/                # Systems module
│   ├── people/                 # People module
│   ├── executions/             # Executions module
│   ├── obstacles/              # Obstacles module
│   ├── reflections/            # Quarterly Reflections module
│   ├── manage.py
│   └── requirements.txt
├── PHASE1_IMPLEMENTATION.md    # ⭐ Complete Phase 1 guide
├── PHASE1_COMPLETION_SUMMARY.md # ⭐ Completion summary
├── SECURITY_SUMMARY.md         # ⭐ Security assessment
├── API_USAGE_EXAMPLES.md       # ⭐ API usage examples
└── frontend/
    ├── src/
    │   ├── components/         # Reusable UI components
    │   │   └── Sidebar.tsx     # Navigation sidebar
    │   ├── pages/              # Page components
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── VisionPage.tsx
    │   │   ├── GoalsPage.tsx
    │   │   ├── KPIsPage.tsx
    │   │   ├── NonNegotiablesPage.tsx
    │   │   ├── SystemsPage.tsx
    │   │   ├── PeoplePage.tsx
    │   │   ├── ExecutionsPage.tsx
    │   │   ├── ObstaclesPage.tsx
    │   │   └── ReflectionsPage.tsx
    │   ├── api.ts              # API client and endpoints
    │   ├── types.ts            # TypeScript interfaces
    │   └── App.tsx             # Main app component
    ├── package.json
    └── .env
```

## 🚀 Getting Started

> 📖 **New to the project?** Check out our [Quick Start Guide](./QUICK_START.md) for a streamlined setup experience!
> 
> ⚠️ **Experiencing issues?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common problems and solutions.

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL 15+
- Git

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/MachariaP/StrategicHorizon.git
cd StrategicHorizon
```

#### 2. Set up PostgreSQL database

```bash
# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# On macOS
brew install postgresql
brew services start postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE strategic_planner;
ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE strategic_planner TO postgres;
\q
```

#### 3. Set up Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Upgrade pip (recommended)
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Verify setup (optional but recommended)
python verify_setup.py

# The .env file should already exist with database configuration
# If not, create it with:
# DATABASE_NAME=strategic_planner
# DATABASE_USER=postgres
# DATABASE_PASSWORD=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432

# Run migrations
python manage.py migrate

# Seed the database with sample data
python manage.py seed_data

# Start the development server
python manage.py runserver
```

**⚠️ Important:** Always ensure your virtual environment is activated before running any Python commands. You should see `(venv)` in your terminal prompt.

**Having issues?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common problems and solutions.

The backend will be available at http://localhost:8000

#### 4. Set up Frontend

```bash
cd frontend

# Install dependencies
npm install

# The .env file should already exist with:
# REACT_APP_API_URL=http://localhost:8000

# Start the development server
npm start
```

The frontend will be available at http://localhost:3000

## 🎨 UI Screenshots & Examples

### Login Page
The login page provides a clean, modern interface for user authentication with demo credentials displayed for easy access.

### Dashboard
The dashboard provides a comprehensive overview:
- **Vision Card**: Displays the yearly theme and north star statement
- **Statistics**: Shows total goals, goals in progress, completed goals, and average KPI progress
- **Recent Goals**: List of the most recent goals with their status
- **Upcoming Executions**: Preview of planned executions for the coming months
- **KPI Progress**: Visual progress bars showing actual vs. target values

### Vision & Theme Page
Displays the yearly vision statement and theme in an attractive card format with emoji icons for visual appeal.

### Goals Page
Goals are displayed in a grid layout with:
- Goal title and description
- Status badges (Pending, In Progress, Completed)
- Target dates
- Color-coded status indicators

### KPIs Page
Each KPI shows:
- Name and description
- Progress percentage
- Visual progress bar
- Actual value vs. target value
- Unit of measurement

### Non-Negotiables Page
Displayed in a grid of cards showing:
- Frequency (Daily, Weekly, Monthly)
- Title and description
- Color-coded frequency badges

### Systems Page
Systems are shown as detailed cards including:
- System name
- Description
- Frequency information
- System icon

### People Page
People directory shows:
- Name and role
- Role description
- Contact information
- Notes and additional details
- Profile icon

### Executions Page
Monthly executions displayed in a grid with:
- Month and year
- Title and description
- Status indicators (Planned, In Progress, Completed, Deferred)
- Color-coded status badges

### Obstacles Page
Obstacles are shown with:
- Title and severity level
- Problem description
- Mitigation strategy
- Color-coded severity indicators (Low, Medium, High, Critical)

### Reflections Page
Quarterly reflections show four key sections:
- ✅ Wins
- ⚠️ Challenges
- 💡 Lessons Learned
- 🎯 Adjustments

Each section is clearly labeled and color-coded for easy scanning.

## 🔐 Authentication

### Demo Account

A demo account is created when you seed the database:
- **Username:** demo
- **Password:** demo123

### API Endpoints

Authentication uses JWT tokens:

```bash
# Login
POST /api/auth/login/
{
  "username": "demo",
  "password": "demo123"
}

# Register
POST /api/auth/register/
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "password2": "securepassword"
}

# Get current user
GET /api/auth/user/
Authorization: Bearer <access_token>
```

## 📡 API Documentation

All API endpoints are prefixed with `/api/`:

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/user/` - Get current user info

### Data Modules
Each module supports standard REST operations (GET, POST, PUT, DELETE):

- `/api/vision/` - Vision & Theme management
- `/api/goals/` - Goals CRUD operations
- `/api/kpis/` - KPI tracking
- `/api/non-negotiables/` - Non-negotiables management
- `/api/systems/` - Systems/habits tracking
- `/api/people/` - People directory
- `/api/executions/` - Monthly execution roadmap
- `/api/obstacles/` - Obstacles & mitigations
- `/api/reflections/` - Quarterly reflections

## 🗄️ Data Seeding

The project includes a comprehensive data seeding command that creates sample data for all modules:

```bash
python manage.py seed_data
```

This command:
- Creates a demo user (username: demo, password: demo123)
- Seeds sample data for all 9 modules
- Creates realistic example data with proper relationships

## 🔧 Development

### Backend Commands

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for admin panel
python manage.py createsuperuser

# Access Django shell
python manage.py shell

# Run development server
python manage.py runserver
```

### Frontend Commands

```bash
# Install new packages
npm install <package-name>

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🌟 Key Features

### Separate Apps Architecture
Each functional area is organized into its own Django app, promoting:
- **Modularity**: Each app is self-contained with its own models, views, and serializers
- **Maintainability**: Easy to update individual modules without affecting others
- **Scalability**: New features can be added as new apps
- **Code Organization**: Clear separation of concerns

### Data Relationships
The modules are interconnected:
- Goals can be linked to Visions
- KPIs are linked to Goals
- Executions can reference Goals
- Obstacles can be associated with Goals

### Authentication & Security
- JWT-based authentication
- Token refresh mechanism
- Password validation
- User-specific data isolation
- CORS configuration for frontend-backend communication

### User Experience
- Responsive design with Tailwind CSS
- Intuitive navigation with sidebar
- Real-time data updates
- Visual progress indicators
- Color-coded status badges
- Emoji icons for visual appeal

## 🔒 Security Considerations

- All API endpoints require authentication (except login/register)
- JWT tokens for secure authentication
- CORS properly configured
- Database credentials stored in .env file
- User data isolation (users can only see their own data)

## 📚 Tech Stack Details

### Backend Technologies
- **Django 6.0**: Web framework
- **Django REST Framework**: API development
- **SimpleJWT**: JWT authentication
- **PostgreSQL**: Database
- **python-dotenv**: Environment variable management
- **CORS Headers**: Cross-origin resource sharing

### Frontend Technologies
- **React 18**: UI library
- **TypeScript**: Type safety
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- MachariaP

## 🙏 Acknowledgments

Built with modern best practices:
- Separate Django apps for each feature
- RESTful API design
- TypeScript for type safety
- Real database seeding instead of mocked data
- Comprehensive documentation

---

**Note:** This is a development version. For production deployment, ensure proper security measures including:
- Changing SECRET_KEY
- Setting DEBUG=False
- Using strong database passwords
- Implementing HTTPS
- Setting up proper hosting
