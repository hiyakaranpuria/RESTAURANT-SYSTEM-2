# 📡 Complete API Endpoints Documentation

## Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints (`/api/auth`)

### 1. Register Customer

```http
POST /api/auth/register
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "customer",
  "marketingConsent": false
}
```

**Response:** `201 Created`

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "customer"
  }
}
```

### 2. Login Customer

```http
POST /api/auth/login
```

**Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "customer"
  }
}
```

### 3. Get Current User

```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer {token}`
**Response:** `200 OK`

```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "type": "user"
}
```

### 4. Logout

```http
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer {token}`
**Response:** `200 OK`

```json
{
  "message": "Logged out successfully",
  "code": "LOGOUT_SUCCESS"
}
```

### 5. Refresh Token

```http
POST /api/auth/refresh
```

**Headers:** `Authorization: Bearer {token}`
**Response:** `200 OK`

```json
{
  "token": "new_jwt_token_here",
  "message": "Token refreshed successfully"
}
```

---

## 🏪 Restaurant Endpoints (`/api/restaurant`)

### 1. Register Restaurant

```http
POST /api/restaurant/register
```

**Body:**

```json
{
  "restaurantName": "The Gourmet Place",
  "businessType": "restaurant",
  "cuisineType": ["Italian", "Mediterranean"],
  "description": "Fine dining experience",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "phone": "+1234567890",
  "owner": {
    "name": "Jane Smith",
    "email": "jane@restaurant.com",
    "phone": "+1234567890",
    "password": "password123"
  },
  "verification": {
    "businessLicense": "BL123456",
    "taxId": "TAX123456",
    "documents": []
  },
  "website": "https://restaurant.com",
  "socialMedia": {
    "facebook": "restaurant",
    "instagram": "restaurant"
  },
  "operatingHours": {
    "monday": { "open": "09:00", "close": "22:00" }
  },
  "numberOfTables": 20
}
```

**Response:** `201 Created`

```json
{
  "message": "Restaurant registration submitted successfully",
  "restaurantId": "restaurant_id",
  "status": "pending"
}
```

### 2. Restaurant Login

```http
POST /api/restaurant/login
```

**Body:**

```json
{
  "email": "jane@restaurant.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "token": "jwt_token_here",
  "restaurant": {
    "_id": "restaurant_id",
    "restaurantName": "The Gourmet Place",
    "email": "jane@restaurant.com",
    "verificationStatus": "approved",
    "isActive": true
  }
}
```

### 3. Get Restaurant Profile

```http
GET /api/restaurant/me
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Response:** `200 OK`

```json
{
  "_id": "restaurant_id",
  "restaurantName": "The Gourmet Place",
  "businessType": "restaurant",
  "cuisineType": ["Italian"],
  "address": {...},
  "phone": "+1234567890",
  "verification": {
    "status": "approved"
  }
}
```

### 4. Update Restaurant Profile

```http
PATCH /api/restaurant/profile
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Body:**

```json
{
  "description": "Updated description",
  "phone": "+1234567890"
}
```

**Response:** `200 OK`

### 5. Get All Restaurants (Admin Only)

```http
GET /api/restaurant?status=pending
```

**Headers:** `Authorization: Bearer {admin_token}`
**Query Params:**

- `status` (optional): `pending`, `approved`, `rejected`
  **Response:** `200 OK`

```json
[
  {
    "_id": "restaurant_id",
    "restaurantName": "Restaurant Name",
    "verification": {
      "status": "pending"
    }
  }
]
```

### 6. Get Pending Applications (Admin Only)

```http
GET /api/restaurant/pending
```

**Headers:** `Authorization: Bearer {admin_token}`
**Response:** `200 OK`

### 7. Get Restaurant by ID (Public)

```http
GET /api/restaurant/{restaurantId}
```

**Response:** `200 OK`

```json
{
  "_id": "restaurant_id",
  "restaurantName": "The Gourmet Place",
  "description": "Fine dining",
  "address": {...}
}
```

### 8. Approve/Reject Restaurant (Admin Only)

```http
PATCH /api/restaurant/{restaurantId}/verify
```

**Headers:** `Authorization: Bearer {admin_token}`
**Body:**

```json
{
  "status": "approved",
  "rejectionReason": "",
  "notes": "All documents verified"
}
```

**Response:** `200 OK`

---

## 🍽️ Menu Endpoints (`/api/menu`)

### 1. Get Categories

```http
GET /api/menu/categories?restaurantId={restaurantId}
```

**Query Params:**

- `restaurantId` (optional for public, required if not authenticated)
  **Response:** `200 OK`

```json
[
  {
    "_id": "category_id",
    "name": "Appetizers",
    "restaurantId": "restaurant_id",
    "displayOrder": 0,
    "active": true
  }
]
```

### 2. Create Category (Restaurant Only)

```http
POST /api/menu/categories
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Body:**

```json
{
  "name": "Desserts"
}
```

**Response:** `201 Created`

### 3. Update Category (Restaurant Only)

```http
PATCH /api/menu/categories/{categoryId}
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Body:**

```json
{
  "name": "Updated Category Name",
  "active": true
}
```

**Response:** `200 OK`

### 4. Delete Category (Restaurant Only)

```http
DELETE /api/menu/categories/{categoryId}
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Response:** `200 OK`

### 5. Reorder Categories (Restaurant Only)

```http
PATCH /api/menu/categories/reorder
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Body:**

```json
{
  "categoryIds": ["cat1_id", "cat2_id", "cat3_id"]
}
```

**Response:** `200 OK`

### 6. Get Menu Items

```http
GET /api/menu/items?restaurantId={restaurantId}&search=pizza&category=cat_id&page=1&limit=20
```

**Query Params:**

- `restaurantId` (optional for public)
- `search` (optional): Search term
- `category` (optional): Category ID or "all"
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 100)
- `sort` (optional): Sort field
  **Response:** `200 OK`

```json
{
  "items": [
    {
      "_id": "item_id",
      "name": "Margherita Pizza",
      "description": "Classic pizza",
      "price": 12.99,
      "categoryId": {...},
      "imageUrl": "/uploads/image.jpg",
      "availability": true,
      "isVeg": true
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

### 7. Get Menu by Table QR Code (Public)

```http
GET /api/menu/by-table/{qrSlug}
```

**Response:** `200 OK`

```json
{
  "table": {
    "_id": "table_id",
    "number": 5,
    "qrSlug": "table-5-123456"
  },
  "categories": [...],
  "items": [...]
}
```

### 8. Create Menu Item (Restaurant Only)

```http
POST /api/menu/items
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Body:**

```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato and mozzarella",
  "price": 12.99,
  "categoryId": "category_id",
  "imageUrl": "/uploads/image.jpg",
  "availability": true,
  "isVeg": true,
  "tags": ["popular", "vegetarian"],
  "enableCustomization": true,
  "sizes": [
    { "name": "Small", "price": 10.99 },
    { "name": "Large", "price": 14.99 }
  ],
  "addOns": [{ "name": "Extra Cheese", "price": 2.0 }]
}
```

**Response:** `201 Created`

### 9. Update Menu Item (Restaurant Only)

```http
PATCH /api/menu/items/{itemId}
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Body:**

```json
{
  "price": 13.99,
  "availability": false
}
```

**Response:** `200 OK`

### 10. Delete Menu Item (Restaurant Only)

```http
DELETE /api/menu/items/{itemId}
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Response:** `200 OK`

---

## 📋 Order Endpoints (`/api/orders`)

### 1. Create Order (Public - Rate Limited)

```http
POST /api/orders
```

**Body:**

```json
{
  "restaurantId": "restaurant_id",
  "tableNumber": "5",
  "items": [
    {
      "menuItemId": "item_id",
      "name": "Margherita Pizza",
      "price": 12.99,
      "quantity": 2
    }
  ],
  "specialInstructions": "No onions please",
  "totalAmount": 25.98
}
```

**Response:** `201 Created`

```json
{
  "_id": "order_id",
  "restaurantId": {...},
  "tableNumber": "5",
  "items": [...],
  "status": "placed",
  "totalAmount": 25.98,
  "createdAt": "2025-01-26T..."
}
```

### 2. Get All Orders (Restaurant Only)

```http
GET /api/orders?status=placed,preparing
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Query Params:**

- `status` (optional): Comma-separated statuses (`placed`, `preparing`, `ready`, `served`)
  **Response:** `200 OK`

```json
[
  {
    "_id": "order_id",
    "tableNumber": "5",
    "items": [...],
    "status": "placed",
    "totalAmount": 25.98,
    "createdAt": "2025-01-26T..."
  }
]
```

### 3. Get Single Order (Public)

```http
GET /api/orders/{orderId}
```

**Response:** `200 OK`

```json
{
  "_id": "order_id",
  "restaurantId": {...},
  "tableNumber": "5",
  "items": [...],
  "status": "preparing",
  "totalAmount": 25.98,
  "estimatedWaitTime": 20,
  "createdAt": "2025-01-26T..."
}
```

### 4. Update Order Status (Restaurant Only)

```http
PATCH /api/orders/{orderId}/status
```

**Headers:** `Authorization: Bearer {restaurant_token}`
**Body:**

```json
{
  "status": "preparing",
  "estimatedWaitTime": 20,
  "estimatedReadyTime": "2025-01-26T12:30:00Z"
}
```

**Response:** `200 OK`

---

## 🪑 Table Endpoints (`/api/tables`)

### 1. Get All Tables (Staff/Admin Only)

```http
GET /api/tables
```

**Headers:** `Authorization: Bearer {token}`
**Response:** `200 OK`

```json
[
  {
    "_id": "table_id",
    "number": 5,
    "qrSlug": "table-5-123456",
    "createdAt": "2025-01-26T..."
  }
]
```

### 2. Create Table (Admin Only)

```http
POST /api/tables
```

**Headers:** `Authorization: Bearer {admin_token}`
**Body:**

```json
{
  "number": 5
}
```

**Response:** `201 Created`

```json
{
  "_id": "table_id",
  "number": 5,
  "qrSlug": "table-5-1706270400000"
}
```

### 3. Get QR Code for Table (Admin Only)

```http
GET /api/tables/{tableId}/qr
```

**Headers:** `Authorization: Bearer {admin_token}`
**Response:** `200 OK`

```json
{
  "qrCode": "data:image/png;base64,...",
  "url": "http://localhost:3000/m/table-5-123456"
}
```

### 4. Delete Table (Admin Only)

```http
DELETE /api/tables/{tableId}
```

**Headers:** `Authorization: Bearer {admin_token}`
**Response:** `200 OK`

---

## 📤 Upload Endpoints (`/api/upload`)

### 1. Upload Single File

```http
POST /api/upload/single
```

**Body:** `multipart/form-data`

- `document`: File (max 5MB, images/PDF only)
  **Response:** `200 OK`

```json
{
  "message": "File uploaded successfully",
  "fileUrl": "/uploads/document-123456.jpg",
  "filename": "document-123456.jpg",
  "originalName": "my-document.jpg",
  "size": 1024000
}
```

### 2. Upload Multiple Files

```http
POST /api/upload/multiple
```

**Body:** `multipart/form-data`

- `documents`: Files (max 5 files, 5MB each)
  **Response:** `200 OK`

```json
{
  "message": "Files uploaded successfully",
  "files": [
    {
      "fileUrl": "/uploads/document-123456.jpg",
      "filename": "document-123456.jpg",
      "originalName": "doc1.jpg",
      "size": 1024000
    }
  ]
}
```

### 3. Upload Menu Item Image

```http
POST /api/upload/menu-image
```

**Body:** `multipart/form-data`

- `image`: Image file (max 5MB)
  **Response:** `200 OK`

```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/image-123456.jpg",
  "filename": "image-123456.jpg"
}
```

### 4. Delete File

```http
DELETE /api/upload/{filename}
```

**Response:** `200 OK`

```json
{
  "message": "File deleted successfully"
}
```

---

## 🔒 Authentication & Authorization

### Token Format

All authenticated requests require a JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

### User Roles

- **customer**: Regular customers (can place orders)
- **staff**: Restaurant staff (can view/manage orders)
- **admin**: System admin (can manage restaurants, verify applications)
- **restaurant**: Restaurant owner (can manage menu, view orders)

### Token Expiry

- Tokens expire after **7 days**
- Use `/api/auth/refresh` to get a new token

---

## 📊 Response Status Codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| 200  | Success                          |
| 201  | Created                          |
| 400  | Bad Request                      |
| 401  | Unauthorized                     |
| 403  | Forbidden                        |
| 404  | Not Found                        |
| 429  | Too Many Requests (Rate Limited) |
| 500  | Internal Server Error            |

---

## 🚦 Rate Limiting

- **Auth endpoints** (`/login`, `/register`): Limited to prevent brute force
- **Order creation**: Limited to prevent spam
- Limits reset after a time window

---

## 🔍 Error Response Format

```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common error codes:

- `INVALID_CREDENTIALS`
- `TOKEN_EXPIRED`
- `INVALID_TOKEN`
- `NOT_AUTHENTICATED`
- `REGISTRATION_ERROR`
- `LOGIN_ERROR`

---

## 📝 Notes

1. **Public endpoints** don't require authentication
2. **Restaurant endpoints** require restaurant token
3. **Admin endpoints** require admin token
4. **File uploads** are limited to 5MB per file
5. **QR codes** are generated as base64 data URLs
6. **Orders** can be tracked publicly by order ID
7. **Menu items** can be viewed publicly by restaurant ID

---

## 🧪 Testing with cURL

### Example: Customer Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password123"}'
```

### Example: Get Menu Items

```bash
curl http://localhost:5000/api/menu/items?restaurantId=RESTAURANT_ID
```

### Example: Create Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId":"RESTAURANT_ID",
    "tableNumber":"5",
    "items":[{"menuItemId":"ITEM_ID","name":"Pizza","price":12.99,"quantity":1}],
    "totalAmount":12.99
  }'
```

---

**Total Endpoints: 40+**

For Postman collection or more examples, let me know! 🚀
