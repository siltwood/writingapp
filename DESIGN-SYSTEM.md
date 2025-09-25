# Typewriter Studio Design System

## Design Philosophy
A retro, pixelated typewriter application inspired by Papers, Please with a vintage aesthetic and modern functionality.

## Color Palette

### Primary Colors
- **Paper Background**: `#f4f1e8` - Aged paper color
- **Dark Background**: `#2a2a2a` to `#1a1a1a` gradient - Dark retro theme
- **Text Primary**: `#1a1a1a` - High contrast on paper
- **Text on Dark**: `#f4f1e8` - Paper color inverted for dark backgrounds

### Accent Colors
- **Border Light**: `rgba(255, 255, 255, 0.1)` - Subtle borders on dark
- **Border Dark**: `rgba(139, 119, 101, 0.2)` - Vintage border on light
- **Hover States**: `rgba(255, 255, 255, 0.1)` - Subtle highlight
- **Error/Delete**: `rgba(239, 68, 68, 0.9)` - Danger actions

## Typography
- **Primary Font**: `'Courier Prime', monospace` - Typewriter aesthetic
- **Font Sizes**:
  - Headers: `20px-24px`
  - Body: `14px`
  - Small: `12px-13px`

## Component Standards

### Buttons

#### Close Button (X)
**STANDARD: All close buttons must use the spinning X animation**
```css
- Position: Top-left corner (15px, 15px) or Top-right for toggle buttons
- Size: 20px icon
- Animation: 90deg rotation on hover
- Color: Inherit from context (light/dark theme)
- Padding: 5px
- Border-radius: 4px
- Hover: Background change + rotation
```

#### Control Buttons
```css
- Padding: 8px 12px (small) / 12px 20px (large)
- Border-radius: 6px
- Background: rgba(255, 255, 255, 0.05) on dark
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Hover: translateY(-1px) + background lightening
- Font: Courier Prime, 13-14px
```

### Modals & Overlays
```css
- Overlay: rgba(0, 0, 0, 0.5) backdrop
- Modal background: #f4f1e8 (paper) or gradient dark
- Border-radius: 8px
- Padding: 40px
- Box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3)
- Close methods: X button, Escape key, backdrop click
```

### Input Fields
```css
- Padding: 10px 12px (small) / 12px 15px (large)
- Background: rgba(255, 255, 255, 0.05) on dark / white on light
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Border-radius: 6px
- Focus: Border color change + subtle shadow
- Font: Courier Prime, 14px
```

### Animations & Transitions
```css
- Standard transition: all 0.3s ease
- Hover scale: 1.05 for emphasis
- Hover translate: translateY(-1px) for lift effect
- Close button rotation: 90deg
- Fade in: 0.3s ease
```

## Interaction Patterns

### Modal Behavior
1. **Opening**: Fade in with backdrop
2. **Closing**: 
   - X button (top-left, spinning animation)
   - Escape key
   - Click backdrop
3. **Content protection**: Click inside modal doesn't close

### Toast Notifications
- Position: Top-right
- Auto-dismiss: 3000ms default
- Icons: Lock 🔐 for auth prompts
- Style: Matches overall theme

### Authentication Flow
1. **Unauthenticated**: Show features but prompt on action
2. **Auth prompt**: Friendly message with lock icon
3. **Sign up/in**: Modal with Google OAuth and email options
4. **Success**: Close modal and grant access

## Pixelated/Retro Effects
```css
image-rendering: pixelated;
image-rendering: -moz-crisp-edges;
image-rendering: crisp-edges;
```

## Accessibility
- All buttons have aria-labels
- Keyboard navigation support
- Escape key for modal dismissal
- Focus states on interactive elements
- Contrast ratios meet WCAG standards

## Component Hierarchy
```
App
├── Typewriter (main canvas)
├── Sidebar (collapsible menu)
│   ├── Story controls
│   ├── Story list
│   └── Settings
├── Login Modal
│   ├── Google OAuth
│   ├── Email auth
│   └── Password reset
└── Toast notifications
```

## Future Consistency Rules
1. **Always use spinning X for close buttons** (90deg rotation on hover)
2. **Maintain Courier Prime font** throughout
3. **Keep paper texture aesthetic** (#f4f1e8)
4. **Use consistent spacing**: 10px, 15px, 20px increments
5. **Animation duration**: 0.3s for all transitions
6. **Modal backdrop**: Always clickable to close
7. **Escape key**: Always closes modals
8. **Toast icons**: Use emojis sparingly for important prompts