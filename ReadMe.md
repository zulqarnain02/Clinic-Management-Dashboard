# Allo Health Clinic Management System

## About Project

Allo Health Clinic Management System is a healthcare management solution designed to streamline clinic operations. It features appointment scheduling, queue management, and administrative controls with role-based access.

### Key Features

- Queue Management System with priority handling
- Appointment Scheduling and Management
- Role-based Access Control (Staff/Admin)
- Real-time Updates with React Query
- Responsive Design for all devices

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Query for state management
- Axios for API calls

### Backend

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Class Validator
- Winston Logger

## API Endpoints

### Authentication

- POST `/auth/login` - Staff login
- POST `/auth/register` - Staff registration

### Appointments

- GET `/appointments/get` - Get all appointments
- POST `/appointments/create` - Create new appointment
- PUT `/appointments/update/:id` - Update appointment
- DELETE `/appointments/cancel/:id` - Cancel appointment
- GET `/appointments/admin/all` - Get all appointments (Admin only)
- GET `/appointments/admin/doctor/:doctorId` - Get doctor's appointments

### Queue Management

- GET `/queue` - Get current queue
- POST `/queue/add` - Add patient to queue
- PUT `/queue/update/:id` - Update patient status/priority
- DELETE `/queue/remove/:id` - Remove from queue

## Codebase Structure & Best Practices

### Frontend Architecture
```
allo-health-dashboard/
├── app/ # Next.js app router pages
├── components/ # Reusable UI components
├── contexts/ # React contexts (Auth, Theme)
├── hooks/ # Custom React hooks
├── services/ # API service layers
└── utils/ # Utility functions
```

### Backend Architecture

```
allo-health-backend/
├── src/ # Main application code
├── modules/ # Feature-specific modules
├── common/ # Shared utilities and types
├── config/ # Configuration files
├── database/ # Database migrations and models
├── middleware/ # Middleware for authentication and error handling
├── types/ # TypeScript types and interfaces
├── utils/ # Utility functions
```

### OOP Principles Used

- **Dependency Injection**: NestJS modules and services
- **Single Responsibility**: Each service handles one domain
- **Interface Segregation**: Clear interface definitions
- **Repository Pattern**: Database operations abstraction
- **DTO Pattern**: Data transfer object validation

## Frontend Caching

React Query is used for frontend caching with the following strategies:

- Automatic background refetching
- Optimistic updates
- Cache invalidation on mutations
- Prefetching for better UX

## Database Schema

```sql
-- Users Table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    staffId VARCHAR UNIQUE,
    name VARCHAR,
    role VARCHAR CHECK (role IN ('ADMIN', 'STAFF')),
    email VARCHAR
);

-- Doctors Table
CREATE TABLE Doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    specialization VARCHAR,
    gender VARCHAR CHECK (gender IN ('MALE', 'FEMALE', 'OTHER'))
);

-- DoctorSchedule Table
CREATE TABLE DoctorSchedule (
    id SERIAL PRIMARY KEY,
    doctorId INTEGER REFERENCES Doctors(id),
    slots JSONB,
    metadata JSONB
);

-- Patients Table
CREATE TABLE Patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    age INTEGER,
    gender VARCHAR CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    phone_number VARCHAR
);

-- Appointments Table
CREATE TABLE Appointments (
    id SERIAL PRIMARY KEY,
    doctorId INTEGER REFERENCES Doctors(id),
    patientId INTEGER REFERENCES Patients(id),
    appointmentDate DATE,
    time TIME,
    status VARCHAR CHECK (status IN ('BOOKED', 'CANCELLED', 'COMPLETED'))
);

-- Queue Table
CREATE TABLE Queue (
    id SERIAL PRIMARY KEY,
    patientId INTEGER REFERENCES Patients(id),
    priority VARCHAR CHECK (priority IN ('NORMAL', 'URGENT')),
    status VARCHAR CHECK (status IN ('WAITING', 'WITH_DOCTOR', 'COMPLETED')),
    arrived_at TIMESTAMP
);

```

## Installation & Setup

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/your-repo/allo-health-clinic.git

# Navigate to dashboard directory
cd allo-health-dashboard

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd allo-health-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Setup database
npm run typeorm:migration:run

# Start development server
npm run start:dev
```

### Environment Variables

Frontend (.env.local):

```
NEXT_PUBLIC_API_URL=
```

Backend (.env):

```
PORT=

# Postgress
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
NODE_ENV=test
JWT_SECRET=
CA_CERT=
```
---
Reach out to me at my email zulqarnain4292@gmail.com for any questions or feedback.
Thank you!