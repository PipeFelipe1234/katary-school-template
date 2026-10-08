using Microsoft.EntityFrameworkCore;
using Biblioteca.API.Models;

namespace Biblioteca.API.Data
{
    public class BibliotecaDbContext : DbContext
    {
        public BibliotecaDbContext(DbContextOptions<BibliotecaDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Libro> Libros { get; set; }
        public DbSet<Prestamo> Prestamos { get; set; }
        public DbSet<Entrega> Entregas { get; set; }
        public DbSet<TomaInventario> TomaInventarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar relaciones
            modelBuilder.Entity<Prestamo>()
                .HasOne(p => p.Usuario)
                .WithMany(u => u.Prestamos)
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Prestamo>()
                .HasOne(p => p.Libro)
                .WithMany(l => l.Prestamos)
                .HasForeignKey(p => p.LibroId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Entrega>()
                .HasOne(e => e.Prestamo)
                .WithMany(p => p.Entregas)
                .HasForeignKey(e => e.PrestamoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TomaInventario>()
                .HasOne(ti => ti.Libro)
                .WithMany()
                .HasForeignKey(ti => ti.LibroId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
