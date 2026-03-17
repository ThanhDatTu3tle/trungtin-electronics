using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrungTinElectronicsAPI.Models.DTOs;

namespace TrungTinElectronicsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventRepository _eventRepository;

        public EventsController(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        // POST: api/Events/GetAllEvents
        [AllowAnonymous]
        [HttpPost("GetAllEvents")]
        public async Task<IActionResult> GetAllEvents([FromQuery] bool? isActive)
        {
            try
            {
                var events = await _eventRepository.GetAllEventsAsync(isActive);
                return Ok(new { message = "success", result = 200, data = events });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(message: "Lỗi: " + ex.Message, result: 500));
            }
        }

        // POST: api/Events/GetActiveEvents
        [AllowAnonymous]
        [HttpPost("GetActiveEvents")]
        public async Task<IActionResult> GetActiveEvents()
        {
            try
            {
                var events = await _eventRepository.GetActiveEventsAsync();
                return Ok(new { message = "success", result = 200, data = events });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(message: "Lỗi: " + ex.Message, result: 500));
            }
        }

        // POST: api/Events/CreateEvent
        [Authorize(Roles = "admin")]
        [HttpPost("CreateEvent")]
        public async Task<IActionResult> CreateEvent(
            [FromQuery] string name,
            [FromQuery] string? description,
            [FromQuery] decimal discountPercent,
            [FromQuery] string? colorTheme,
            [FromQuery] string? bannerUrl,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate,
            [FromQuery] bool isActive = true)
        {
            try
            {
                var newEventId = await _eventRepository.CreateEventAsync(
                    name, description, discountPercent, colorTheme, bannerUrl, startDate, endDate, isActive);
                return Ok(new { message = "Event created successfully!", result = 200, eventId = newEventId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(message: "Lỗi: " + ex.Message, result: 500));
            }
        }

        // POST: api/Events/UpdateEvent
        [Authorize(Roles = "admin")]
        [HttpPost("UpdateEvent")]
        public async Task<IActionResult> UpdateEvent(
            [FromQuery] int eventId,
            [FromQuery] string? name,
            [FromQuery] string? description,
            [FromQuery] decimal? discountPercent,
            [FromQuery] string? colorTheme,
            [FromQuery] string? bannerUrl,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] bool? isActive,
            [FromQuery] string action = "update")
        {
            try
            {
                var message = await _eventRepository.UpdateEventAsync(
                    eventId, name, description, discountPercent, colorTheme,
                    bannerUrl, startDate, endDate, isActive, action);
                return Ok(new { message, result = 200 });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(message: "Lỗi: " + ex.Message, result: 500));
            }
        }

        // POST: api/Events/AssignProductToEvent
        [Authorize(Roles = "admin")]
        [HttpPost("AssignProductToEvent")]
        public async Task<IActionResult> AssignProductToEvent(
            [FromQuery] int productId,
            [FromQuery] int? eventId)
        {
            try
            {
                var message = await _eventRepository.AssignProductToEventAsync(productId, eventId);
                return Ok(new { message, result = 200 });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(message: "Lỗi: " + ex.Message, result: 500));
            }
        }
    }
}
