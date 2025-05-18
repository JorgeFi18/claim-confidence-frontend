# Claims Confidence Frontend

A modern web application for managing insurance claims, built with Angular 17 and Tailwind CSS.

## Features

- 🔐 **Authentication & Authorization**
  - User login and registration
  - Role-based access control (Claimant, Manager)
  - Secure session management

- 📝 **Claims Management**
  - Create new claims with detailed information
  - View and manage existing claims
  - Track claim status (Pending, Submitted, Review, Approved, Rejected)
  - Add comments and track activity logs

- 👥 **User Roles**
  - **Claimants**: Can create and view their own claims
  - **Managers**: Can review, approve, or reject claims
  - **Providers**: Can view and manage their associated claims

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)
- Angular CLI (v19 or higher)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd claim-confidence-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.development.ts
```

4. Update the environment files with your configuration:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Development

Run the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`.

## Building for Production

Generate a production build:
```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core module (services, guards, interceptors)
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication module
│   │   ├── claims/         # Claims management module
│   │   └── providers/      # Providers management module
│   ├── shared/             # Shared components and utilities
│   └── app.component.ts    # Root component
├── assets/                 # Static assets
└── environments/           # Environment configurations
```

## Key Components

- **Claims Module**
  - `ClaimsListComponent`: Displays all claims with filtering and sorting
  - `ClaimFormComponent`: Form for creating and editing claims
  - `ClaimDetailComponent`: Detailed view of a single claim

- **Auth Module**
  - `LoginComponent`: User authentication
  - `AuthGuard`: Route protection based on user roles

## API Integration

The application integrates with the Claims Confidence Backend API. Key endpoints include:

- `/api/auth`: Authentication endpoints
- `/api/claims`: Claims management
- `/api/providers`: Provider information
- `/api/logs`: Activity logging

## Styling

The application uses:
- Tailwind CSS for styling
- Custom components with responsive design
- Consistent color scheme and typography

## Testing

Run unit tests:
```bash
ng test
```
