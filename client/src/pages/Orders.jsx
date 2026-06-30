import "./Orders.css";
import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.user?.role?.toLowerCase() === "admin";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let res;
      if (isAdmin) {
        res = await API.get("/orders");
      } else {
        res = await API.get(`/orders/${user.user._id}`);
      }
      setOrders(res.data);
      const initialStatuses = {};
      res.data.forEach((order) => {
        initialStatuses[order._id] = order.status || "order placed";
      });
      setStatuses(initialStatuses);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = (orderId, value) => {
    setStatuses((prev) => ({ ...prev, [orderId]: value }));
  };

  const updateOrderStatus = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}`, {
        status: statuses[orderId],
      });
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Unable to update status.");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await API.delete(`/orders/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Unable to cancel order.");
    }
  };

  const statusOptions = ["Pending", "order placed", "in transit", "delivered"];

  return (
    <div className="orders-container">
      <h1 className="orders-title">{isAdmin ? "All Orders" : "My Orders"}</h1>

      {loading ? (
        <p className="orders-loading">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="orders-empty">No orders available.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const products = order.products || [];
            const mainProduct = products[0] || {};
            const imageSrc =
              mainProduct.image || order.image || "https://via.placeholder.com/190x220?text=Product";
            const productCount = products.length;
            const thumbProducts = products.filter((product) => product.image);
            const currentStatus = statuses[order._id] || order.status || "Pending";
            return (
              <div className="order-card" key={order._id}>
                <div className="order-card-main">
                  <div className="order-card-thumb">
                    <img
                      src={imageSrc}
                      alt={mainProduct.name || mainProduct.productName || "Order product"}
                    />
                  </div>
                  <div className="order-card-info">
                    <h2>
                      {mainProduct.name || mainProduct.productName || `Order #${order._id.slice(-6)}`}
                    </h2>
                    <p className="order-description">
                      {mainProduct.description || order.description || `${productCount} product${productCount !== 1 ? "s" : ""} in this order`}
                    </p>
                    {thumbProducts.length > 1 && (
                      <div className="order-product-thumbs">
                        {thumbProducts.map((product, index) => (
                          <img
                            key={index}
                            src={product.image}
                            alt={product.name || product.productName || `Item ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                    <p className="order-product-title">
                      <strong>Items ({productCount}):</strong>
                    </p>
                    <div className="order-product-list">
                      {products.map((product, index) => (
                        <div key={index} className="order-product-item">
                          <span>{product.productName || product.name || `Item ${index + 1}`}</span>
                          <span>Qty: {product.quantity ?? 1}</span>
                          <span>₹{product.price ?? 0}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-meta-row">
                      <span><strong>Total:</strong> ₹{order.totalAmount ?? 0}</span>
                      <span><strong>Payment:</strong> {order.paymentMethod || order.payment_method || "-"}</span>
                    </div>
                    <div className="order-meta-row order-user-row">
                      <span><strong>UserId:</strong> {order.userId || order.user_id || "-"}</span>
                      <span><strong>Name:</strong> {order.username || order.name || "-"}</span>
                      <span><strong>Email:</strong> {order.email || "-"}</span>
                      <span><strong>Mobile:</strong> {order.mobile || order.phone || "-"}</span>
                    </div>
                    <div className="order-meta-row order-user-row">
                      <span><strong>Ordered on:</strong> {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString()}</span>
                      <span><strong>Address:</strong> {order.address || order.shippingAddress || "-"}</span>
                      <span><strong>Pincode:</strong> {order.pincode || order.pin || "-"}</span>
                    </div>
                    <p className="order-status"><strong>Order status:</strong> {order.status || "Pending"}</p>
                    {isAdmin && (
                      <div className="order-actions">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <button className="order-btn update-btn" onClick={() => updateOrderStatus(order._id)}>
                          Update
                        </button>
                        <button className="order-btn cancel-btn" onClick={() => cancelOrder(order._id)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
