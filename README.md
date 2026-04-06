# University Event Management System

A university event management module built as part of the **IUS Campus Management Platform**. This project uses **ASP.NET Core Web API** for the backend and will use **React** for the frontend.

## Current Status

The backend project is set up with:

* ASP.NET Core Web API
* OpenAPI support
* Swagger UI
* Entity Framework Core
* Docker-based SQL Server setup for team development
* Initial project structure for further expansion

## Project Structure

```text
University-Event-Management-System/
├── backend/
│   └── IusEventManagement.Api/
└── frontend/
    └── ius-event-management-frontend/
```

## Prerequisites

Before running the backend, make sure these are installed:

* **Git**
* **.NET SDK 10**
* **Node.js + npm**
* Docker Desktop
* **VS Code** or Visual Studio

## Backend Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd University-Event-Management-System
```

### 2. Start SQL SErver in Docker
This project uses SQL Server in Docker on port 1433 so that both Windows and macOS team members can run the backend consistently.

Run this command:
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Password1!" -p 1433:1433 --name ius-event-db -d mcr.microsoft.com/mssql/server:2022-latest
```
If the container already exists and is stopped, start it with:

```bash
docker start ius-event-db
```

### 3. Go to the backend project

```bash
cd backend/IusEventManagement.Api
```

### 4. Restore packages

```bash
dotnet restore
```

### 5. Apply database migrations

```bash
dotnet ef database update
```

If migrations do not exist yet, create them first:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Running the Backend

From the backend project folder:

```bash
dotnet run
```

The API will start on a local URL similar to:

```text
http://localhost:5226
```

## Swagger UI

After running the backend, open Swagger in your browser:

```text
http://localhost:5226/swagger
```

## Test Endpoint

A simple test endpoint is currently available:

```text
GET /api/test
```

Example browser URL:

```text
http://localhost:5226/api/test
```

Expected response:

```text
API is working
```

## Database Configuration

The backend currently uses the connection string defined in `appsettings.json`.

Example:

```json
"AllowedHosts": "*",
"ConnectionStrings": {
  "DefaultConnection": "Data Source=localhost,1433;Initial Catalog=IusEventDb;User Id=SA;Password=Password1!;Connect Timeout=30;TrustServerCertificate=True"
}
```

## Why Docker is used

Using Docker avoids machine-specific setup issues such as:

* Windows-only LocalDB
* Different SQL Server installations
* Inconsistent team environments

This makes the backend easier to run for all group members, including macOS users.

## Useful Commands

### Build the project

```bash
dotnet build
```

### Run migrations

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Run the API

```bash
dotnet run
```

## Notes

* Swagger is configured at `/swagger`
* OpenAPI JSON is available at `/openapi/v1.json`
* The frontend setup will be added later

## Frontend Setup

### 1. Navigate to frontend folder

```bash
cd frontend/ius-frontend

```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the frontend

```bash
npm run dev
```

### 4. Open in browser

```text
http://localhost:5173
```

## Notes for Frontend Development

The frontend application is developed using React with Vite. At the current stage, mock data is used, and backend integration is prepared but not fully implemented.

Project structure overview:

- Entry point:  
  src/main.jsx  

- Main application setup and routing:  
  src/App.jsx  

- API configuration (future backend connection):  
  src/api/index.js  

- Authentication context:  
  src/context/AuthContext.jsx  

- Route protection:  
  src/routes/ProtectedRoute.jsx  

- Mock data source:  
  src/mockData.js  

- Reusable components:  
  src/components/  
  (includes DashboardLayout, Sidebar, Modal, Toast, EventCard, etc.)

- Pages organized by roles:  
  src/pages/

  - Student pages:  
    src/pages/student/  

  - Admin pages:  
    src/pages/admin/  

  - Organizer pages:  
    src/pages/organizer/  

  - Authentication pages:  
    src/pages/auth/  

The structure follows a modular and role-based organization, making it scalable and easier to maintain. The API layer and context system are prepared for future backend integration.


## Team
1. Dzejlan Colakhodzic - dzeejlann
2. Amina Jusic - chimin14
3. Ervin Dragovic - DrErvin
4. Riad Elezovic - MrR1ad
