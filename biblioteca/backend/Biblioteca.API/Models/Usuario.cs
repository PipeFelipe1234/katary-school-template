namespace Biblioteca.API.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public required string Identificacion { get; set; }
        public required string Nombres { get; set; }
        public required string Email { get; set; }
        public required string Telefono { get; set; }
        
        // Relaciones
        public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
    }
}
