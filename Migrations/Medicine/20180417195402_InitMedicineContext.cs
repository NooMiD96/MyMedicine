using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace MyMedicine.Migrations.Medicine
{
    public partial class InitMedicineContext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    PostId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Context = table.Column<string>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    Header = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.PostId);
                });

            migrationBuilder.CreateTable(
                name: "Separations",
                columns: table => new
                {
                    SeparationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address = table.Column<string>(nullable: false),
                    DoctorId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Separations", x => x.SeparationId);
                });

            migrationBuilder.CreateTable(
                name: "SymptomLists",
                columns: table => new
                {
                    SymptomListId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Symptom10Id = table.Column<int>(nullable: true),
                    Symptom1Id = table.Column<int>(nullable: false),
                    Symptom2Id = table.Column<int>(nullable: false),
                    Symptom3Id = table.Column<int>(nullable: true),
                    Symptom4Id = table.Column<int>(nullable: true),
                    Symptom5Id = table.Column<int>(nullable: true),
                    Symptom6Id = table.Column<int>(nullable: true),
                    Symptom7Id = table.Column<int>(nullable: true),
                    Symptom8Id = table.Column<int>(nullable: true),
                    Symptom9Id = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SymptomLists", x => x.SymptomListId);
                });

            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    DoctorId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DiseaseId = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(nullable: false),
                    SecondName = table.Column<string>(nullable: false),
                    SeparationId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.DoctorId);
                    table.ForeignKey(
                        name: "FK_Doctors_Separations_SeparationId",
                        column: x => x.SeparationId,
                        principalTable: "Separations",
                        principalColumn: "SeparationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Symptoms",
                columns: table => new
                {
                    SymptomId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: false),
                    SymptomListId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Symptoms", x => x.SymptomId);
                    table.ForeignKey(
                        name: "FK_Symptoms_SymptomLists_SymptomListId",
                        column: x => x.SymptomListId,
                        principalTable: "SymptomLists",
                        principalColumn: "SymptomListId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Diseases",
                columns: table => new
                {
                    DiseaseId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DoctorId = table.Column<int>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    SymptomListId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diseases", x => x.DiseaseId);
                    table.ForeignKey(
                        name: "FK_Diseases_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "DoctorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Diseases_SymptomLists_SymptomListId",
                        column: x => x.SymptomListId,
                        principalTable: "SymptomLists",
                        principalColumn: "SymptomListId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Visitations",
                columns: table => new
                {
                    VisitationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Date = table.Column<DateTime>(nullable: false),
                    DiseaseId = table.Column<int>(nullable: false),
                    DoctorId = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(nullable: false),
                    Male = table.Column<bool>(nullable: false),
                    SecondName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Visitations", x => x.VisitationId);
                    table.ForeignKey(
                        name: "FK_Visitations_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "DoctorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Diseases_DoctorId",
                table: "Diseases",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Diseases_SymptomListId",
                table: "Diseases",
                column: "SymptomListId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_SeparationId",
                table: "Doctors",
                column: "SeparationId");

            migrationBuilder.CreateIndex(
                name: "IX_Symptoms_SymptomListId",
                table: "Symptoms",
                column: "SymptomListId");

            migrationBuilder.CreateIndex(
                name: "IX_Visitations_DoctorId",
                table: "Visitations",
                column: "DoctorId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Diseases");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Symptoms");

            migrationBuilder.DropTable(
                name: "Visitations");

            migrationBuilder.DropTable(
                name: "SymptomLists");

            migrationBuilder.DropTable(
                name: "Doctors");

            migrationBuilder.DropTable(
                name: "Separations");
        }
    }
}
