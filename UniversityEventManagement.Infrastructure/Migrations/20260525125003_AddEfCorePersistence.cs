using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace UniversityEventManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEfCorePersistence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Events",
                newName: "StartDate");

            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Events",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Events",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Events",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Events",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrganizerId",
                table: "Events",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Events",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Events",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "VenueId",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Venues",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Venues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Registrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RegisteredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CheckedIn = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Registrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Registrations_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Registrations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "JoinedAt", "Name", "Role", "Status" },
                values: new object[,]
                {
                    { 1, "student@ius.edu.ba", new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Student", "Student", "Active" },
                    { 2, "organizer@ius.edu.ba", new DateTime(2025, 9, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Organizer", "Organizer", "Active" },
                    { 3, "admin@ius.edu.ba", new DateTime(2025, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Admin User", "Admin", "Active" },
                    { 4, "lejla@ius.edu.ba", new DateTime(2025, 9, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lejla Muratovic", "Student", "Active" }
                });

            migrationBuilder.InsertData(
                table: "Venues",
                columns: new[] { "Id", "Capacity", "Location", "Name" },
                values: new object[,]
                {
                    { 1, 300, "Building A, Floor 1", "Main Auditorium" },
                    { 2, 40, "Building B, Floor 1", "Seminar Room 101" },
                    { 3, 60, "Building C, Floor 2", "Computer Lab 3" },
                    { 4, 500, "Campus Center", "Open Courtyard" },
                    { 5, 120, "Building A, Floor 3", "Conference Hall" }
                });

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Capacity", "Category", "Description", "EndDate", "Image", "OrganizerId", "StartDate", "Status", "Title", "VenueId" },
                values: new object[,]
                {
                    { 1, 60, "Workshop", "Hands-on workshop covering the fundamentals of machine learning using Python and scikit-learn.", new DateTime(2026, 4, 15, 14, 0, 0, 0, DateTimeKind.Unspecified), null, 2, new DateTime(2026, 4, 15, 10, 0, 0, 0, DateTimeKind.Unspecified), "Upcoming", "AI & Machine Learning Workshop", 3 },
                    { 2, 300, "Cultural", "An evening celebrating the diverse cultures of IUS students.", new DateTime(2026, 4, 20, 22, 0, 0, 0, DateTimeKind.Unspecified), null, 2, new DateTime(2026, 4, 20, 18, 0, 0, 0, DateTimeKind.Unspecified), "Upcoming", "IUS Spring Cultural Night", 1 },
                    { 3, 40, "Seminar", "Learn how to structure, write and publish academic research papers.", new DateTime(2026, 4, 10, 11, 0, 0, 0, DateTimeKind.Unspecified), null, 2, new DateTime(2026, 4, 10, 9, 0, 0, 0, DateTimeKind.Unspecified), "Upcoming", "Research Paper Writing Seminar", 2 },
                    { 4, 500, "Academic", "Meet representatives from companies and bring your CV.", new DateTime(2026, 3, 20, 17, 0, 0, 0, DateTimeKind.Unspecified), null, 2, new DateTime(2026, 3, 20, 10, 0, 0, 0, DateTimeKind.Unspecified), "Past", "Career Fair 2026", 4 }
                });

            migrationBuilder.InsertData(
                table: "Registrations",
                columns: new[] { "Id", "CheckedIn", "EventId", "RegisteredAt", "Status", "UserId" },
                values: new object[,]
                {
                    { 1, false, 1, new DateTime(2026, 4, 1, 10, 22, 0, 0, DateTimeKind.Unspecified), "Confirmed", 1 },
                    { 2, false, 2, new DateTime(2026, 4, 2, 8, 14, 0, 0, DateTimeKind.Unspecified), "Confirmed", 1 },
                    { 3, true, 1, new DateTime(2026, 4, 1, 11, 0, 0, 0, DateTimeKind.Unspecified), "Confirmed", 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Events_OrganizerId",
                table: "Events",
                column: "OrganizerId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_VenueId",
                table: "Events",
                column: "VenueId");

            migrationBuilder.CreateIndex(
                name: "IX_Registrations_EventId_UserId",
                table: "Registrations",
                columns: new[] { "EventId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Registrations_UserId",
                table: "Registrations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Users_OrganizerId",
                table: "Events",
                column: "OrganizerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Venues_VenueId",
                table: "Events",
                column: "VenueId",
                principalTable: "Venues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Users_OrganizerId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_Events_Venues_VenueId",
                table: "Events");

            migrationBuilder.DropTable(
                name: "Registrations");

            migrationBuilder.DropTable(
                name: "Venues");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Events_OrganizerId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_VenueId",
                table: "Events");

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "OrganizerId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "VenueId",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Events",
                newName: "Date");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Events",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
