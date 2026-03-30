# University Event Management System

A university event management module built as part of the **IUS Campus Management Platform**. This project uses **ASP.NET Core Web API** for the backend and will use **React** for the frontend.

## Current Status

The backend project is set up with:

* ASP.NET Core Web API
* OpenAPI support
* Swagger UI
* Entity Framework Core
* SQL Server / LocalDB configuration
* Initial project folder structure

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
* **SQL Server LocalDB** or SQL Server
* **VS Code** or Visual Studio

## Backend Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd University-Event-Management-System
```

### 2. Go to the backend project

```bash
cd backend/IusEventManagement.Api
```

### 3. Restore packages

```bash
dotnet restore
```

### 4. Apply database migrations

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

## Connection String

The backend currently uses the connection string defined in `appsettings.json`.

Example:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=IusEventDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

If LocalDB is not available on your machine, replace it with your own SQL Server connection string.

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
cd frontend/ius-event-management-frontend
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

* The frontend is built using **React + Vite**
* Mock data is currently used (no backend required)
* Main UI page is located in:

```text
src/pages/EventsPage.jsx
```

* Mock data is located in:

```text
src/mock/events.js
```

* Service layer (future API connection):

```text
src/services/eventService.js
```


## Team
1. Dzejlan Colakhodzic - dzeejlann
2. Amina Jusic - chimin14
3. Ervin Dragovic - DrErvin
4. Riad Elezovic - MrR1ad
