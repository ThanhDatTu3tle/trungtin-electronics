using System.Data;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using TrungTinElectronics.Models;

namespace TrungTinElectronics.Repositories;

public class OrderRepository
{
    private readonly string _connectionString;

    public OrderRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<(int OrderID, string? ErrorMessage)> CreateOrderAsync(
        int userId, string? note, List<CartItemRequest> items)
    {
        var itemsJson = JsonSerializer.Serialize(
            items.Select(i => new { i.ProductId, i.Quantity })
        );

        await using var conn = new SqlConnection(_connectionString);
        await using var cmd = new SqlCommand("sp_CreateOrder", conn)
        {
            CommandType = CommandType.StoredProcedure
        };

        cmd.Parameters.AddWithValue("@UserID", userId);
        cmd.Parameters.AddWithValue("@Note", (object?)note ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Items", itemsJson);

        var orderIdParam = new SqlParameter("@OrderID", SqlDbType.Int)
        { Direction = ParameterDirection.Output };
        var errorParam = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 500)
        { Direction = ParameterDirection.Output };

        cmd.Parameters.Add(orderIdParam);
        cmd.Parameters.Add(errorParam);

        await conn.OpenAsync();
        await cmd.ExecuteNonQueryAsync();

        return (
            (int)orderIdParam.Value,
            errorParam.Value as string
        );
    }

    public async Task<OrderDetailResponse?> GetOrderDetailAsync(int orderId)
    {
        const string sql = """
            SELECT
                o.OrderID,
                o.Status,
                o.TotalAmount,
                o.ExpiredAt,
                o.CreatedAt,
                oi.ProductId,
                p.ProductName,
                oi.Quantity,
                oi.UnitPrice,
                oi.DiscountPrice,
                oi.Subtotal
            FROM dbo.Orders o
            INNER JOIN dbo.Order_Items oi ON o.OrderID    = oi.OrderID
            INNER JOIN dbo.Product     p  ON oi.ProductId = p.ProductId
            WHERE o.OrderID = @OrderID
            """;

        await using var conn = new SqlConnection(_connectionString);
        await using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@OrderID", orderId);

        await conn.OpenAsync();
        await using var reader = await cmd.ExecuteReaderAsync();

        OrderDetailResponse? order = null;

        while (await reader.ReadAsync())
        {
            order ??= new OrderDetailResponse
            {
                OrderID = reader.GetInt32(0),
                Status = reader.GetString(1),
                TotalAmount = reader.GetDecimal(2),
                ExpiredAt = reader.GetDateTime(3),
                CreatedAt = reader.GetDateTime(4),
            };

            order.Items.Add(new OrderItemDetail
            {
                ProductId = reader.GetInt32(5),
                ProductName = reader.GetString(6),
                Quantity = reader.GetInt32(7),
                UnitPrice = reader.GetDecimal(8),
                DiscountPrice = reader.IsDBNull(9) ? null : reader.GetDecimal(9),
                Subtotal = reader.GetDecimal(10),
            });
        }

        return order;
    }
}