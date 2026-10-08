namespace Biblioteca.API.Models
{
    public class Libro
    {
        public int Id { get; set; }
        public required string Titulo { get; set; }
        public required string Autor { get; set; }
        public required string Genero { get; set; }
        public int Cantidad { get; set; }
        
        // Relaciones
        public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
    }
}
