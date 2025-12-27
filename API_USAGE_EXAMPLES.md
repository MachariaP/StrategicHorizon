# API Usage Examples - Phase 1

## Authentication

### Login to Get JWT Token
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure_password"
  }'
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Vision API Examples

### 1. List Visions with Pagination
```bash
curl -X GET "http://localhost:8000/api/vision/?limit=5&offset=0" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

Response includes `goal_count`:
```json
{
  "count": 12,
  "next": "http://localhost:8000/api/vision/?limit=5&offset=5",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "year": 2026,
      "north_star": "Build a sustainable technology business that empowers creators worldwide",
      "yearly_theme": "Year of Innovation",
      "time_horizon": 5,
      "time_horizon_display": "5 Years",
      "five_whys": [
        "Why do I want this? To create lasting impact",
        "Why is impact important? To improve lives",
        "Why focus on creators? They drive culture"
      ],
      "is_active": true,
      "is_deleted": false,
      "deleted_at": null,
      "visual_url": "https://unsplash.com/photos/example",
      "created_at": "2025-12-27T10:00:00Z",
      "updated_at": "2025-12-27T10:00:00Z",
      "goal_count": 5
    }
  ]
}
```

### 2. Create a New Vision
```bash
curl -X POST http://localhost:8000/api/vision/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2026,
    "north_star": "Build a sustainable technology business that empowers creators worldwide with innovative tools",
    "yearly_theme": "Year of Innovation",
    "time_horizon": 5,
    "five_whys": [
      "Why do I want this? To create lasting impact",
      "Why is impact important? To improve lives"
    ],
    "is_active": true,
    "visual_url": "https://unsplash.com/photos/example"
  }'
```

Response:
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "year": 2026,
  "north_star": "Build a sustainable technology business...",
  "yearly_theme": "Year of Innovation",
  "goal_count": 0,
  "created_at": "2025-12-27T14:30:00Z"
}
```

### 3. Get Vision Detail
```bash
curl -X GET http://localhost:8000/api/vision/550e8400-e29b-41d4-a716-446655440000/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

### 4. Update Vision
```bash
curl -X PATCH http://localhost:8000/api/vision/550e8400-e29b-41d4-a716-446655440000/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "yearly_theme": "Year of Transformation"
  }'
```

### 5. Soft Delete (Archive) Vision
```bash
curl -X PATCH http://localhost:8000/api/vision/550e8400-e29b-41d4-a716-446655440000/soft-delete/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

Response:
```json
{
  "message": "Vision archived successfully. It's okay to pivot.",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 6. List Archived Visions
```bash
curl -X GET http://localhost:8000/api/vision/archived/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

### 7. Restore Archived Vision
```bash
curl -X PATCH http://localhost:8000/api/vision/550e8400-e29b-41d4-a716-446655440000/restore/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

## Goal API Examples

### 1. List Goals (Lightweight)
```bash
curl -X GET "http://localhost:8000/api/goals/?limit=10&offset=0" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

Response (lightweight, no full vision details):
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/goals/?limit=10&offset=10",
  "previous": null,
  "results": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440002",
      "vision": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Launch MVP by Q2",
      "description": "Complete and launch minimum viable product",
      "status": "in_progress",
      "confidence_level": 4,
      "target_date": "2026-06-30",
      "progress_percentage": 45.5,
      "kpi_count": 3,
      "created_at": "2025-12-27T10:00:00Z",
      "updated_at": "2025-12-27T10:00:00Z"
    }
  ]
}
```

### 2. Get Goal Detail (with Vision Details)
```bash
curl -X GET http://localhost:8000/api/goals/750e8400-e29b-41d4-a716-446655440002/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

Response (includes full vision details):
```json
{
  "id": "750e8400-e29b-41d4-a716-446655440002",
  "vision": "550e8400-e29b-41d4-a716-446655440000",
  "vision_details": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "year": 2026,
    "north_star": "Build a sustainable technology business...",
    "yearly_theme": "Year of Innovation",
    "time_horizon": 5,
    "time_horizon_display": "5 Years",
    "five_whys": ["Why 1", "Why 2"],
    "is_active": true,
    "is_deleted": false,
    "deleted_at": null,
    "visual_url": "https://unsplash.com/photos/example",
    "created_at": "2025-12-27T10:00:00Z",
    "updated_at": "2025-12-27T10:00:00Z",
    "goal_count": 5
  },
  "title": "Launch MVP by Q2",
  "description": "Complete and launch minimum viable product with core features",
  "status": "in_progress",
  "confidence_level": 4,
  "target_date": "2026-06-30",
  "is_deleted": false,
  "deleted_at": null,
  "progress_percentage": 45.5,
  "kpi_count": 3,
  "created_at": "2025-12-27T10:00:00Z",
  "updated_at": "2025-12-27T10:00:00Z"
}
```

### 3. Create a New Goal
```bash
curl -X POST http://localhost:8000/api/goals/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "vision": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Acquire 1000 Users",
    "description": "Grow user base to 1000 active users",
    "status": "pending",
    "confidence_level": 3,
    "target_date": "2026-09-30"
  }'
```

### 4. Update Goal Status
```bash
curl -X PATCH http://localhost:8000/api/goals/750e8400-e29b-41d4-a716-446655440002/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "confidence_level": 5
  }'
```

### 5. Update Goal Progress
```bash
curl -X PATCH http://localhost:8000/api/goals/750e8400-e29b-41d4-a716-446655440002/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "confidence_level": 4,
    "description": "Updated description with current progress"
  }'
```

## Pagination Examples

### Standard Pagination
```bash
# First page (20 items)
curl "http://localhost:8000/api/vision/?limit=20&offset=0"

# Second page (next 20 items)
curl "http://localhost:8000/api/vision/?limit=20&offset=20"

# Custom page size (50 items)
curl "http://localhost:8000/api/vision/?limit=50&offset=0"

# Maximum page size (100 items)
curl "http://localhost:8000/api/vision/?limit=100&offset=0"
```

### Using Next/Previous Links
Response includes pagination metadata:
```json
{
  "count": 156,
  "next": "http://localhost:8000/api/vision/?limit=20&offset=20",
  "previous": null,
  "results": [...]
}
```

## Error Handling Examples

### 1. Authentication Error (401)
```bash
curl -X GET http://localhost:8000/api/vision/
```

Response:
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 2. Permission Denied (404 - for security)
```bash
# Trying to access another user's vision
curl -X GET http://localhost:8000/api/vision/other-user-uuid/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

Response:
```json
{
  "detail": "Not found."
}
```

### 3. Validation Error (400)
```bash
curl -X POST http://localhost:8000/api/vision/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2026,
    "north_star": "Too short",
    "yearly_theme": "Test"
  }'
```

Response:
```json
{
  "north_star": [
    "North Star statement should be at least 10 words to encourage deep thinking. Current word count: 2"
  ]
}
```

### 4. Rate Limit Exceeded (429)
```bash
# After 100 requests in an hour to Vision API
curl -X GET http://localhost:8000/api/vision/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

Response:
```json
{
  "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

## Filtering Examples

### Filter Goals by Vision
```bash
curl "http://localhost:8000/api/goals/" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

### Filter Goals by Status (if implemented)
Note: This would require additional query parameter handling in the ViewSet
```bash
curl "http://localhost:8000/api/goals/?status=in_progress" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

## Strategic Shift Logging

Every POST/PATCH to Vision or Goals is logged:

**Log Entry Example:**
```json
{
  "timestamp": "2025-12-27T14:30:00.123456+00:00",
  "user": "john_doe",
  "user_id": 1,
  "method": "PATCH",
  "path": "/api/vision/550e8400-e29b-41d4-a716-446655440000/",
  "status_code": 200,
  "response_time": 0.234,
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "is_strategic_shift": true,
  "shift_type": "Vision",
  "request_body": {
    "yearly_theme": "Year of Transformation"
  }
}
```

## Python SDK Example

```python
import requests

class StrategicHorizonClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def list_visions(self, limit=20, offset=0):
        """List visions with pagination"""
        response = requests.get(
            f'{self.base_url}/api/vision/',
            headers=self.headers,
            params={'limit': limit, 'offset': offset}
        )
        return response.json()
    
    def create_goal(self, vision_id, title, description, **kwargs):
        """Create a new goal"""
        data = {
            'vision': vision_id,
            'title': title,
            'description': description,
            **kwargs
        }
        response = requests.post(
            f'{self.base_url}/api/goals/',
            headers=self.headers,
            json=data
        )
        return response.json()

# Usage
client = StrategicHorizonClient(
    'http://localhost:8000',
    'eyJ0eXAiOiJKV1QiLCJhbGc...'
)

visions = client.list_visions(limit=5)
print(f"Found {visions['count']} visions")
```

## JavaScript/TypeScript Example

```typescript
interface Vision {
  id: string;
  year: number;
  north_star: string;
  yearly_theme: string;
  goal_count: number;
}

class StrategicHorizonAPI {
  constructor(private baseUrl: string, private token: string) {}
  
  async listVisions(limit = 20, offset = 0): Promise<Vision[]> {
    const response = await fetch(
      `${this.baseUrl}/api/vision/?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      }
    );
    const data = await response.json();
    return data.results;
  }
  
  async createGoal(goalData: any): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/api/goals/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      }
    );
    return response.json();
  }
}

// Usage
const api = new StrategicHorizonAPI(
  'http://localhost:8000',
  'eyJ0eXAiOiJKV1QiLCJhbGc...'
);

const visions = await api.listVisions(5, 0);
console.log(`Found ${visions.length} visions`);
```

## Summary

### Key Features Demonstrated:
- ✅ UUID-based resource identification
- ✅ JWT authentication
- ✅ Relationship depth (goal_count, vision_details, kpi_count)
- ✅ Pagination with limit/offset
- ✅ Rate limiting protection
- ✅ Soft delete and restore
- ✅ Strategic shift audit logging
- ✅ Owner-only access control
- ✅ Comprehensive error handling

### Best Practices:
- Always include Authorization header
- Use UUIDs for resource identification
- Implement pagination for list endpoints
- Handle rate limiting gracefully
- Validate input on client side
- Use appropriate HTTP methods
- Check response status codes

---
**API Version**: v1 (Phase 1)
**Documentation Date**: December 27, 2025
**Base URL**: http://localhost:8000 (development)
