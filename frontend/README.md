# TurfEasePro Frontend

The frontend application for TurfEasePro - a comprehensive turf booking platform built with React and TypeScript.

## 🚀 Features

### Authentication & User Management
- **User Registration & Login** - Secure authentication with JWT tokens
- **Role-based Access** - Support for users, partners, and admins
- **Profile Management** - Update user information and preferences
- **Protected Routes** - Authentication guards for sensitive pages

### Turf Discovery & Search
- **Browse Turfs** - View all available turfs in the platform
- **Advanced Search** - Location-based search with radius filtering
- **Turf Details** - Comprehensive information including pricing, ratings, and availability
- **Interactive Maps** - Visual location representation

### Booking System
- **Real-time Booking** - Instant slot booking with availability checking
- **Booking Management** - View, cancel, and manage bookings
- **Calendar View** - Visual booking calendar interface
- **Booking History** - Complete booking timeline

### Payment Integration
- **Secure Payments** - Razorpay integration for safe transactions
- **Payment History** - Track all payment activities
- **Multiple Payment Options** - Support for various payment methods

### Review & Rating System
- **User Reviews** - Share experiences and rate turfs
- **Rating Display** - Average ratings and review counts
- **Review Management** - Edit and delete own reviews

### Admin Dashboard
- **User Management** - Ban/unban users with reason tracking
- **Turf Approval** - Review and approve turf submissions
- **Revenue Analytics** - Comprehensive financial insights
- **Platform Oversight** - Monitor all platform activities

### Partner Dashboard
- **Turf Management** - Create, edit, and manage turf listings
- **Booking Analytics** - Track performance and revenue
- **Calendar Management** - View and manage booking schedules

## 🛠 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand
- **API Client**: Axios with React Query
- **UI Framework**: Tailwind CSS
- **Components**: Headless UI & Heroicons
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Date Handling**: Date-fns

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Navbar.tsx
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── TurfListPage.tsx
│   │   ├── TurfDetailPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   └── PartnerDashboardPage.tsx
│   ├── services/           # API service layers
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── turf.service.ts
│   │   ├── booking.service.ts
│   │   ├── payment.service.ts
│   │   └── review.service.ts
│   ├── stores/             # State management
│   │   └── auth.store.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── contexts/            # React contexts
│   ├── App.tsx             # Main app component
│   ├── index.tsx           # Entry point
│   └── index.css           # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd turfeasepro/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🔐 Authentication Flow

### User Registration
1. Navigate to `/register`
2. Fill in registration form (name, email, password, role)
3. Choose role: `user` or `partner`
4. Submit form and receive JWT token

### Login Process
1. Navigate to `/login`
2. Enter email and password
3. Receive authentication token
4. Redirect to dashboard based on role

### Role-based Routing
- **Users**: `/dashboard` - Bookings and profile management
- **Partners**: `/partner` - Turf and booking management
- **Admins**: `/admin` - Platform administration

## 🌐 API Integration

### Service Architecture
- **Centralized API client** with interceptors for authentication
- **Service modules** for each backend feature
- **Error handling** with automatic token refresh
- **Request/response interceptors** for logging and auth

### Available Services
- `authService` - Authentication and user management
- `turfService` - Turf CRUD and search operations
- `bookingService` - Booking management operations
- `paymentService` - Payment processing and history
- `reviewService` - Review and rating management

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive layouts for all screen sizes
- Touch-friendly interfaces

### Accessibility
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

### User Experience
- Loading states and skeleton screens
- Error boundaries and graceful error handling
- Toast notifications for user feedback
- Form validation with real-time feedback

## 🔄 State Management

### Zustand Store Structure
- **Auth Store**: User authentication state
- **Token Management**: Automatic token persistence
- **Role-based Access**: Permission checking
- **Profile Updates**: Real-time user data sync

### Local Storage Integration
- Token persistence across sessions
- User data caching
- Automatic logout on token expiry

## 🛡 Security Features

- **JWT Authentication**: Secure token-based auth
- **Route Protection**: Authentication guards
- **XSS Prevention**: Input sanitization
- **CSRF Protection**: Secure API requests
- **Secure Storage**: HttpOnly cookies for sensitive data

## 📱 Component Architecture

### Reusable Components
- **Navbar**: Main navigation with role-based menu
- **Card Components**: Consistent UI patterns
- **Form Components**: Validated input fields
- **Modal Components**: Interactive overlays
- **Loading Components**: Skeleton screens and spinners

### Page Components
- **Public Pages**: Home, login, register
- **User Pages**: Dashboard, profile, bookings
- **Admin Pages**: Comprehensive admin interface
- **Partner Pages**: Turf management dashboard

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_URL=https://api.turfeasepro.com/api
REACT_APP_RAZORPAY_KEY_ID=production_razorpay_key
```

### Deployment Options
- **Static Hosting**: Vercel, Netlify, AWS S3
- **Server Rendering**: Node.js with Express
- **Container**: Docker with Nginx

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- Component unit tests
- Integration tests for services
- End-to-end testing with Cypress
- Accessibility testing

## 📊 Performance Optimization

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format and lazy loading
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching Strategy**: Service worker implementation

## 🔧 Development Tools

### Available Scripts
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Linting and Formatting
- ESLint configuration for React
- Prettier for code formatting
- TypeScript strict mode enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

**Note**: This frontend is designed to work with the TurfEasePro backend API. Ensure the backend server is running and properly configured for full functionality.