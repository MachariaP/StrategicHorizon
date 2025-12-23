# 2026 Strategic Planner - Architectural Blueprint

## Executive Summary

This document provides a comprehensive architectural overview of the 2026 Strategic Planner, a full-stack productivity application built with Django REST Framework, React with TypeScript, and Docker containerization.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│                     (React + TypeScript)                     │
└─────────────────────────────────────────────────────────────┘
                              ▼
                         HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Docker Compose Network                     │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │   Frontend     │  │    Backend     │  │  PostgreSQL  │ │
│  │   Container    │◄─┤   Container    │◄─┤   Container  │ │
│  │  (Node:18)     │  │  (Python 3.11) │  │ (Postgres15) │ │
│  │  Port: 3000    │  │  Port: 8000    │  │  Port: 5432  │ │
│  └────────────────┘  └────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Details

#### Backend Stack
- **Framework**: Django 4.2.8
- **API Framework**: Django REST Framework 3.14.0
- **Authentication**: djangorestframework-simplejwt 5.3.1
- **CORS Handling**: django-cors-headers 4.3.1
- **Database Adapter**: psycopg2-binary 2.9.9
- **Environment Management**: python-dotenv 1.0.0
- **WSGI Server**: Gunicorn 21.2.0
- **Language**: Python 3.11

#### Frontend Stack
- **Framework**: React 18
- **Language**: TypeScript 4.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Routing**: React Router DOM 6.x

#### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL 15
- **Development Server (Backend)**: Django Dev Server
- **Development Server (Frontend)**: Create React App Dev Server

## Data Architecture

### Entity Relationship Overview

```
User (Django Auth)
  │
  ├─► Vision (1:N)
  │     └─► Goal (1:N)
  │           ├─► KPI (1:N)
  │           ├─► Execution (1:N)
  │           └─► Obstacle (1:N)
  │
  ├─► NonNegotiable (1:N)
  ├─► System (1:N)
  ├─► Person (1:N)
  └─► QuarterlyReflection (1:N)
```

### Data Models

#### 1. Vision
**Purpose**: Yearly North Star statement and theme
- `user` (FK to User)
- `year` (Integer, unique per user)
- `north_star` (Text)
- `yearly_theme` (CharField)
- Timestamps: created_at, updated_at

#### 2. Goal
**Purpose**: Specific, measurable milestones
- `user` (FK to User)
- `vision` (FK to Vision, optional)
- `title` (CharField)
- `description` (Text)
- `status` (Choice: pending, in_progress, completed)
- `target_date` (Date, optional)
- Timestamps: created_at, updated_at

#### 3. KPI (Key Performance Indicator)
**Purpose**: Numeric tracking linked to goals
- `user` (FK to User)
- `goal` (FK to Goal)
- `name` (CharField)
- `description` (Text)
- `target_value` (Decimal)
- `actual_value` (Decimal)
- `unit` (CharField)
- Computed: progress_percentage
- Timestamps: created_at, updated_at

#### 4. NonNegotiable
**Purpose**: Daily/weekly boundaries or rules
- `user` (FK to User)
- `title` (CharField)
- `description` (Text)
- `frequency` (Choice: daily, weekly, monthly)
- Timestamps: created_at, updated_at

#### 5. System
**Purpose**: Recurring processes and habits
- `user` (FK to User)
- `name` (CharField)
- `description` (Text)
- `frequency` (CharField)
- Timestamps: created_at, updated_at

#### 6. Person
**Purpose**: Directory of mentors, partners, supporters
- `user` (FK to User)
- `name` (CharField)
- `role` (Choice: mentor, partner, supporter, advisor, other)
- `role_description` (Text)
- `contact_info` (CharField, optional)
- `notes` (Text, optional)
- Timestamps: created_at, updated_at

#### 7. Execution
**Purpose**: Monthly roadmap with specific tasks
- `user` (FK to User)
- `goal` (FK to Goal, optional)
- `title` (CharField)
- `description` (Text)
- `month` (Integer 1-12)
- `year` (Integer)
- `status` (Choice: planned, in_progress, completed, deferred)
- Timestamps: created_at, updated_at

#### 8. Obstacle
**Purpose**: Pre-Mortem risk identification
- `user` (FK to User)
- `goal` (FK to Goal, optional)
- `title` (CharField)
- `description` (Text)
- `severity` (Choice: low, medium, high, critical)
- `mitigation` (Text)
- Timestamps: created_at, updated_at

#### 9. QuarterlyReflection
**Purpose**: Review module for Q1-Q4
- `user` (FK to User)
- `quarter` (Integer 1-4, unique per user per year)
- `year` (Integer)
- `wins` (Text)
- `challenges` (Text)
- `lessons_learned` (Text)
- `adjustments` (Text)
- Timestamps: created_at, updated_at

## API Architecture

### Authentication Flow

```
1. User Login
   POST /api/token/
   → Returns: { access: "...", refresh: "..." }

2. API Request with Token
   GET /api/goals/
   Header: Authorization: Bearer <access_token>

3. Token Refresh (when expired)
   POST /api/token/refresh/
   Body: { refresh: "..." }
   → Returns: { access: "..." }
```

### REST API Endpoints

All endpoints follow REST conventions with ModelViewSets:

| Resource | Endpoint | Methods | Description |
|----------|----------|---------|-------------|
| Vision | /api/visions/ | GET, POST, PUT, PATCH, DELETE | Manage yearly visions |
| Goals | /api/goals/ | GET, POST, PUT, PATCH, DELETE | Manage goals |
| Goals Filter | /api/goals/by_status/ | GET | Filter by status |
| KPIs | /api/kpis/ | GET, POST, PUT, PATCH, DELETE | Manage KPIs |
| Non-Negotiables | /api/non-negotiables/ | GET, POST, PUT, PATCH, DELETE | Manage boundaries |
| Systems | /api/systems/ | GET, POST, PUT, PATCH, DELETE | Manage systems |
| People | /api/people/ | GET, POST, PUT, PATCH, DELETE | Manage contacts |
| Executions | /api/executions/ | GET, POST, PUT, PATCH, DELETE | Manage monthly tasks |
| Executions Filter | /api/executions/by_month/ | GET | Filter by month/year |
| Obstacles | /api/obstacles/ | GET, POST, PUT, PATCH, DELETE | Manage risks |
| Reflections | /api/reflections/ | GET, POST, PUT, PATCH, DELETE | Manage reviews |

### Request/Response Format

**Standard List Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "field1": "value1",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

**Pagination:** Enabled with 100 items per page (configurable)

**Error Response:**
```json
{
  "detail": "Error message",
  "field_name": ["Error for specific field"]
}
```

## Frontend Architecture

### Component Hierarchy

```
App (QueryClientProvider, Router)
  └── Layout
      ├── Sidebar (Navigation)
      └── Main Content
          ├── Dashboard (Vision + Goals Summary)
          ├── ExecutionsView (12-month grid)
          ├── Vision Page
          ├── Goals Page
          ├── KPIs Page
          ├── Non-Negotiables Page
          ├── Systems Page
          ├── People Page
          ├── Obstacles Page
          └── Reflections Page
```

### State Management Strategy

1. **Server State**: Managed by TanStack Query (React Query)
   - Automatic caching
   - Background refetching
   - Optimistic updates
   - Error handling

2. **Local State**: React useState/useReducer
   - Form inputs
   - UI state (modals, toggles)

3. **Authentication State**: localStorage
   - Access token
   - Refresh token

### Type Safety

All API responses are typed with TypeScript interfaces defined in `types.ts`:
- Prevents runtime type errors
- Enables IDE autocomplete
- Documents API contracts
- Catches errors at compile time

## Security Architecture

### Authentication & Authorization

1. **JWT Token-Based Authentication**
   - Access tokens: 1 hour lifetime
   - Refresh tokens: 7 days lifetime
   - Automatic token rotation

2. **Multi-Tenancy**
   - All data scoped to authenticated user
   - Foreign key relationships enforce data isolation
   - ViewSets filter by request.user

3. **CORS Configuration**
   - Explicitly allowed origins
   - Credentials support enabled
   - Secure headers

### Security Best Practices Implemented

- ✅ Environment variables for secrets
- ✅ HTTPS enforced in production
- ✅ CSRF protection enabled
- ✅ SQL injection prevention (ORM)
- ✅ XSS protection (React auto-escaping)
- ✅ Password hashing (Django default)
- ✅ Admin panel access control

## Docker Architecture

### Container Communication

```
Frontend Container (port 3000)
  │
  └─► Backend Container (port 8000)
        │
        └─► Database Container (port 5432)
```

### Volumes

- `postgres_data`: Persistent PostgreSQL data
- `./backend:/app`: Backend code (hot reload)
- `./frontend:/app`: Frontend code (hot reload)
- `/app/node_modules`: Node modules (performance)

### Environment Variables

All sensitive configuration managed via `.env` file:
- Database credentials
- Secret keys
- Debug settings
- CORS origins
- API URLs

## Scalability Considerations

### Current Design Supports

1. **Horizontal Scaling**
   - Stateless API design
   - Token-based authentication
   - Containerized services

2. **Database Optimization**
   - Indexed foreign keys
   - Efficient queries via DRF
   - Pagination enabled

3. **Frontend Performance**
   - Code splitting (React lazy loading)
   - Query caching (React Query)
   - Optimized builds

### Future Enhancements

- Load balancing (multiple backend containers)
- Redis caching layer
- CDN for static assets
- Database read replicas
- WebSocket support for real-time updates
- Background task processing (Celery)

## Development Workflow

### Local Development

1. Start: `docker-compose up`
2. Code changes auto-reload
3. Database persists across restarts

### Making Changes

**Backend:**
1. Edit models → `makemigrations` → `migrate`
2. Edit views/serializers → Auto-reload
3. Add packages → Update requirements.txt

**Frontend:**
1. Edit components → Auto-reload (HMR)
2. Add packages → `npm install` in container
3. Update types → TypeScript checks

### Testing Strategy

**Backend:**
- Django test framework
- DRF test utilities
- Coverage reporting

**Frontend:**
- Jest for unit tests
- React Testing Library
- Type checking via TypeScript

## Deployment Architecture (Production)

### Recommended Stack

```
Internet
  │
  └─► Nginx (Reverse Proxy + Static Files)
       │
       ├─► Gunicorn (WSGI Server) → Django Backend
       │     │
       │     └─► PostgreSQL (Managed DB)
       │
       └─► React Build (Static Files)
```

### Production Checklist

- [ ] Set DEBUG=False
- [ ] Generate new SECRET_KEY
- [ ] Configure ALLOWED_HOSTS
- [ ] Use managed PostgreSQL
- [ ] Set up HTTPS/SSL
- [ ] Configure static file serving
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Configure logging
- [ ] Set up backups
- [ ] Enable Django security middleware
- [ ] Use production-grade secrets management

## Monitoring & Observability

### Recommended Tools

- **Application Monitoring**: Sentry, New Relic
- **Log Aggregation**: ELK Stack, CloudWatch
- **Performance Monitoring**: Django Debug Toolbar (dev)
- **Database Monitoring**: PostgreSQL logs, pgAdmin
- **Uptime Monitoring**: Pingdom, UptimeRobot

## Maintenance & Updates

### Regular Tasks

- Database backups (automated)
- Dependency updates (security patches)
- Log rotation
- Performance monitoring
- User feedback integration

### Update Strategy

1. Test in development
2. Review changes in staging
3. Deploy to production with rollback plan
4. Monitor for issues
5. Document changes

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable productivity application. The modular design allows for easy extension and modification, while the containerized approach ensures consistency across development and production environments.

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Author**: MachariaP
