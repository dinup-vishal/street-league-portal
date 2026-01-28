# Quick Reference - Test Credentials

## Login Page: http://localhost:5173/login

### Test Users

#### Demo Account (Fastest to Test)
```
Username: demo
Password: demo
Profile:  Scheduler
Redirect: http://localhost:5173/scheduler
```

#### Scheduler Profile Account
```
Username: scheduler_user
Password: password123
Profile:  Scheduler
Redirect: http://localhost:5173/scheduler
```

#### Leadership Profile Account
```
Username: leadership_user
Password: password123
Profile:  Leadership
Redirect: http://localhost:5173/leadership
```

---

## What to Expect

### After Login
You'll see:
- **Heading**: "Welcome, {username}!"
- **Profile Label**: Shows your profile type (Scheduler or Leadership)
- **Logout Button**: Red button to return to login

### Invalid Login
- **Wrong username/password**: "Invalid username or password"
- **Empty fields**: Specific field errors shown

---

## Test Flows

### Test 1: Basic Login
1. Open http://localhost:5173/login
2. Username: `demo`
3. Password: `demo`
4. Click "Sign in"
5. ✅ Should see "Welcome, demo!" page

### Test 2: Different Profiles
1. Login as `scheduler_user` / `password123` → See Scheduler profile
2. Logout → Return to login
3. Login as `leadership_user` / `password123` → See Leadership profile

### Test 3: Session Persistence
1. Login with `demo` / `demo`
2. Refresh page (F5)
3. ✅ Should still be logged in, showing same page

### Test 4: Logout
1. Login with any credentials
2. Click "Logout" button
3. ✅ Should return to login page
4. Page is now empty (not logged in)

### Test 5: Error Handling
1. Try username: `invalid_user` password: `password`
2. ✅ Should show "Invalid username or password"
3. Try leaving username empty and click sign in
4. ✅ Should show "Username is required"

---

## Helper Text on Login Page

When you hover over the username field, you'll see:
> "Try: demo, scheduler_user, or leadership_user"

This provides the available test accounts.

---

## File Locations

- **Login Page**: `src/pages/Login/LoginPage.tsx`
- **Scheduler Home**: `src/pages/ProfileHome/SchedulerPage.tsx`
- **Leadership Home**: `src/pages/ProfileHome/LeadershipPage.tsx`
- **Mock Service**: `src/services/mockAuthService.ts`

---

## Common Issues & Troubleshooting

**Q: Login not working?**
- Check spelling of username (case-insensitive)
- Verify you're using correct password
- Check browser console for errors

**Q: Stuck on login page after clicking sign in?**
- Wait 500ms (simulated API delay)
- Check if credentials are correct
- Check browser network tab in DevTools

**Q: Lost login after page refresh?**
- Clear localStorage: `localStorage.clear()` in console
- This can happen if the user object is malformed
- Try logging in again

**Q: Button shows "Signing in..." and stays that way?**
- Check browser console for errors
- Try F5 to refresh page
- Check localStorage for corrupt data

---

## Development Notes

### Mock vs Real API
- Currently using **mock authentication** (no backend calls)
- All logic happens in `src/services/mockAuthService.ts`
- Ready to integrate real backend when available

### localStorage Key
- **Key**: `auth_user`
- **Value**: JSON object with `{id, username, profile}`
- **Cleared on logout**

### Simulated API Delay
- Login has 500ms artificial delay to simulate API call
- This is configurable in `mockAuthService.ts`

---

## Quick Start for New Users

1. Copy a test username from above
2. Paste into login page
3. Enter corresponding password
4. Click "Sign in"
5. Explore the profile home page
6. Click "Logout" to return

That's it! 🚀

---

**Last Updated**: January 28, 2026
**Status**: ✅ Fully Functional - Ready to Test
