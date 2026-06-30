import "./Admin.css";
import { useEffect, useState } from "react";
import API from "../services/api";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleUpdate = async (product) => {
    const newPrice = prompt("Enter new price for this product", product.price);
    if (!newPrice) return;

    try {
      await API.put(`/products/${product._id}`, {
        price: Number(newPrice),
      });
      const res = await API.get("/products");
      setProducts(res.data);
      alert("Product updated");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <span>ShopEZ</span>
          <small>(admin)</small>
        </div>
        <div className="admin-nav">
          <span>All Products</span>
        </div>
      </header>

      <div className="products-overview">
        {loading ? (
          <p className="loading-text">Loading products...</p>
        ) : (
          <div className="product-grid-full">
            {products.map((product) => (
              <div key={product._id} className="admin-product-card">
                <img src={product.image} alt={product.name} />
                <div className="admin-product-info">
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                  <p className="price">₹{product.price}</p>
                  <button className="card-btn" onClick={() => handleUpdate(product)}>
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProducts;
