import "./Home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);

  const isAdmin = user?.user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user === null) return;

    if (isAdmin) {
      fetchDashboard();
    } else {
      fetchProducts();
    }
  }, [isAdmin, user]);

  useEffect(() => {
    const lower = searchTerm.trim().toLowerCase();
    if (!lower) {
      setFilteredProducts(products);
      return;
    }

    setFilteredProducts(
      products.filter((product) =>
        product.name?.toLowerCase().includes(lower) ||
        product.category?.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, products]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await API.get("/dashboard");
      setDashboard(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
      setFilteredProducts(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingProductId(product._id);
    try {
      await API.post("/cart", {
        userId: user.user._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
      });
      alert(`${product.name} added to cart`);
    } catch (error) {
      console.log(error);
      alert("Unable to add item to cart");
    } finally {
      setAddingProductId(null);
    }
  };

  return isAdmin ? (
    <div className="admin-home-page">
      <div className="home-hero-card">
        <h1>Admin Dashboard</h1>
        <p>Only admin users can see and manage these sections.</p>
      </div>

      <section className="admin-card-grid">
        <div className="admin-card">
          <p className="admin-card-title">All Users</p>
          <span className="admin-card-value">{dashboard.totalUsers}</span>
          <button className="admin-card-btn" onClick={() => navigate("/admin")}>View Users</button>
        </div>

        <div className="admin-card">
          <p className="admin-card-title">All Products</p>
          <span className="admin-card-value">{dashboard.totalProducts}</span>
          <button className="admin-card-btn" onClick={() => navigate("/all-products")}>View Products</button>
        </div>

        <div className="admin-card">
          <p className="admin-card-title">All Orders</p>
          <span className="admin-card-value">{dashboard.totalOrders}</span>
          <button className="admin-card-btn" onClick={() => navigate("/orders")}>View Orders</button>
        </div>
      </section>

      {loading && <p className="home-loading">Loading dashboard totals...</p>}
    </div>
  ) : (
    <div className="home-hero">
      <div className="home-header-bar">
        <input
          type="text"
          className="home-search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-container">
        {loading ? (
          <p className="home-loading">Loading products...</p>
        ) : filteredProducts.length ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <button
                onClick={() => addToCart(product)}
                disabled={addingProductId === product._id}
              >
                {addingProductId === product._id ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))
        ) : (
          <p className="home-loading">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
