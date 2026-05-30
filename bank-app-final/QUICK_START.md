# 🚀 Quick Start Guide - Bank App

Follow these steps to get the bank app running in minutes!

## Step 1: Prerequisites Check ✅

Make sure you have:
- Node.js installed: `node --version`
- npm installed: `npm --version`
- MongoDB running (local or Atlas account)

## Step 2: Backend Setup 🔧

### 2.1 Install Backend Dependencies
```bash
cd bank-app-backend
npm install
```

### 2.2 Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env file and add your values:
# MONGODB_URI=mongodb://localhost:27017/bankapp
# PORT=5000
# JWT_SECRET=your-secret-key-here
```

### 2.3 Start Backend Server
```bash
npm start
# Server running on http://localhost:5000
```

✅ You should see: "Server running on http://localhost:5000"

---

## Step 3: Frontend Setup 🎨

### 3.1 Open New Terminal

Keep the backend running! Open a new terminal window.

### 3.2 Install Frontend Dependencies
```bash
cd bank-app-frontend
npm install
```

### 3.3 Start Frontend Server
```bash
npm start
# React app opens at http://localhost:3000
```

✅ Your browser should automatically open the app!

---

## Step 4: Test the Application 🧪

### 4.1 Create Account
1. Click "Register here" link
2. Fill in:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: at least 6 characters
   - Confirm Password: same as above
3. Click "Register"

### 4.2 Login
1. After registration, you'll be logged in automatically
2. Or use login page with your credentials

### 4.3 Try Features
- **Dashboard**: View your balance and recent transactions
- **Transfer**: Send money to another account (use another registered account)
- **History**: View all your transactions

---

## Quick Commands Reference 📋

### Backend
```bash
cd bank-app-backend
npm install          # Install dependencies
npm start            # Start server (production)
npm run dev          # Start with auto-reload (development)
```

### Frontend
```bash
cd bank-app-frontend
npm install          # Install dependencies
npm start            # Start dev server
npm run build        # Create production build
```

---

## Demo Data 👤

Create multiple accounts to test transfers:

**Account 1:**
- Name: John Doe
- Email: john@example.com
- Password: demo123

**Account 2:**
- Name: Jane Smith
- Email: jane@example.com
- Password: demo123

---

## Troubleshooting 🆘

### Port Already in Use
```bash
# If port 5000 is in use (backend):
# Edit .env and change PORT to 5001

# If port 3000 is in use (frontend):
# React will ask to use 3001 instead
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running:

# Windows:
net start MongoDB

# Mac (Homebrew):
brew services start mongodb-community

# Linux:
sudo service mongod start

# Or use MongoDB Atlas (cloud):
# Replace MONGODB_URI in .env with your Atlas connection string
```

### Dependencies Issues
```bash
# Clear cache and reinstall:
rm -rf node_modules
rm package-lock.json
npm install
```

### Port 5000 Already in Use
```bash
# Find what's using port 5000:
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# Kill the process or change PORT in .env
```

---

## Useful Tips 💡

1. **Keep Both Servers Running**
   - Backend on terminal 1
   - Frontend on terminal 2
   - Both must be running for app to work

2. **Clear Browser Cache**
   - If something seems broken, clear cache in DevTools

3. **Check Console Errors**
   - Frontend errors: Browser DevTools → Console
   - Backend errors: Terminal where npm start runs

4. **Test with Multiple Accounts**
   - Register 2-3 accounts to test transfers between them

5. **Initial Balance**
   - Every new account gets ₹5000 automatically

---

## File Locations 📁

- Backend: `bank-app-backend/`
- Frontend: `bank-app-frontend/`
- Styles: `bank-app-frontend/src/styles/`
- Components: `bank-app-frontend/src/components/`
- API routes: `bank-app-backend/server.js`

---

## Next Steps 🎓

Once it's working:
1. Explore the codebase
2. Modify styling in `/src/styles/`
3. Add more features
4. Deploy to production

---

## Need Help? 🤔

1. Check the main README.md for detailed documentation
2. Review error messages in terminal/console
3. Verify both servers are running
4. Check MongoDB connection
5. Make sure ports are not in use

---

**Everything should work now! Enjoy your banking app! 🎉**
