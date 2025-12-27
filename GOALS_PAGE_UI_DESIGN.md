# GoalsPage UI/UX Design Features

## Visual Design Elements

### 1. Header Section
```
╔════════════════════════════════════════════════════════════════════╗
║  🎯  Strategic Goals                            [+ New Goal]       ║
║      Track your specific, measurable milestones                   ║
║      12 goals                                                      ║
╚════════════════════════════════════════════════════════════════════╝
```

### 2. Vision Filter Bar
```
┌────────────────────────────────────────────────────────────────┐
│ 🔍 Filter by Vision:                                           │
│ [All Goals (12)] [Launch Product (5)] [Scale Business (4)]... │
└────────────────────────────────────────────────────────────────┘
```

### 3. Goal Card - High-Level (Strategic)
```
╔═══════════════════════════════════════════════════════════════╗
║ 🎯    [✨Strategic]                        [IN PROGRESS] [✏️]  ║
║                                                               ║
║ Launch Mobile App MVP                                         ║
║ Build and release a minimum viable product for iOS and       ║
║ Android to validate market demand and gather user feedback.  ║
║                                                               ║
║ ⭕ 67%    🎯 5 KPIs    📈 4/5                                 ║
║                                                               ║
║ 📅 Target: Dec 31, 2024        ⚠️ 24 days remaining          ║
║                                                               ║
║ 💡 Supports: Become a market leader in productivity tools... ║
║                                                               ║
║ Quick Status Update: [▼ In Progress                      ▼]  ║
╚═══════════════════════════════════════════════════════════════╝
```

### 4. Goal Card - Low-Level (Tactical)
```
┌────────────────────────────────────┐
│ 🎪              [PENDING]      [✏️] │
│                                    │
│ Set up CI/CD Pipeline              │
│ Automate testing and deployment    │
│ for faster iteration cycles.       │
│                                    │
│ ⭕ 25%  🎯 2 KPIs  📈 3/5          │
│                                    │
│ 📅 Target: Jan 15, 2025            │
│    ✅ 45 days remaining            │
│                                    │
│ Quick Status: [▼ Pending      ▼]  │
└────────────────────────────────────┘
```

### 5. Goal Card - Stalled (At Risk)
```
┌────────────────────────────────────┐
│ 🎪              [STALLED]      [✏️] │
│ ⚠️ PULSING AMBER BORDER           │
│                                    │
│ Integrate Payment Gateway          │
│ Add Stripe payment processing      │
│ for subscription management.       │
│                                    │
│ ⭕ 45%  🎯 3 KPIs  📈 2/5          │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ ⚠️ At Risk                   │  │
│ │ This goal is stalled.        │  │
│ │ [Identify Obstacle]          │  │
│ └──────────────────────────────┘  │
│                                    │
│ Quick Status: [▼ Stalled      ▼]  │
└────────────────────────────────────┘
```

### 6. Create/Edit Goal Dialog
```
╔════════════════════════════════════════════════╗
║ Create New Goal                          [×]   ║
║                                                ║
║ Define a specific, measurable milestone that  ║
║ supports your vision.                          ║
║                                                ║
║ Vision *                                       ║
║ [▼ Select a vision this goal supports    ▼]   ║
║                                                ║
║ Title *                                        ║
║ [_____________________________________]        ║
║                                                ║
║ Description                                    ║
║ [_____________________________________]        ║
║ [_____________________________________]        ║
║                                                ║
║ Status              Strategic Level            ║
║ [▼ Pending    ▼]   [▼ Low-Level (Tactical) ▼] ║
║                                                ║
║ Confidence Level: High ⭐⭐⭐⭐⭐                ║
║ ●━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━●    ║
║ 1 - Very Low    3 - Medium    5 - Very High   ║
║                                                ║
║ Target Date                                    ║
║ [📅 Pick a date                           ]    ║
║                                                ║
║               [Cancel]  [Create Goal]          ║
╚════════════════════════════════════════════════╝
```

### 7. Empty State
```
╔═══════════════════════════════════════════════╗
║                                               ║
║                    🎯                         ║
║                                               ║
║           No Goals Yet                        ║
║                                               ║
║  Create your first goal to start tracking    ║
║           your progress.                      ║
║                                               ║
║         [+ Create Your First Goal]            ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

### 8. Loading State
```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ ░░░░░░░░░░░░░░░░   │  │ ░░░░░░░░░░░░░░░░   │  │ ░░░░░░░░░░░░░░░░   │
│ ░░░░░░░░░░░░░░░░   │  │ ░░░░░░░░░░░░░░░░   │  │ ░░░░░░░░░░░░░░░░   │
│ ░░░░░░░░░░░░░░░░   │  │ ░░░░░░░░░░░░░░░░   │  │ ░░░░░░░░░░░░░░░░   │
│ ░░░░░░░░░░░░░░░░   │  │ ░░░░░░░░░░░░░░░░   │  │ ░░░░░░░░░░░░░░░░   │
└────────────────────┘  └────────────────────┘  └────────────────────┘
  Shimmering skeleton cards during load
```

## Color Coding System

### Confidence Level Colors
- **5 (Very High)**: 🟢 Solid Emerald (emerald-500)
- **4 (High)**: 🟢 Green (green-500)
- **3 (Medium)**: 🔵 Blue (blue-500)
- **2 (Low)**: 🟠 Orange (orange-500)
- **1 (Very Low)**: ⚪ Slate (slate-400)

### Status Colors
- **Completed**: 🟢 Green to Emerald gradient
- **In Progress**: 🔵 Blue to Cyan gradient
- **Pending**: ⚪ Gray to Slate gradient
- **Stalled**: 🟠 Amber to Orange gradient (with pulse animation)

### Days Remaining Colors
- **>30 days**: 🟢 Green (on track)
- **14-30 days**: 🟡 Yellow (attention needed)
- **<14 days**: 🟡 Bold Yellow (urgent)
- **Overdue**: 🔴 Bold Red (critical)

### Progress Circle Colors
- **75-100%**: 🟢 Emerald (excellent progress)
- **50-75%**: 🔵 Blue (good progress)
- **25-50%**: 🟡 Yellow (getting started)
- **0-25%**: ⚪ Gray (low progress)

## Interactive Elements

### 1. Buttons
- **Primary**: "New Goal" - Blue gradient with shadow
- **Secondary**: "Edit", "Cancel" - Outlined style
- **Danger**: "Delete" (if implemented) - Red gradient
- **Action**: "Identify Obstacle" - Amber outlined

### 2. Form Inputs
- **Text Input**: White background with blue focus ring
- **Select Dropdown**: Chevron icon, searchable
- **Slider**: Interactive thumb with track fill
- **Date Picker**: Calendar popover with month/year navigation

### 3. Cards
- **Hover Effect**: Shadow increases, slight scale up
- **Click Effect**: Smooth transition
- **Focus State**: Blue ring for accessibility

### 4. Animations
- **Fade In Up**: Cards appear with slide up + fade
- **Pulse**: Stalled cards pulse subtly
- **Shimmer**: Loading skeletons shimmer
- **Smooth Transitions**: All state changes animate smoothly

## Responsive Design

### Desktop (>1024px)
- High-Level Goals: 2 columns
- Low-Level Goals: 3 columns
- Full filter bar visible
- New Goal button in header

### Tablet (768-1024px)
- High-Level Goals: 2 columns
- Low-Level Goals: 2 columns
- Scrollable filter bar
- New Goal button in header

### Mobile (<768px)
- All Goals: 1 column
- Scrollable filter bar
- Floating Action Button (bottom-right)
- Full-screen dialog forms

## Accessibility Features

- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader compatible
- ✅ Color contrast ratios meet WCAG AA
- ✅ Form validation messages
- ✅ Error states clearly indicated

## Performance Optimizations

- ✅ Optimistic UI updates
- ✅ TanStack Query caching
- ✅ Lazy loading of form dialog
- ✅ Memoized filter computations
- ✅ Debounced search (if implemented)
- ✅ Virtualized lists (for 100+ goals)
- ✅ Code splitting
- ✅ Compressed assets

## Visual Hierarchy

1. **Primary**: Goal titles and main CTAs
2. **Secondary**: Descriptions and metadata
3. **Tertiary**: Badges and icons
4. **Accent**: Status indicators and alerts

## Spacing System (Tailwind)

- **xs**: 0.5rem (2px)
- **sm**: 0.75rem (3px)
- **base**: 1rem (4px)
- **md**: 1.5rem (6px)
- **lg**: 2rem (8px)
- **xl**: 3rem (12px)

## Typography

- **Headings**: Font weight 700 (bold)
- **Body**: Font weight 400 (normal)
- **Labels**: Font weight 600 (semibold)
- **Metadata**: Font weight 400 (normal) with reduced opacity
