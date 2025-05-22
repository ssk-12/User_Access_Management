# User Access Management System - Frontend

A React application for managing software access requests within an organization. The system supports three roles: Admin, Manager, and Employee, each with their own capabilities and views.

## Features

- **Role-based Authentication**: Login with role-specific redirects
- **Employee Features**: Dashboard, request creation, view request history
- **Manager Features**: Review team access requests, approve/reject with comments
- **Admin Features**: 
  - User management (create, edit, deactivate employees and managers)
  - Software management
  - View all requests
  - System configuration
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React
- React Router for navigation
- Axios for API requests
- Formik & Yup for form handling and validation
- JWT for authentication
- Tailwind CSS for styling
- Shadcn UI components

## Prerequisites

- Node.js (v18+)
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd user-access-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:5173

## API Configuration

The application connects to a backend API running at `http://localhost:8080/api/`. You can change this in the `src/services/api.js` file if needed.

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── common/         # Shared components
│   ├── admin/          # Admin-specific components
│   ├── manager/        # Manager-specific components
│   └── employee/       # Employee-specific components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── pages/              # Page components
├── services/           # API services
└── assets/             # Static assets
```

## Potential Enhancements

🚀 Enhancements Based on SRS:
1. Role-Based User Creation (Admin Panel)
✅ Admin can create:

👤 Employee

👨‍💼 Manager

🔐 Enforce role-specific access during creation & login.

2. User Management Dashboard
View, edit, or delete users.

Filter users by role/status.

- **Multi-factor Authentication**: Add additional security for sensitive operations
- **Notification System**: Email/in-app notifications for request status changes
- **Reports & Analytics**: Generate usage reports and visualize access patterns
- **Bulk Operations**: Allow admins to approve/reject multiple requests at once
- **Access Request Templates**: Pre-defined templates for common access patterns
- **User Hierarchy Management**: Configure reporting structures for approval flows
- **Audit Logging**: Enhanced tracking of all system activities
- **Self-service Password Reset**: Allow users to reset their passwords
- **Role-based Dashboard Widgets**: Customizable dashboard based on user role
