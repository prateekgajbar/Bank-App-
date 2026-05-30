# 🏦 Bank App - Complete Banking Platform

A full-stack banking application built with **Node.js**, **Express**, **MongoDB**, **React**, and **JWT authentication**.

## Features ✨

- 👤 **User Registration & Login** - Secure JWT-based authentication
- 💰 **Account Dashboard** - View balance and recent transactions
- 💸 **Money Transfer** - Transfer funds between accounts instantly
- 📊 **Transaction History** - Complete transaction tracking with filters
- ✅ **Balance Check** - Real-time balance updates
- 🔐 **Security** - Password hashing with bcrypt, JWT tokens
- 📱 **Responsive Design** - Works on desktop and mobile

## Technology Stack 🛠️

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP requests

## Project Structure 📁

```
bank-app/
├── bank-app-backend/
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
│
└── bank-app-frontend/
    ├── public/
    │   └── index.html      # HTML template
    ├── src/
    │   ├── components/     # React components
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Transfer.js
    │   │   ├── TransactionHistory.js
    │   │   └── Navbar.js
    │   ├── styles/         # CSS files
    │   │   ├── Auth.css
    │   │   ├── Dashboard.css
    │   │   ├── Transfer.css
    │   │   ├── TransactionHistory.css
    │   │   └── Navbar.css
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json        # Frontend dependencies
```

## Setup Instructions 🚀

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local or Atlas cloud)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd bank-app-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT Secret
# Example:
# MONGODB_URI=mongodb://localhost:27017/bankapp
# PORT=5000
# JWT_SECRET=your-super-secret-key-change-this

# Start the server
npm start
# Server runs on http://localhost:5000
```

For development with auto-reload:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd bank-app-frontend

# Install dependencies
npm install

# Start the React development server
npm start
# App opens on http://localhost:3000
```

## API Endpoints 📡

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Account
- `GET /api/account/dashboard` - Get dashboard data
- `GET /api/account/balance` - Get current balance
- `GET /api/user/profile` - Get user profile

### Transactions
- `POST /api/transactions/transfer` - Transfer money
- `GET /api/transactions/history` - Get transaction history
- `POST /api/transactions/deposit` - Deposit money

## Default Demo Account 👤

For testing, you can use:
- **Email**: demo@example.com
- **Password**: demo123

Or create a new account during registration.

## Database Models 📊

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  accountNumber: String (unique),
  balance: Number,
  createdAt: Date
}
```

### Transaction Model
```javascript
{
  senderId: ObjectId,
  senderName: String,
  receiverId: ObjectId,
  receiverName: String,
  receiverAccount: String,
  amount: Number,
  type: String (transfer/deposit/withdrawal),
  status: String (pending/completed/failed),
  description: String,
  timestamp: Date
}
```

## Key Features Explained 🎯

### User Registration
- Validates email uniqueness
- Password confirmation
- Auto-generates account number
- Initial balance: ₹5000

### JWT Authentication
- Secure token-based authentication
- Token stored in localStorage
- Auto-logout on token expiry

### Money Transfer
- Confirmation modal before transfer
- Real-time balance update
- Instant transfer processing
- Complete transaction logging

### Transaction History
- Filter by type (sent, received, deposits)
- Search functionality
- Statistics (total sent, received, count)
- Transaction status display

## Security Features 🔒

- ✅ Password hashing with bcryptjs
- ✅ JWT token validation
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling
- ✅ Secure password requirements

## Error Handling

The app includes comprehensive error handling for:
- Invalid credentials
- Insufficient balance
- Duplicate emails
- Network errors
- Invalid inputs
- Database errors

## Styling

- Modern gradient design
- Responsive grid layout
- Card-based UI
- Smooth transitions
- Mobile-first approach

## Browser Support 🌐

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements 🔮

- [ ] Two-factor authentication
- [ ] Bill payments
- [ ] Money requests
- [ ] QR code transfers
- [ ] Transaction notifications
- [ ] Admin dashboard
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration

## Troubleshooting 🔧

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For MongoDB Atlas, whitelist your IP

### CORS Error
- Backend runs on :5000
- Frontend runs on :3000
- Both servers should be running

### Transfer Not Working
- Check recipient account number exists
- Verify sufficient balance
- Ensure both servers are running

## Contributing 🤝

Feel free to fork this project and submit pull requests for any improvements!

## License 📄

This project is open source and available under the MIT License.

## Support 💬

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ for learning and development**
