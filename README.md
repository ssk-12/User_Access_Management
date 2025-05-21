# User Access Management System - Frontend

A React application for managing software access requests within an organization. The system supports three roles: Admin, Manager, and Employee, each with their own capabilities and views.

## Features

- **Role-based Authentication**: Login with role-specific redirects
- **Employee Features**: Dashboard, request creation, view request history
- **Manager Features**: Review team access requests, approve/reject with comments
- **Admin Features**: User management, software management, view all requests
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
