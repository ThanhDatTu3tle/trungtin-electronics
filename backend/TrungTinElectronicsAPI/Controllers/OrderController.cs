using Microsoft.AspNetCore.Mvc;
using TrungTinElectronics.Models;
using TrungTinElectronics.Services;
using TrungTinElectronics.Repositories;

namespace TrungTinElectronics.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;
    private readonly OrderRepository _orderRepo;

    public OrderController(OrderService orderService, OrderRepository orderRepo)
    {
        _orderService = orderService;
        _orderRepo = orderRepo;
    }

    // POST /api/order/create
    [HttpPost("create")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var result = await _orderService.CreateOrderAsync(request);

        if (!result.Success)
            return BadRequest(new { result.ErrorMessage });

        return Ok(result);
    }

    // GET /api/order/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrderDetail(int id)
    {
        var order = await _orderRepo.GetOrderDetailAsync(id);

        if (order is null)
            return NotFound(new { ErrorMessage = "Không tìm thấy đơn hàng" });

        return Ok(order);
    }
}