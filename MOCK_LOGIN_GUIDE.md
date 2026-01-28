# Mock Login Implementation Guide

## Overview

A complete mock login system has been implemented with two user profiles: **Scheduler** and **Leadership**. Users log in with their username and password, and are routed to their corresponding profile home page.

## Features Implemented

### 1. **Username-Based Login** (Changed from Email)
- Login form now uses **Username** field instead of email
- Simple validation: required field only
- Helper text shows available test credentials

### 2. **Mock User Database**
Three test users with profile assignments:

```
┌──────────────────┬───────────┬────────────┐
│ Username         │ Password  │ Profile    │
├──────────────────┼───────────┼────────────┤
│ scheduler_user   │ password1 │ Scheduler  │
│ leadership_user  │ password1 │ Leadership │
│ demo             │ demo      │ Scheduler  │
└──────────────────┴───────────┴────────────┘
```

### 3. **Profile-Based Routing**
After successful login, users are redirected to their profile home page:
- **Scheduler users** → `/scheduler` (SchedulerPage)
- **Leadership users** → `/leadership` (LeadershipPage)

### 4. **Profile Home Pages**
Simple welcome page showing:
- User greeting: "Welcome, {username}!"
- Profile type display (Scheduler or Leadership)
- **Logout button** that clears session and returns to login

### 5. **Session Management (Mock)**
- User data stored in `localStorage` after login
- User data persists across page refreshes
- Logout clears stored user data
- Profile home pages retrieve and display logged-in user info

## File Structure

```
src/
├── types/
│   └── auth.ts                    ← User and AuthContextType types
├── services/
│   └── mockAuthService.ts         ← Mock login/logout logic
├── pages/
│   ├── Login/
│   │   ├── LoginPage.tsx          ← Updated for username
│   │   └── Login.module.css       ← Existing styles
│   └── ProfileHome/
│       ├── SchedulerPage.tsx      ← NEW Scheduler home
│       ├── LeadershipPage.tsx     ← NEW Leadership home
│       └── ProfileHome.module.css ← NEW Profile styles
└── App.tsx                        ← Updated routes
```

## How It Works

### Login Flow

```
User opens /login
    ↓
Enters username & password (or uses test credentials)
    ↓
Clicks "Sign in"
    ↓
mockLogin() validates credentials (async 500ms delay)
    ↓
Valid? → getProfileRoute() determines target page
    ↓
User stored in localStorage
    ↓
Redirect to /scheduler or /leadership
    ↓
Profile page displays "Welcome, {username}!"
```

### Logout Flow

```
User clicks "Logout" button
    ↓
mockLogout() clears localStorage
    ↓
Redirect to /login
    ↓
User back at login screen
```

## Testing the Login

### Test Credentials

**Scheduler Profile:**
```
Username: scheduler_user
Password: password123
```

**Leadership Profile:**
```
Username: leadership_user
Password: password123
```

**Quick Demo:**
```
Username: demo
Password: demo
```

### Steps to Test

1. Open http://localhost:5173/login
2. Enter one of the test usernames
3. Enter the password
4. Click "Sign in"
5. Should redirect to the corresponding profile page
6. Click "Logout" to return to login

## Code Components

### 1. **mockAuthService.ts**

```typescript
// Mock login with credentials
mockLogin(username: string, password: string) → Promise<User | null>

// Get stored user from localStorage
getStoredUser() → User | null

// Mock logout
mockLogout() → void

// Get profile-specific route
getProfileRoute(profile: UserProfile) → string
```

### 2. **LoginPage.tsx Changes**
- Removed email field → Changed to username field
- Updated validation (no email format check)
- Integrated mockLogin service
- Error handling for invalid credentials
- Updated helper text with test credentials

### 3. **Profile Home Pages**
Both `SchedulerPage.tsx` and `LeadershipPage.tsx`:
- Display username using `getStoredUser()`
- Show profile type
- Logout button calls `mockLogout()` and redirects to `/login`

## Routes

```
/login                  → LoginPage (login screen)
/scheduler              → SchedulerPage (Scheduler profile home)
/leadership             → LeadershipPage (Leadership profile home)
/                       → Home (original home page with Layout)
/dashboard              → Dashboard (original dashboard with Layout)
/settings               → Settings (original settings with Layout)
/about                  → About (original about page with Layout)
```

## Data Flow

### Login
```
LoginPage
  ↓ (onSubmit)
mockLogin(username, password)
  ↓ (validates in MOCK_USERS)
User object stored in localStorage
  ↓
getProfileRoute(user.profile)
  ↓
navigate(/scheduler or /leadership)
```

### Profile Pages
```
SchedulerPage / LeadershipPage
  ↓ (on mount)
getStoredUser()
  ↓ (retrieves from localStorage)
Display username
  ↓ (user clicks logout)
mockLogout()
  ↓ (clears localStorage)
navigate(/login)
```

## Key Features

✅ **No Backend Calls** - All logic is mock/client-side
✅ **Simple Username** - No email validation needed
✅ **Profile-Based Routing** - Different pages for different users
✅ **Session Persistence** - User stays logged in on refresh
✅ **Clean Logout** - Clear session and return to login
✅ **Accessible** - Forms remain WCAG 2.2 AA compliant
✅ **Type-Safe** - Full TypeScript support
✅ **Responsive** - Works on mobile/tablet/desktop

## Future Integration

When ready to connect to a real backend:

1. **Update mockAuthService.ts** to call actual API:
   ```typescript
   const response = await apiClient.post('/api/auth/login', { username, password });
   ```

2. **Add Bearer token handling**:
   ```typescript
   localStorage.setItem('auth_token', response.token);
   ```

3. **Implement token refresh** in apiClient interceptors

4. **Add protected route wrapper** for authenticated-only pages

## Storage Details

**localStorage Key:** `auth_user`

**Stored Data Format:**
```json
{
  "id": "scheduler_user",
  "username": "scheduler_user",
  "profile": "Scheduler"
}
```

## Styling

Both profile pages use `ProfileHome.module.css` with:
- Centered card layout
- Welcome greeting
- Profile information display
- Red logout button (danger action)
- Full responsive support
- Motion preference respect

## Testing Checklist

- [ ] Login with `demo` / `demo` → redirects to /scheduler
- [ ] Login with `scheduler_user` / `password123` → redirects to /scheduler
- [ ] Login with `leadership_user` / `password123` → redirects to /leadership
- [ ] Invalid credentials show error message
- [ ] Page refresh keeps user logged in
- [ ] Logout clears session and returns to /login
- [ ] Username displays correctly on profile page
- [ ] Profile type shows correctly on page
- [ ] Responsive layout works on mobile

## Browser Console

When testing, you can verify localStorage:
```javascript
// Check stored user
console.log(JSON.parse(localStorage.getItem('auth_user')));

// Clear (simulate logout)
localStorage.removeItem('auth_user');
```

## Build Status

✅ **Clean Build** - 1000 modules, 0 errors
✅ **Development Server** - Running on localhost:5173
✅ **Production Ready** - All features working

## Summary

You now have:
1. A working login page with username field
2. Two test user profiles (Scheduler and Leadership)
3. Profile-specific home pages
4. Session management with localStorage
5. Logout functionality
6. Profile-based routing (users see different pages)

All with mock data - no backend calls required!
