﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using MyMedicine.Context.Medicine;
using System;

namespace MyMedicine.Migrations.Medicine
{
    [DbContext(typeof(MedicineContext))]
    partial class MedicineContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.2-rtm-10011")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("MyMedicine.Context.Medicine.Comment", b =>
                {
                    b.Property<int>("CommentId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CommentInner")
                        .IsRequired();

                    b.Property<DateTime>("Date");

                    b.Property<int>("PostId");

                    b.Property<string>("UserName")
                        .IsRequired();

                    b.HasKey("CommentId");

                    b.HasIndex("PostId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Disease", b =>
                {
                    b.Property<int>("DiseaseId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("DoctorId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<int>("SymptomListId");

                    b.HasKey("DiseaseId");

                    b.HasIndex("DoctorId");

                    b.HasIndex("SymptomListId")
                        .IsUnique();

                    b.ToTable("Diseases");
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Doctor", b =>
                {
                    b.Property<int>("DoctorId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("DiseaseId");

                    b.Property<string>("FirstName")
                        .IsRequired();

                    b.Property<string>("SecondName")
                        .IsRequired();

                    b.Property<int>("SeparationId");

                    b.HasKey("DoctorId");

                    b.HasIndex("SeparationId");

                    b.ToTable("Doctors");
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Post", b =>
                {
                    b.Property<int>("PostId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Author")
                        .IsRequired();

                    b.Property<int>("CommentsCount");

                    b.Property<string>("Context")
                        .IsRequired();

                    b.Property<DateTime>("Date");

                    b.Property<string>("Header")
                        .IsRequired();

                    b.Property<string>("ImgUrl");

                    b.HasKey("PostId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Separation", b =>
                {
                    b.Property<int>("SeparationId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address")
                        .IsRequired();

                    b.Property<int>("DoctorId");

                    b.HasKey("SeparationId");

                    b.ToTable("Separations");
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Symptom", b =>
                {
                    b.Property<int>("SymptomId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<int?>("SymptomListId");

                    b.HasKey("SymptomId");

                    b.HasIndex("SymptomListId");

                    b.ToTable("Symptoms");
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.SymptomList", b =>
                {
                    b.Property<int>("SymptomListId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("Symptom10Id");

                    b.Property<int>("Symptom1Id");

                    b.Property<int>("Symptom2Id");

                    b.Property<int?>("Symptom3Id");

                    b.Property<int?>("Symptom4Id");

                    b.Property<int?>("Symptom5Id");

                    b.Property<int?>("Symptom6Id");

                    b.Property<int?>("Symptom7Id");

                    b.Property<int?>("Symptom8Id");

                    b.Property<int?>("Symptom9Id");

                    b.HasKey("SymptomListId");

                    b.ToTable("SymptomLists");
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Visitation", b =>
                {
                    b.Property<int>("VisitationId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date");

                    b.Property<int>("DiseaseId");

                    b.Property<int>("DoctorId");

                    b.Property<string>("FirstName")
                        .IsRequired();

                    b.Property<bool>("Male");

                    b.Property<string>("SecondName")
                        .IsRequired();

                    b.HasKey("VisitationId");

                    b.HasIndex("DoctorId");

                    b.ToTable("Visitations");
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Comment", b =>
                {
                    b.HasOne("MyMedicine.Context.Medicine.Post")
                        .WithMany("CommentsList")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Disease", b =>
                {
                    b.HasOne("MyMedicine.Context.Medicine.Doctor")
                        .WithMany("DiseaseList")
                        .HasForeignKey("DoctorId");

                    b.HasOne("MyMedicine.Context.Medicine.SymptomList", "Symptoms")
                        .WithOne("Disease")
                        .HasForeignKey("MyMedicine.Context.Medicine.Disease", "SymptomListId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Doctor", b =>
                {
                    b.HasOne("MyMedicine.Context.Medicine.Separation", "Separation")
                        .WithMany("DoctorList")
                        .HasForeignKey("SeparationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Symptom", b =>
                {
                    b.HasOne("MyMedicine.Context.Medicine.SymptomList")
                        .WithMany("Symptoms")
                        .HasForeignKey("SymptomListId");
                });

            modelBuilder.Entity("MyMedicine.Context.Medicine.Visitation", b =>
                {
                    b.HasOne("MyMedicine.Context.Medicine.Doctor", "Doctor")
                        .WithMany("VisitationList")
                        .HasForeignKey("DoctorId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
