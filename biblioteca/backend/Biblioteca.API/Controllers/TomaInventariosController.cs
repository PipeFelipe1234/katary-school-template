using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Biblioteca.API.Data;
using Biblioteca.API.Models;

namespace Biblioteca.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TomaInventariosController : ControllerBase
    {
        private readonly BibliotecaDbContext _context;

        public TomaInventariosController(BibliotecaDbContext context)
        {
            _context = context;
        }

        // GET: api/tomainventarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TomaInventario>>> GetTomaInventarios()
        {
            return await _context.TomaInventarios
                .Include(ti => ti.Libro)
                .ToListAsync();
        }

        // GET: api/tomainventarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TomaInventario>> GetTomaInventario(int id)
        {
            var tomaInventario = await _context.TomaInventarios
                .Include(ti => ti.Libro)
                .FirstOrDefaultAsync(ti => ti.Id == id);
            
            if (tomaInventario == null)
            {
                return NotFound();
            }

            return tomaInventario;
        }

        // POST: api/tomainventarios
        [HttpPost]
        public async Task<ActionResult<TomaInventario>> PostTomaInventario(TomaInventario tomaInventario)
        {
            if (tomaInventario.CantidadFisica < 0)
            {
                return BadRequest("La cantidad física no puede ser negativa");
            }

            var libro = await _context.Libros.FindAsync(tomaInventario.LibroId);
            if (libro == null)
            {
                return BadRequest("El libro no existe");
            }

            tomaInventario.Id = 0;
            tomaInventario.Libro = null;
            tomaInventario.Fecha = tomaInventario.Fecha == default ? DateTime.Now : tomaInventario.Fecha;
            tomaInventario.CantidadSistema = libro.Cantidad;
            tomaInventario.Diferencia = tomaInventario.CantidadFisica - libro.Cantidad;

            libro.Cantidad = tomaInventario.CantidadFisica;
            _context.TomaInventarios.Add(tomaInventario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTomaInventario", new { id = tomaInventario.Id }, tomaInventario);
        }

        // PUT: api/tomainventarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTomaInventario(int id, TomaInventario tomaInventario)
        {
            if (id != tomaInventario.Id)
            {
                return BadRequest("El id no coincide");
            }
            if (tomaInventario.CantidadFisica < 0)
            {
                return BadRequest("La cantidad física no puede ser negativa");
            }

            var existente = await _context.TomaInventarios.FindAsync(id);
            if (existente == null)
            {
                return NotFound();
            }

            var libro = await _context.Libros.FindAsync(existente.LibroId);
            if (libro == null)
            {
                return BadRequest("El libro no existe");
            }

            existente.CantidadSistema = libro.Cantidad;
            existente.CantidadFisica = tomaInventario.CantidadFisica;
            existente.Diferencia = existente.CantidadFisica - existente.CantidadSistema;
            existente.Notas = tomaInventario.Notas ?? string.Empty;
            existente.Fecha = DateTime.Now;

            libro.Cantidad = existente.CantidadFisica;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tomainventarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTomaInventario(int id)
        {
            var tomaInventario = await _context.TomaInventarios.FindAsync(id);
            if (tomaInventario == null)
            {
                return NotFound();
            }

            _context.TomaInventarios.Remove(tomaInventario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
