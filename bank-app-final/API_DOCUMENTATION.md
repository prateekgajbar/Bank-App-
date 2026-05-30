# 📚 Bank App - API Documentation

## Base URL
```
http://localhost:5000
```

## Content-Type
All requests and responses use `application/json`

---

## Authentication 🔐

### Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:** (201 Created)
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "accountNumber": "ACC1629203845000",
    "balance": 5000
  }
}
```

**Error Response:** (400 Bad Request)
```json
{
  "message": "Email already registered"
}
```

**Validation Rules:**
- Name: Required, non-empty
- Email: Required, unique, valid format
- Password: Required, minimum 6 characters
- Confirm Password: Must match password

---

### Login User
**POST** `/api/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (200 OK)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "accountNumber": "ACC1629203845000",
    "balance": 5000
  }
}
```

**Error Response:** (401 Unauthorized)
```json
{
  "message": "Invalid email or password"
}
```

---

## Account Endpoints 💰

All endpoints require `Authorization: Bearer <token>` header

### Get Dashboard
**GET** `/api/account/dashboard`

Get user dashboard with balance and recent transactions.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** (200 OK)
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "accountNumber": "ACC1629203845000",
    "balance": 5000,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "recentTransactions": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "senderId": "507f1f77bcf86cd799439011",
      "senderName": "John Doe",
      "receiverId": "507f1f77bcf86cd799439013",
      "receiverName": "Jane Smith",
      "receiverAccount": "ACC1629203845001",
      "amount": 500,
      "type": "transfer",
      "status": "completed",
      "description": "Payment",
      "timestamp": "2024-01-20T15:45:00Z"
    }
  ]
}
```

---

### Get Balance
**GET** `/api/account/balance`

Get current account balance.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** (200 OK)
```json
{
  "balance": 4500
}
```

---

### Get User Profile
**GET** `/api/user/profile`

Get complete user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** (200 OK)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "accountNumber": "ACC1629203845000",
  "balance": 4500,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## Transaction Endpoints 📊

All endpoints require `Authorization: Bearer <token>` header

### Transfer Money
**POST** `/api/transactions/transfer`

Transfer money to another account.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "receiverAccount": "ACC1629203845001",
  "amount": 500,
  "description": "Monthly rent"
}
```

**Response:** (200 OK)
```json
{
  "message": "Transfer successful",
  "transaction": {
    "_id": "507f1f77bcf86cd799439014",
    "senderId": "507f1f77bcf86cd799439011",
    "senderName": "John Doe",
    "receiverId": "507f1f77bcf86cd799439013",
    "receiverName": "Jane Smith",
    "receiverAccount": "ACC1629203845001",
    "amount": 500,
    "type": "transfer",
    "status": "completed",
    "description": "Monthly rent",
    "timestamp": "2024-01-20T15:45:00Z"
  }
}
```

**Error Responses:**

Insufficient Balance (400):
```json
{
  "message": "Insufficient balance"
}
```

Invalid Amount (400):
```json
{
  "message": "Amount must be greater than 0"
}
```

Receiver Not Found (404):
```json
{
  "message": "Receiver account not found"
}
```

**Validation Rules:**
- Receiver Account: Required, must exist
- Amount: Required, must be > 0
- Description: Optional
- Sender must have sufficient balance

---

### Get Transaction History
**GET** `/api/transactions/history`

Get all transactions for the logged-in user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** (200 OK)
```json
{
  "transactions": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "senderId": "507f1f77bcf86cd799439011",
      "senderName": "John Doe",
      "receiverId": "507f1f77bcf86cd799439013",
      "receiverName": "Jane Smith",
      "receiverAccount": "ACC1629203845001",
      "amount": 500,
      "type": "transfer",
      "status": "completed",
      "description": "Monthly rent",
      "timestamp": "2024-01-20T15:45:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "senderId": null,
      "receiverId": "507f1f77bcf86cd799439011",
      "receiverName": "John Doe",
      "receiverAccount": "ACC1629203845000",
      "amount": 1000,
      "type": "deposit",
      "status": "completed",
      "description": "Salary Deposit",
      "timestamp": "2024-01-19T09:00:00Z"
    }
  ]
}
```

---

### Deposit Money
**POST** `/api/transactions/deposit`

Deposit money to the account.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 1000,
  "description": "Salary"
}
```

**Response:** (200 OK)
```json
{
  "message": "Deposit successful",
  "balance": 5500,
  "transaction": {
    "_id": "507f1f77bcf86cd799439016",
    "senderId": null,
    "receiverId": "507f1f77bcf86cd799439011",
    "receiverName": "John Doe",
    "receiverAccount": "ACC1629203845000",
    "amount": 1000,
    "type": "deposit",
    "status": "completed",
    "description": "Salary",
    "timestamp": "2024-01-21T10:00:00Z"
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

Common error messages:
- "All fields are required"
- "Passwords do not match"
- "Email already registered"
- "Invalid email or password"
- "No token provided"
- "Invalid token"
- "User not found"
- "Insufficient balance"
- "Receiver account not found"
- "Failed to [action]"

---

## Authentication Flow

1. **Register/Login** → Get JWT token
2. **Store Token** → Save in localStorage
3. **Include Token** → Add to Authorization header
4. **Token Expiry** → Valid for 7 days
5. **Re-login** → Get new token when expired

---

## Example cURL Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Transfer Money
```bash
curl -X POST http://localhost:5000/api/transactions/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "receiverAccount": "ACC1629203845001",
    "amount": 500,
    "description": "Payment"
  }'
```

### Get Dashboard
```bash
curl -X GET http://localhost:5000/api/account/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Currently no rate limiting implemented. For production, consider adding:
- Request rate limiting per IP/user
- Request timeout limits
- Concurrent connection limits

---

## Security Notes 🔒

1. **Token Security**
   - Never expose token in logs
   - Store token securely (httpOnly cookie)
   - Validate token expiry

2. **Password Security**
   - Minimum 6 characters
   - Hash with bcryptjs
   - Never return password in responses

3. **Data Validation**
   - All inputs validated
   - Email format validation
   - Amount > 0 validation

4. **SQL/NoSQL Injection**
   - Uses Mongoose (prevents injection)
   - Input sanitization

---

## Pagination (Future)

Consider adding pagination for transaction history:
```
GET /api/transactions/history?page=1&limit=10
```

---

## Versioning

Current API version: v1
Base URL: `/api` (future: `/api/v1`)

---

For more details, check the source code or create an issue!
