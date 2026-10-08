namespace Biblioteca.API.Models
{
    public class Entrega
    {
        public int Id { get; set; }
        public int PrestamoId { get; set; }
        public DateTime FechaEntrega { get; set; }
        public string Estado { get; set; } = "Entregado";
        
        // Relaciones
        public Prestamo? Prestamo { get; set; }
    }
}
