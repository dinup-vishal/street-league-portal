# Authentication System & Architect Portal Integration

## Login Credentials

Use these credentials to test the system:

### Admin
- **Email**: `admin@streetleague.com`
- **Password**: `admin123`
- **Access**: Full system access including Architect Portal

### Program Manager ⭐ (NEW)
- **Email**: `manager@streetleague.com`
- **Password**: `manager123`
- **Access**: Architect Portal for programme design and configuration

### Coordinator
- **Email**: `coordinator@streetleague.com`
- **Password**: `coord123`
- **Access**: Limited features

### Staff
- **Email**: `staff@streetleague.com`
- **Password**: `staff123`
- **Access**: Limited features

## User Flow

```
1. User visits /login
2. Enters credentials
3. Successfully logged in → Redirected to /home
4. Home screen displays available modules
5. Click "Open" on "Architect Portal" card
6. Navigate to /architect (Architect Portal)
7. Configure phases, steps, programme structure
8. Data persists to localStorage
9. Click Logout to return to login
```

## Routes

### Public Routes
- `/login` - Login screen

### Protected Routes (Authentication Required)
- `/home` - User home/dashboard
- `/architect` - Architect Portal (requires: `admin`, `program_manager`)

### Legacy Routes (Still Available)
- `/` - Original home
- `/login-legacy` - Old login
- `/scheduler` - Scheduler
- `/dashboard`, `/settings`, `/about` - Other pages

## Key Features

### Authentication
- ✅ Mock credentials system
- ✅ localStorage persistence (user stays logged in after reload)
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with role validation
- ✅ Loading state handling

### Architect Portal Integration
- ✅ Program Manager can access Architect Portal
- ✅ Admin can access Architect Portal
- ✅ Full-screen responsive interface
- ✅ Data persists in localStorage
- ✅ Accessible back to home/logout

### Home Screen
- ✅ Display user info (name, email, role)
- ✅ Module navigation cards
- ✅ Responsive grid layout
- ✅ Coming Soon placeholders for other modules
- ✅ Role-specific information

## Components

### AuthContext.tsx
- Manages authentication state
- Mock credentials validation
- localStorage sync for persistent login
- `useAuth()` hook for accessing auth state

### Login.tsx
- Credential input form
- Demo credentials display
- Error handling
- Loading states

### Home.tsx
- User profile card
- Module navigation grid
- Logout functionality
- Role-based content display

### ProtectedRoute.tsx
- Route wrapper for authentication
- Role-based access control
- Redirect to login if not authenticated
- Access denied message if role doesn't match

## Integration with Architect Portal

The Architect Portal is now accessible through the auth system:

```typescript
// Route configuration in App.tsx
<Route 
  path="/architect" 
  element={
    <ProtectedRoute requiredRoles={['admin', 'program_manager']}>
      <div style={{ height: '100vh' }}>
        <ArchitectPortal />
      </div>
    </ProtectedRoute>
  } 
/>
```

Program Manager users automatically have access to configure:
- Phases (Foundation Setup, Curriculum Design, Program Deployment)
- Steps within each phase
- Programme structure and configuration
- All data persists to localStorage

## Files Created/Modified

### New Files
- `src/features/auth/AuthContext.tsx` - Auth state management
- `src/features/auth/Login.tsx` - Login form component
- `src/features/auth/Login.module.css` - Login styling
- `src/features/auth/Home.tsx` - Home/dashboard screen
- `src/features/auth/Home.module.css` - Home styling
- `src/features/auth/ProtectedRoute.tsx` - Route protection component
- `src/features/auth/index.ts` - Auth exports

### Modified Files
- `src/App.tsx` - Integrated auth system and routes

## Testing

1. **Test Login**
   - Go to `/login`
   - Enter Program Manager credentials: `manager@streetleague.com` / `manager123`
   - Should redirect to `/home`

2. **Test Home Screen**
   - View user information
   - See available modules
   - Click "Open" on Architect Portal card

3. **Test Architect Portal**
   - Expand/collapse phases
   - Select steps
   - Verify data persists (refresh page)
   - Logout and login again - state should be restored

4. **Test Access Control**
   - Try accessing `/architect` with staff account - should see "Access Denied"
   - Admin and Program Manager should have access

5. **Test Persistence**
   - Login and select a step in Architect
   - Refresh the page - state should persist
   - Close browser and reopen - user should still be logged in
   - Click logout - state should be cleared

## Styling

- **Color Scheme**: Blue gradient primary, cyan focus
- **Typography**: Responsive font sizes
- **Layout**: Grid-based, mobile-first responsive
- **Accessibility**: Focus rings, semantic HTML, ARIA support
- **Motion**: Respects `prefers-reduced-motion`

## Next Steps

1. Integrate Scheduler with auth system
2. Add more modules to home screen
3. Implement actual form functionality in Architect Portal
4. Connect to backend API
5. Add user profile management
6. Implement role-based view customization
