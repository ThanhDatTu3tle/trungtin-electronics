namespace TrungTinElectronics.Models;

public class CartItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CreateOrderRequest
{
    public int UserID { get; set; }
    public string? Note { get; set; }
    public List<CartItemRequest> Items { get; set; } = new();
}

public class CreateOrderResponse
{
    public bool Success { get; set; }
    public int OrderID { get; set; }
    public decimal TotalAmount { get; set; }
    public string? ErrorMessage { get; set; }
}

public class OrderDetailResponse
{
    public int OrderID { get; set; }
    public string Status { get; set; } = "";
    public decimal TotalAmount { get; set; }
    public DateTime ExpiredAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDetail> Items { get; set; } = new();
}

public class OrderItemDetail
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = "";
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    public decimal Subtotal { get; set; }
}