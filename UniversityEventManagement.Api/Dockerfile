FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy all project files
COPY ["UniversityEventManagement.Api/UniversityEventManagement.Api.csproj", "UniversityEventManagement.Api/"]
COPY ["UniversityEventManagement.Application/UniversityEventManagement.Application.csproj", "UniversityEventManagement.Application/"]
COPY ["UniversityEventManagement.Domain/UniversityEventManagement.Domain.csproj", "UniversityEventManagement.Domain/"]
COPY ["UniversityEventManagement.Infrastructure/UniversityEventManagement.Infrastructure.csproj", "UniversityEventManagement.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "UniversityEventManagement.Api/UniversityEventManagement.Api.csproj"

# Copy the rest of the code
COPY . .
WORKDIR "/src/UniversityEventManagement.Api"
RUN dotnet build "UniversityEventManagement.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "UniversityEventManagement.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UniversityEventManagement.Api.dll"]