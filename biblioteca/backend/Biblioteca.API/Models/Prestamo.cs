namespace Biblioteca.API.Models
{
    public class Prestamo
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int LibroId { get; set; }
        public DateTime FechaPrestamo { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public string Estado { get; set; } = "Activo"; // Activo, Vencido, Entregado
        
        // Relaciones
        public Usuario? Usuario { get; set; }
        public Libro? Libro { get; set; }
        public ICollection<Entrega> Entregas { get; set; } = new List<Entrega>();
    }
}
