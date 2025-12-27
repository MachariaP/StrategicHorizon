# Vision Module - Implementation Documentation

## Overview

The Vision Module transforms the Strategic Horizon application into a **context engine** rather than just a data store. It implements a sophisticated system for managing strategic visions with deep reflection capabilities, soft deletion, and dynamic time horizon planning.

## Architecture

### Backend: Django REST Framework

#### 1. Model Layer (`models.py`)

**Enhanced Vision Model** with the following key features:

- **Time Horizon**: Integer choices (1, 3, 5, 10 years) for strategic planning periods
- **Five Whys**: JSONField storing an array of "why" statements for deeper understanding
- **Soft Delete System**: 
  - `is_active`: Boolean flag for active status
  - `is_deleted`: Boolean flag for soft deletion
  - `deleted_at`: Timestamp of deletion
- **Visual URL**: Link to Unsplash or uploaded image for vision representation
- **Custom Methods**:
  - `soft_delete()`: Performs soft deletion with timestamp
  - `restore()`: Restores a soft-deleted vision

#### 2. Manager Layer (`managers.py`)

**VisionManager** - Custom QuerySet manager that:
- Filters out deleted visions by default with `get_queryset()`
- Provides `archived()` method to access soft-deleted visions
- Provides `active()` method for active visions only
- Works alongside `all_objects` manager for full access when needed

#### 3. Serializer Layer (`serializers.py`)

**VisionSerializer** with validation:
- Enforces minimum 10-word count on North Star statements to encourage deep thinking
- Validates Five Whys array structure (max 5 items, non-empty strings)
- Exposes time horizon display name for frontend
- Read-only fields for deletion tracking

**VisionArchiveSerializer**:
- Read-only serializer for archived visions
- Used in vault/archive retrieval

#### 4. Views Layer (`views.py`)

**VisionViewSet** with custom actions:
- Standard CRUD operations
- `soft_delete/`: PATCH endpoint for archiving visions
- `restore/`: PATCH endpoint for restoring archived visions
- `archived/`: GET endpoint for retrieving all archived visions

#### 5. Middleware (`middleware.py`)

**VisionPresenceMiddleware** - Context tracking system:
- Monitors last user interaction with Vision endpoints
- Uses Django cache to track interaction timestamps
- Adds metadata to API responses when user hasn't engaged with vision in 7+ days
- Triggers "Clarity Reminder" on frontend through response metadata

#### 6. Signals (`signals.py`)

**Archive Logging System**:
- `pre_save` signal tracks when visions are being soft-deleted
- `post_save` signal creates archive log entries
- Logs enable admins to analyze why users abandon visions
- Feeds into strategy feedback loop

### Frontend: React + TypeScript

#### Design Philosophy

**Visual Identity**:
- Atmosphere: Deep Space / High-Altitude gradients
- Color scheme: Dark gradients (#0f172a to #1e1b4b)
- Glassmorphism: High-blur backgrounds (`backdrop-blur-xl`)
- Typography: 
  - Playfair Display (serifs) for North Star statements
  - Inter (sans-serif) for details

#### Component Architecture

##### 1. **VisionCanvas** - Main Layout Container
- Implements starfield CSS animation
- Dynamic background based on time horizon
- Grid overlay for 1-year horizon (technical feel)
- Ambient gradient overlays

##### 2. **HorizonToggle** - Time Frame Switcher
- Animated pill-shape toggle
- Options: 1yr, 3yr, 5yr, 10yr
- Framer Motion animations for smooth transitions
- Layout animations with spring physics

##### 3. **HorizonSlider** - Physical Slider Component
- Interactive slider for time horizon selection
- Dynamic label updates
- Background transitions:
  - 10 years: Abstract and starry
  - 1 year: Technical and grid-like
- Context-aware descriptions for each horizon

##### 4. **MantraCard** - North Star Display
- Centered, high-contrast design
- Glowing border effects
- Large serif typography for theme
- Blockquote styling for vision statement
- Floating star decorations with animations

##### 5. **WhyTree** - Five Whys Visualization
- Progressive disclosure pattern
- Vertical "root" system connecting ideas
- "Deepen" button reveals whys one-by-one
- Typewriter effect on reveal
- Numbered badges for each why
- Depth level indicator

##### 6. **Vault** - Soft-Delete Recovery Area
- Sidebar slide-in animation
- Ghost card effects for archived visions
- Restore functionality with one click
- Empty state with helpful messaging
- Informative footer with encouragement

#### Interaction Design

**Soft Delete Animation**:
1. User clicks "Archive Vision"
2. Card doesn't vanish instantly
3. Visual: Card shrinks with scale animation
4. Flies toward vault icon with motion path
5. Toast message: "Archived to your Legacy Vault. It's okay to pivot."

**Five Whys Drill-Down**:
1. Initial view shows vision statement
2. "Deepen" button appears with search icon
3. Click reveals first "why" with fade-in animation
4. Each subsequent click reveals next "why"
5. Staggered delays create meditative experience
6. Reset button allows starting over

## API Endpoints

### Vision Endpoints

```
GET    /api/vision/              # List all active visions
POST   /api/vision/              # Create new vision
GET    /api/vision/{id}/         # Retrieve specific vision
PUT    /api/vision/{id}/         # Update vision
PATCH  /api/vision/{id}/         # Partial update
DELETE /api/vision/{id}/         # Hard delete (not recommended)

# Custom Actions
PATCH  /api/vision/{id}/soft-delete/  # Archive vision
PATCH  /api/vision/{id}/restore/      # Restore archived vision
GET    /api/vision/archived/          # List archived visions
```

### Request/Response Examples

**Create Vision**:
```json
POST /api/vision/
{
  "year": 2026,
  "north_star": "To build a sustainable technology company that positively impacts one million lives through innovative solutions that bridge the digital divide.",
  "yearly_theme": "Year of Impact",
  "time_horizon": 5,
  "five_whys": [
    "Because I want to make a meaningful difference in the world",
    "Because technology can be a force for good",
    "Because underserved communities need better access",
    "Because sustainable growth creates lasting change",
    "Because this aligns with my core values and purpose"
  ],
  "visual_url": "https://images.unsplash.com/photo-example"
}
```

**Soft Delete Response**:
```json
PATCH /api/vision/1/soft-delete/
{
  "message": "Vision archived successfully. It's okay to pivot.",
  "id": 1
}
```

## Installation & Setup

### Backend Setup

1. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Run migrations**:
```bash
python manage.py migrate
```

3. **Test the implementation**:
```bash
python manage.py check
DJANGO_SETTINGS_MODULE=strategic_horizon.settings python -c "import django; django.setup(); from vision.models import Vision; print('Vision model ready')"
```

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
# Ensure framer-motion is installed
npm install framer-motion
```

2. **Start development server**:
```bash
npm start
```

## Testing

### Backend Tests

Run vision module tests:
```bash
cd backend
python manage.py test vision
```

Test coverage includes:
- Vision model creation
- Soft delete functionality
- Restore functionality
- Custom manager behavior
- Serializer validation (North Star word count, Five Whys structure)

### Frontend Testing

The frontend components use:
- Framer Motion for animations
- TypeScript for type safety
- React hooks for state management

Manual testing checklist:
- [ ] Vision creation with validation
- [ ] Time horizon slider interaction
- [ ] Five Whys progressive disclosure
- [ ] Soft delete with animation
- [ ] Vault sidebar functionality
- [ ] Vision restore from vault
- [ ] Toast notifications
- [ ] Background transitions based on horizon

## Key Features

### 1. Context Engine
- Not just data storage, but a reflection and strategy tool
- Encourages deep thinking through Five Whys
- Tracks engagement through middleware

### 2. Soft Delete System
- Visions are never truly lost
- Archive to Legacy Vault
- Easy restoration
- Admin insights into user behavior

### 3. Time Horizon Planning
- Visual representation of strategic timeframes
- Dynamic UI adaptation (starry vs. grid)
- Encourages appropriate planning depth

### 4. Progressive Disclosure
- Five Whys revealed gradually
- Creates meditative experience
- Prevents cognitive overload

### 5. Vision Presence Tracking
- Middleware monitors engagement
- Clarity reminders after 7 days
- Gentle nudges to reconnect with vision

## Design Principles

1. **Expansive and Aspirational**: Design feels like looking into the future
2. **Glassmorphism**: Floating elements over cosmic backgrounds
3. **Progressive Disclosure**: Information revealed when needed
4. **Emotional Safety**: Soft deletes preserve user work
5. **Thoughtful Interactions**: Animations have meaning and purpose

## Best Practices

### For Developers

1. **Always use VisionManager**: Default queryset excludes deleted visions
2. **Use all_objects sparingly**: Only when you need to access deleted items
3. **Validate North Star**: Enforce 10-word minimum for quality
4. **Test middleware**: Ensure caching works properly
5. **Monitor signals**: Archive logs provide valuable insights

### For Users

1. **Take time with Five Whys**: Each layer adds depth
2. **Choose time horizon carefully**: Match it to your vision scope
3. **Use soft delete freely**: Your visions are safe in the vault
4. **Review regularly**: Middleware reminds you after 7 days
5. **Iterate on your vision**: It's okay to pivot and refine

## Future Enhancements

- Anti-Vision card for fear/obstacle setting
- Visual image upload integration
- Collaborative vision sharing
- Progress tracking against vision
- AI-powered vision refinement suggestions
- Export vision as PDF/image
- Vision timeline visualization
- Milestone mapping from vision

## Contributing

When contributing to the Vision module:

1. Maintain the glassmorphism design language
2. Preserve the soft delete architecture
3. Keep animations purposeful and meaningful
4. Write tests for new functionality
5. Update this documentation

## Support

For issues or questions about the Vision module:
- Check existing tests for usage examples
- Review component props and interfaces
- Refer to API endpoint documentation above
- Test in isolation before integration

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: Strategic Horizon Team
