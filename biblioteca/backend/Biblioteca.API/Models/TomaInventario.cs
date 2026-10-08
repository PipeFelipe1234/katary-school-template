namespace Biblioteca.API.Models
{
    public class TomaInventario
    {
        public int Id { get; set; }
        public int LibroId { get; set; }
        public DateTime Fecha { get; set; }
        public int CantidadFisica { get; set; }
        public int CantidadSistema { get; set; }
        public int Diferencia { get; set; }
        public string Notas { get; set; } = string.Empty;
        
        // Relaciones
        public Libro? Libro { get; set; }
    }
}
