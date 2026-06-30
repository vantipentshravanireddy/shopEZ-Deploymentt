import "./Admin.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [dashboard, setDashboard] = useState({});
  const [selectedView, setSelectedView] = useState("");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bannerUrl, setBannerUrl] = useState("");
  const [loadingView, setLoadingView] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
  });

  if (!user) {
    return <h1>Please log in to view the dashboard</h1>;
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setDashboard(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  const handleViewAll = async (type) => {
    if (type === "products") {
      navigate("/all-products");
      return;
    }

    if (type === "orders") {
      navigate("/orders");
      return;
    }

    setSelectedView(type);
    setLoadingView(true);

    try {
      if (type === "users") {
        if (users.length === 0) await fetchUsers();
        if (orders.length === 0) await fetchOrders();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingView(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name || "",
      price: product.price || "",
      image: product.image || "",
      description: product.description || "",
      category: product.category || "Electronics",
    });
  };

  const handleSaveProduct = async () => {
    try {
      await API.put(`/products/${editingProduct}`, editForm);
      alert("Product updated successfully!");
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      alert("Failed to update product");
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({
      name: "",
      price: "",
      image: "",
      description: "",
      category: "",
    });
  };

  const orderCounts = orders.reduce((acc, order) => {
    if (!order.userId) return acc;
    acc[order.userId] = (acc[order.userId] || 0) + 1;
    return acc;
  }, {});

  const handleBannerUpdate = (e) => {
    e.preventDefault();
    alert(`Banner updated to: ${bannerUrl}`);
    setBannerUrl("");
  };

  const stats = [
    {
      key: "users",
      label: "Total users",
      value: dashboard.totalUsers ?? 0,
    },
    {
      key: "products",
      label: "All Products",
      value: dashboard.totalProducts ?? 0,
    },
    {
      key: "orders",
      label: "All Orders",
      value: dashboard.totalOrders ?? 0,
    },
  ];

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <span>ShopEZ</span>
          <small>(admin)</small>
        </div>

        <nav className="admin-nav">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => handleViewAll("users")}>Users</button>
          <button onClick={() => handleViewAll("orders")}>Orders</button>
          <button onClick={() => handleViewAll("products")}>Products</button>
          <button onClick={() => navigate("/add-product")}>
  New Product
</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <section className="card-grid">
        {stats.map((item) => (
          <div key={item.key} className="admin-card">
            <p className="card-title">{item.label}</p>
            <span className="card-value">{item.value}</span>
            <button className="card-btn" onClick={() => handleViewAll(item.key)}>
              View all
            </button>
          </div>
        ))}

        <div className="admin-card add-card">
          <p className="card-title">Add Product</p>
          <span className="card-subtitle">(new)</span>
          <button
  className="card-btn"
  onClick={() => navigate("/add-product")}
>
  Add now
</button>
        </div>
      </section>

      

      {selectedView && (
        <section className="details-section">
          <div className="details-header">
            <h2>
              {selectedView === "users" && "Total users"}
              {selectedView === "products" && "All Products"}
              {selectedView === "orders" && "All Orders"}
            </h2>
            <button className="secondary-btn" onClick={() => setSelectedView("")}>Hide</button>
          </div>

          {loadingView ? (
            <p className="loading-text">Loading details...</p>
          ) : selectedView === "users" ? (
            users.length ? (
              <div className="users-table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User Id</th>
                      <th>User Name</th>
                      <th>Email Address</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem._id}>
                        <td>{userItem._id}</td>
                        <td>{userItem.username}</td>
                        <td>{userItem.email}</td>
                        <td>{orderCounts[userItem._id] ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No users available.</p>
            )
          ) : (
            <div className="details-grid">
              {selectedView === "products" &&
                (products.length ? (
                  products.map((product) => (
                    <div key={product._id} className="detail-card">
                      {editingProduct === product._id ? (
                        <div className="edit-form">
                          <input
                            type="text"
                            placeholder="Product Name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={editForm.image}
                            onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                          />
                          <textarea
                            placeholder="Description"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Category"
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          />
                          <div className="edit-actions">
                            <button className="save-btn" onClick={handleSaveProduct}>Save</button>
                            <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <img src={product.image} alt={product.name} className="product-thumb" />
                          <p className="detail-label">{product.name}</p>
                          <p>Price: ₹{product.price}</p>
                          <p>Category: {product.category || "Electronics"}</p>
                          <p>{product.description}</p>
                          <button className="edit-btn" onClick={() => handleEditProduct(product)}>Edit</button>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No products available.</p>
                ))}

              {selectedView === "orders" &&
                (orders.length ? (
                  orders.map((order) => (
                    <div key={order._id} className="detail-card">
                      <p className="detail-label">Order ID: {order._id}</p>
                      <p>Customer: {order.username || order.email}</p>
                      <p>Total: ₹{order.totalAmount}</p>
                      <p>Items: {order.products?.length ?? 0}</p>
                    </div>
                  ))
                ) : (
                  <p>No orders available.</p>
                ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Admin;
