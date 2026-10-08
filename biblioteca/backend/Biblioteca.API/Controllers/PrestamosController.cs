using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Biblioteca.API.Data;
using Biblioteca.API.Models;

namespace Biblioteca.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrestamosController : ControllerBase
    {
        private readonly BibliotecaDbContext _context;

        public PrestamosController(BibliotecaDbContext context)
        {
            _context = context;
        }

        // GET: api/prestamos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Prestamo>>> GetPrestamos()
        {
            return await _context.Prestamos
                .Include(p => p.Usuario)
                .Include(p => p.Libro)
                .ToListAsync();
        }

        // GET: api/prestamos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Prestamo>> GetPrestamo(int id)
        {
            var prestamo = await _context.Prestamos
                .Include(p => p.Usuario)
                .Include(p => p.Libro)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (prestamo == null)
            {
                return NotFound();
            }

            return prestamo;
        }

        // POST: api/prestamos
        [HttpPost]
        public async Task<ActionResult<Prestamo>> PostPrestamo(Prestamo prestamo)
        {
            if (!await _context.Usuarios.AnyAsync(u => u.Id == prestamo.UsuarioId))
            {
                return BadRequest("El usuario no existe");
            }

            var libro = await _context.Libros.FindAsync(prestamo.LibroId);
            if (libro == null)
            {
                return BadRequest("El libro no existe");
            }
            if (libro.Cantidad <= 0)
            {
                return BadRequest($"No hay ejemplares disponibles de \"{libro.Titulo}\"");
            }

            prestamo.Id = 0;
            prestamo.Usuario = null;
            prestamo.Libro = null;
            prestamo.Entregas = new List<Entrega>();
            prestamo.Estado = "Activo";
            if (prestamo.FechaPrestamo == default) prestamo.FechaPrestamo = DateTime.Now;
            if (prestamo.FechaVencimiento == default) prestamo.FechaVencimiento = prestamo.FechaPrestamo.AddDays(14);

            libro.Cantidad--;
            _context.Prestamos.Add(prestamo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPrestamo", new { id = prestamo.Id }, prestamo);
        }

        // PUT: api/prestamos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrestamo(int id, Prestamo prestamo)
        {
            if (id != prestamo.Id)
            {
                return BadRequest("El id no coincide");
            }

            var existente = await _context.Prestamos.FindAsync(id);
            if (existente == null)
            {
                return NotFound();
            }

            if (!await _context.Usuarios.AnyAsync(u => u.Id == prestamo.UsuarioId))
            {
                return BadRequest("El usuario no existe");
            }

            if (existente.LibroId != prestamo.LibroId)
            {
                var nuevoLibro = await _context.Libros.FindAsync(prestamo.LibroId);
                if (nuevoLibro == null)
                {
                    return BadRequest("El libro no existe");
                }

                if (existente.Estado != "Entregado")
                {
                    if (nuevoLibro.Cantidad <= 0)
                    {
                        return BadRequest($"No hay ejemplares disponibles de \"{nuevoLibro.Titulo}\"");
                    }
                    nuevoLibro.Cantidad--;
                    var libroAnterior = await _context.Libros.FindAsync(existente.LibroId);
                    if (libroAnterior != null) libroAnterior.Cantidad++;
                }
                existente.LibroId = prestamo.LibroId;
            }

            existente.UsuarioId = prestamo.UsuarioId;
            if (prestamo.FechaPrestamo != default) existente.FechaPrestamo = prestamo.FechaPrestamo;
            if (prestamo.FechaVencimiento != default) existente.FechaVencimiento = prestamo.FechaVencimiento;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/prestamos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrestamo(int id)
        {
            var prestamo = await _context.Prestamos.FindAsync(id);
            if (prestamo == null)
            {
                return NotFound();
            }

            if (prestamo.Estado != "Entregado")
            {
                var libro = await _context.Libros.FindAsync(prestamo.LibroId);
                if (libro != null) libro.Cantidad++;
            }

            _context.Prestamos.Remove(prestamo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
