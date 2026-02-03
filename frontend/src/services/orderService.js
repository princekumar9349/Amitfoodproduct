import api from "./api";

const orderService = {
  createOrder: async (orderData) => {
    // orderData: { items, totalAmount, shippingAddress }
    const response = await api.post("/api/payment/create-order", orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get("/api/orders/myorders");
    return response.data;
  },
};

export default orderService;
