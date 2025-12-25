# API Reference - 2026 Strategic Planner

Complete API documentation for the Strategic Planner REST API.

## Base URL
```
http://localhost:8000/api/
```

## Authentication

### Obtain JWT Token
```http
POST /api/token/
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Token
```http
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "your_refresh_token"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Using Authentication
Include the access token in all requests:
```http
Authorization: Bearer your_access_token
```

---

## Vision & Theme

### List All Visions
```http
GET /api/visions/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "username": "john",
    "year": 2026,
    "north_star": "Become the leading innovator in sustainable technology",
    "yearly_theme": "Year of Scale",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

### Create Vision
```http
POST /api/visions/
Content-Type: application/json

{
  "year": 2026,
  "north_star": "Your vision statement",
  "yearly_theme": "Your theme"
}
```

### Update Vision
```http
PATCH /api/visions/{id}/
Content-Type: application/json

{
  "yearly_theme": "Updated theme"
}
```

### Delete Vision
```http
DELETE /api/visions/{id}/
```

---

## Goals

### List All Goals
```http
GET /api/goals/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "username": "john",
    "vision": 1,
    "title": "Launch MVP",
    "description": "Launch minimum viable product by Q2",
    "status": "in_progress",
    "target_date": "2026-06-30",
    "kpis": [
      {
        "id": 1,
        "name": "User Signups",
        "target_value": 1000,
        "actual_value": 250,
        "unit": "users",
        "progress_percentage": 25.0
      }
    ],
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

### Get Goals by Status
```http
GET /api/goals/by_status/?status=in_progress
```

### Create Goal
```http
POST /api/goals/
Content-Type: application/json

{
  "vision": 1,
  "title": "Goal title",
  "description": "Goal description",
  "status": "pending",
  "target_date": "2026-12-31"
}
```

### Update Goal
```http
PATCH /api/goals/{id}/
Content-Type: application/json

{
  "status": "completed"
}
```

### Delete Goal
```http
DELETE /api/goals/{id}/
```

---

## KPIs (Key Performance Indicators)

### List All KPIs
```http
GET /api/kpis/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "goal": 1,
    "name": "Monthly Revenue",
    "description": "Total monthly recurring revenue",
    "target_value": 10000.00,
    "actual_value": 7500.00,
    "unit": "USD",
    "progress_percentage": 75.0,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

### Create KPI
```http
POST /api/kpis/
Content-Type: application/json

{
  "goal": 1,
  "name": "KPI name",
  "description": "KPI description",
  "target_value": 100,
  "actual_value": 0,
  "unit": "units"
}
```

### Update KPI
```http
PATCH /api/kpis/{id}/
Content-Type: application/json

{
  "actual_value": 50
}
```

---

## Non-Negotiables

### List All Non-Negotiables
```http
GET /api/non-negotiables/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "title": "Morning Exercise",
    "description": "30 minutes of exercise before 9 AM",
    "frequency": "daily",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

### Create Non-Negotiable
```http
POST /api/non-negotiables/
Content-Type: application/json

{
  "title": "Rule title",
  "description": "Rule description",
  "frequency": "daily"
}
```

**Frequency Options:** `daily`, `weekly`, `monthly`

---

## Systems

### List All Systems
```http
GET /api/systems/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "name": "Sunday Weekly Review",
    "description": "Review past week and plan next week",
    "frequency": "Weekly on Sunday",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

### Create System
```http
POST /api/systems/
Content-Type: application/json

{
  "name": "System name",
  "description": "System description",
  "frequency": "Frequency description"
}
```

---

## People

### List All People
```http
GET /api/people/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "name": "Jane Doe",
    "role": "mentor",
    "role_description": "Business strategy mentor",
    "contact_info": "jane@example.com",
    "notes": "Monthly check-ins",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

### Create Person
```http
POST /api/people/
Content-Type: application/json

{
  "name": "Person name",
  "role": "mentor",
  "role_description": "Role description",
  "contact_info": "email@example.com",
  "notes": "Additional notes"
}
```

**Role Options:** `mentor`, `partner`, `supporter`, `advisor`, `other`

---

## Executions (Monthly Roadmap)

### List All Executions
```http
GET /api/executions/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "goal": 1,
    "title": "Launch Marketing Campaign",
    "description": "Social media and email marketing push",
    "month": 3,
    "month_display": "March",
    "year": 2026,
    "status": "planned",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

### Get Executions by Month
```http
GET /api/executions/by_month/?month=3&year=2026
```

### Create Execution
```http
POST /api/executions/
Content-Type: application/json

{
  "goal": 1,
  "title": "Task title",
  "description": "Task description",
  "month": 6,
  "year": 2026,
  "status": "planned"
}
```

**Month:** Integer 1-12  
**Status Options:** `planned`, `in_progress`, `completed`, `deferred`

---

## Obstacles & Mitigations

### List All Obstacles
```http
GET /api/obstacles/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "goal": 1,
    "title": "Budget Constraints",
    "description": "Limited marketing budget may affect reach",
    "severity": "medium",
    "mitigation": "Focus on organic growth and partnerships",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

### Create Obstacle
```http
POST /api/obstacles/
Content-Type: application/json

{
  "goal": 1,
  "title": "Obstacle title",
  "description": "Obstacle description",
  "severity": "medium",
  "mitigation": "Mitigation strategy"
}
```

**Severity Options:** `low`, `medium`, `high`, `critical`

---

## Quarterly Reflections

### List All Reflections
```http
GET /api/reflections/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "quarter": 1,
    "quarter_display": "Q1",
    "year": 2026,
    "wins": "Launched MVP successfully",
    "challenges": "Slower user acquisition than expected",
    "lessons_learned": "Need better onboarding process",
    "adjustments": "Focus on user experience improvements",
    "created_at": "2026-04-01T00:00:00Z",
    "updated_at": "2026-04-01T00:00:00Z"
  }
]
```

### Create Reflection
```http
POST /api/reflections/
Content-Type: application/json

{
  "quarter": 1,
  "year": 2026,
  "wins": "What went well",
  "challenges": "What didn't go as planned",
  "lessons_learned": "Key takeaways",
  "adjustments": "Plan adjustments"
}
```

**Quarter:** Integer 1-4 (Q1, Q2, Q3, Q4)

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["This field is required."]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error."
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production:
- Consider implementing rate limiting per user/IP
- Use Django Rest Framework throttling
- Monitor API usage

---

## Pagination

All list endpoints support pagination with 100 items per page by default.

```http
GET /api/goals/?page=2
```

**Response includes:**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/goals/?page=3",
  "previous": "http://localhost:8000/api/goals/?page=1",
  "results": [...]
}
```

---

## Best Practices

1. **Always include Authorization header** with valid token
2. **Use HTTPS in production** to protect tokens
3. **Handle token expiration** - refresh when needed
4. **Validate input** on client side before sending
5. **Handle errors gracefully** - show user-friendly messages
6. **Cache responses** when appropriate
7. **Use pagination** for large datasets

---

## CORS Configuration

The API allows requests from:
- `http://localhost:3000` (development)

Update `CORS_ALLOWED_ORIGINS` in settings for production domains.

---

## Testing with cURL

### Example: Create a Goal
```bash
# 1. Get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}' \
  | jq -r '.access')

# 2. Create goal
curl -X POST http://localhost:8000/api/goals/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Goal",
    "description": "Goal description",
    "status": "pending"
  }'
```

---

## API Client Libraries

### JavaScript/TypeScript
The frontend includes a complete API client in `frontend/src/api.ts`.

### Python
```python
import requests

# Get token
response = requests.post(
    'http://localhost:8000/api/token/',
    json={'username': 'admin', 'password': 'password'}
)
token = response.json()['access']

# Make authenticated request
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:8000/api/goals/', headers=headers)
goals = response.json()
```

---

## Support

For API issues or questions:
1. Check the [README.md](README.md) for setup help
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
3. Check Django logs in your terminal or console
4. Open an issue on GitHub

---

**API Version:** 1.0  
**Last Updated:** December 2024
