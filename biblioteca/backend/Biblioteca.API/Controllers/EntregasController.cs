using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Biblioteca.API.Data;
using Biblioteca.API.Models;

namespace Biblioteca.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EntregasController : ControllerBase
    {
        private readonly BibliotecaDbContext _context;

        public EntregasController(BibliotecaDbContext context)
        {
            _context = context;
        }

        // GET: api/entregas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entrega>>> GetEntregas()
        {
            return await _context.Entregas
                .Include(e => e.Prestamo)
                    .ThenInclude(p => p!.Usuario)
                .Include(e => e.Prestamo)
                    .ThenInclude(p => p!.Libro)
                .ToListAsync();
        }

        // GET: api/entregas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Entrega>> GetEntrega(int id)
        {
            var entrega = await _context.Entregas
                .Include(e => e.Prestamo)
                    .ThenInclude(p => p!.Usuario)
                .Include(e => e.Prestamo)
                    .ThenInclude(p => p!.Libro)
                .FirstOrDefaultAsync(e => e.Id == id);
            
            if (entrega == null)
            {
                return NotFound();
            }

            return entrega;
        }

        // POST: api/entregas
        [HttpPost]
        public async Task<ActionResult<Entrega>> PostEntrega(Entrega entrega)
        {
            var prestamo = await _context.Prestamos.FindAsync(entrega.PrestamoId);
            if (prestamo == null)
            {
                return BadRequest("El préstamo no existe");
            }
            if (prestamo.Estado == "Entregado")
            {
                return BadRequest("Este préstamo ya fue entregado");
            }

            entrega.Id = 0;
            entrega.Prestamo = null;
            if (entrega.FechaEntrega == default) entrega.FechaEntrega = DateTime.Now;
            if (string.IsNullOrWhiteSpace(entrega.Estado)) entrega.Estado = "Buen Estado";

            prestamo.Estado = "Entregado";
            var libro = await _context.Libros.FindAsync(prestamo.LibroId);
            if (libro != null) libro.Cantidad++;

            _context.Entregas.Add(entrega);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEntrega", new { id = entrega.Id }, entrega);
        }

        // PUT: api/entregas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEntrega(int id, Entrega entrega)
        {
            if (id != entrega.Id)
            {
                return BadRequest("El id no coincide");
            }

            var existente = await _context.Entregas.FindAsync(id);
            if (existente == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(entrega.Estado)) existente.Estado = entrega.Estado;
            if (entrega.FechaEntrega != default) existente.FechaEntrega = entrega.FechaEntrega;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/entregas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntrega(int id)
        {
            var entrega = await _context.Entregas.FindAsync(id);
            if (entrega == null)
            {
                return NotFound();
            }

            var prestamo = await _context.Prestamos.FindAsync(entrega.PrestamoId);
            if (prestamo != null && prestamo.Estado == "Entregado")
            {
                prestamo.Estado = "Activo";
                var libro = await _context.Libros.FindAsync(prestamo.LibroId);
                if (libro != null && libro.Cantidad > 0) libro.Cantidad--;
            }

            _context.Entregas.Remove(entrega);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
