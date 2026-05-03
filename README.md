UNIVERSITY EVENT MANAGEMENT SYSTEM - BACKEND

PROJECT OVERVIEW\
This repository contains the backend services for the University Event Management System. It is built using .NET 10 and Microsoft SQL Server, and it strictly follows a 4-layer Clean Architecture pattern. The entire environment is containerized using Docker to ensure consistency across all developer machines.

PREREQUISITES\
To run and develop this project, you must have the following installed on your machine:

-   .NET 10 SDK

    -   Docker Desktop (must be running in the background)

    -   Visual Studio Code

    -   VS Code Extensions: C# Dev Kit, C# (Base), Docker, and SQL Server (mssql)

PROJECT ARCHITECTURE\
The solution is divided into four distinct layers to separate concerns:

-   Domain: Contains core business entities (like Event) and enums. It has zero dependencies on any other project.

    -   Application: Contains business logic, Data Transfer Objects (DTOs), and interfaces (like Repository interfaces). It depends only on the Domain layer.

    -   Infrastructure: Handles data access, Entity Framework Core Database Context, Repositories, Migrations, and external services. It depends on Domain and Application.

    -   API: The entry point for the frontend. Contains HTTP Controllers, Swagger setup, and dependency injection configurations. It depends on Infrastructure and Application.

SETUP AND RUN INSTRUCTIONS\
Follow these steps to get the project running locally from scratch:

-   Clone the repository and open the root folder (University-Event-Management-System) in VS Code.

    -   Ensure Docker Desktop is running on your computer.

    -   Open the VS Code integrated terminal and spin up the database and API containers by typing:\
    docker compose up -d

    -   Wait about 15 to 20 seconds for the MS SQL Server to fully boot up.

    -   Apply the database migrations to generate your SQL tables by running:\
    dotnet ef database update --project UniversityEventManagement.Infrastructure --startup-project UniversityEventManagement.Api

    -   (Optional) Connect to the database inside VS Code using the SQL Server extension to view your tables. Use Server: localhost,1433, Username: sa, and Password: YourStrong@Password123.

    -   To run and debug the API code locally, simply press F5 in VS Code or run "dotnet run" inside the UniversityEventManagement.Api folder.

HOW TO ADD NEW FEATURES\
When you need to build a new feature (for example, adding a "Student" or "Venue"), you must follow the layered architecture workflow. Do not skip layers.

Step 1: Update the Domain\
Go to the Domain layer (Domain/Entities) and create your new C# class (e.g., Venue.cs). Define its properties (Id, Name, Capacity, etc.).

Step 2: Update the DbContext\
Go to the Infrastructure layer (Infrastructure/Data/ApplicationDbContext.cs) and add a new DbSet for your entity so Entity Framework knows about it.\
Example: public DbSet<Venue> Venues { get; set; }

Step 3: Create and Apply a Database Migration\
Open your terminal and generate the SQL for your new table by running:\
dotnet ef migrations add AddVenueEntity --project UniversityEventManagement.Infrastructure --startup-project UniversityEventManagement.Api

Apply it to the Docker database:\
dotnet ef database update --project UniversityEventManagement.Infrastructure --startup-project UniversityEventManagement.Api

Step 4: Create DTOs and Interfaces\
Go to the Application layer. Create the necessary DTOs (e.g., CreateVenueDto, VenueResponseDto) so you aren't exposing your raw database entities to the internet. Next, create a Repository Interface (e.g., IVenueRepository) that defines what database actions can be done (GetAll, GetById, Add, Delete).

Step 5: Implement the Repository\
Go to the Infrastructure layer and create a Repositories folder. Inside it, create the actual class (e.g., VenueRepository.cs) that implements your IVenueRepository interface. This is where you write the Entity Framework queries to interact with the database. Register this repository in the API's Program.cs file (using builder.Services.AddScoped).

Step 6: Implement Business Logic (Services)\
Go back to the Application layer and create an IVenueService interface, then implement it in a VenueService class. The Service should use your Repository to fetch data, apply any necessary business rules, and map the data to your DTOs before passing it to the controller.

Step 7: Expose the API Endpoint\
Finally, go to the API layer (Api/Controllers) and create a VenuesController. Inject your IVenueService into the controller and create the HTTP GET, POST, PUT, and DELETE endpoints for the React frontend to consume.
