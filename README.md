# TurfEasePro

A comprehensive turf booking platform built with Node.js, TypeScript, Fastify, and MongoDB. This platform connects turf owners with users looking to book sports facilities.

## 🚀 Features

### Authentication & Authorization
- **User Registration & Login** - Secure JWT-based authentication
- **Role-based Access Control** - Support for `user`, `partner`, and `admin` roles
- **Profile Management** - Users and partners can update their profiles
- **Password Security** - Bcrypt password hashing

### Turf Management
- **Create Turf Listings** - Partners can add their turfs with location, pricing, and details
- **Geolocation Search** - Find nearby turfs using latitude/longitude with radius search
- **Turf Approval System** - Admin approval required for turf listings
- **Turf Details** - View comprehensive turf information including ratings and pricing
- **Location-based Services** - GeoJSON support for precise location tracking

### Booking System
- **Create Bookings** - Users can book turfs for specific time slots
- **Booking Management** - View, cancel, and manage bookings
- **Booking History** - Track all past and current bookings
- **Real-time Availability** - Automatic conflict detection for overlapping bookings
- **Partner Dashboard** - Partners can view bookings for their turfs

### Payment Processing
- **Secure Payments** - Integration with Razorpay for payment processing
- **Payment Tracking** - Complete payment history and status tracking
- **Admin Payment Oversight** - Admins can view all platform transactions

### Review & Rating System
- **User Reviews** - Users can rate and review turfs after booking
- **Turf Ratings** - Automatic rating calculation and display
- **Review Management** - View and manage all reviews

### Admin Dashboard
- **Turf Approval** - Approve or reject turf submissions with reasons
- **User Management** - Ban/unban users with reason tracking
- **Revenue Analytics** - Comprehensive revenue summaries and insights
- **Platform Oversight** - View all bookings, payments, and platform activities

## 🛠 Tech Stack

- **Backend**: Node.js, TypeScript, Fastify
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Caching**: Redis
- **Security**: Helmet, CORS, Bcrypt
- **Payment**: Razorpay Integration
- **Validation**: Joi for environment variable validation
- **Geolocation**: MongoDB GeoJSON with 2dsphere indexing

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/          # Authentication & JWT
│   ├── users/         # User management
│   ├── turf/          # Turf CRUD & search
│   ├── booking/       # Booking system
│   ├── payments/      # Payment processing
│   ├── reviews/       # Review & rating system
│   └── admin/         # Admin dashboard
├── config/
│   ├── db.ts          # MongoDB connection
│   ├── redis.ts       # Redis connection
│   └── env.ts         # Environment validation
├── app.ts             # Fastify app setup
└── server.ts          # Server entry point
```

## 🗄 Database Models

### User Model
- `name`, `email`, `password`
- `role`: user | partner | admin
- `isActive`: Account status
- Password hashing with bcrypt

### Turf Model
- `name`, `address`, `pricePerHour`
- `location`: GeoJSON Point coordinates
- `owner`: Partner reference
- `approved`: Admin approval status
- `rating`, `ratingCount`: Review metrics

### Booking Model
- `turf`, `user`: References
- `startTime`, `endTime`: Booking period
- `totalPrice`: Calculated cost
- `status`: pending | confirmed | cancelled

### Payment Model
- `booking`, `user`: References
- `amount`, `status`: Payment details
- `razorpayOrderId`: External payment reference

### Review Model
- `turf`, `user`: References
- `rating`: 1-5 stars
- `comment`: User feedback

## 🔐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user profile

### Turfs (`/api/turfs`)
- `GET /` - List all turfs
- `GET /search` - Search nearby turfs
- `GET /:id` - Get turf details
- `POST /` - Create turf (Partners only)
- `PATCH /:id/approve` - Approve turf (Admins only)

### Bookings (`/api/bookings`)
- `POST /` - Create booking (Users only)
- `GET /me` - Get user bookings
- `PATCH /:id/cancel` - Cancel booking
- `GET /turf/:id` - Get turf bookings (Partners/Admins)

### Payments (`/api/payments`)
- `POST /:bookingId` - Initiate payment
- `GET /me` - Get user payments
- `GET /` - Get all payments (Admins only)

### Reviews (`/api/reviews`)
- `POST /:turfId` - Add review (Users only)
- `GET /:turfId` - Get turf reviews
- `GET /me/all` - Get user reviews

### Users (`/api/users`)
- `GET /me` - Get user profile
- `PUT /me` - Update profile
- `GET /me/bookings` - Get booking history

### Admin (`/api/admin`)
- `POST /approve-turf/:id` - Approve turf
- `POST /reject-turf/:id` - Reject turf
- `POST /ban-user/:id` - Ban user
- `POST /unban-user/:id` - Unban user
- `GET /bookings` - Get all bookings
- `GET /revenue-summary` - Get revenue analytics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Redis
- Razorpay Account (for payments)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env` example)
4. Start development server: `npm run start`
5. Build for production: `npm run build`

### Environment Variables
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/turfeasepro
JWT_SECRET=your-jwt-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
REDIS_URL=redis://localhost:6379
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- Secure environment variable handling

## 🌟 Key Features

- **Multi-role System**: Users, Partners, and Admins with distinct permissions
- **Geolocation Search**: Find turfs within specified radius
- **Real-time Booking**: Automatic conflict detection and availability management
- **Payment Integration**: Secure payment processing with Razorpay
- **Review System**: User-generated ratings and reviews
- **Admin Dashboard**: Comprehensive platform management tools
- **Scalable Architecture**: Modular design with separation of concerns

## 📊 Platform Capabilities

- Support for multiple turf types and sports
- Flexible pricing models per hour
- Comprehensive booking management
- Revenue tracking and analytics
- User activity monitoring
- Content moderation tools

This platform provides a complete solution for turf booking businesses, offering seamless experiences for turf owners, customers, and platform administrators.