using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace MyMedicine.Migrations.Medicine
{
    public partial class DeleteLinkToDiseaseTableFromDoctorTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Diseases_Doctors_DoctorId",
                table: "Diseases");

            migrationBuilder.DropIndex(
                name: "IX_Diseases_DoctorId",
                table: "Diseases");

            migrationBuilder.DropColumn(
                name: "DiseaseId",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "DoctorId",
                table: "Diseases");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DiseaseId",
                table: "Doctors",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DoctorId",
                table: "Diseases",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Diseases_DoctorId",
                table: "Diseases",
                column: "DoctorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Diseases_Doctors_DoctorId",
                table: "Diseases",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "DoctorId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
