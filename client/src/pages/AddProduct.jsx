import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
  });
  const handleAddProduct = async () => {
  try {
    await API.post("/products", product);

    alert("Product added successfully!");
    setProduct({
  name: "",
  price: "",
  image: "",
  description: "",
  category: "",
});

    navigate("/");
  } catch (error) {
    console.log(error);
    alert("Failed to add product");
  }
};

  return (
    <div style={{ padding: "30px" }}>
      <h1>Add Product</h1>

      <input
        type="text"
        placeholder="Product Name"
        value={product.name}
        onChange={(e) =>
          setProduct({ ...product, name: e.target.value })
        }
      />
      <br /><br />

      <input
        type="number"
        placeholder="Price"
        value={product.price}
        onChange={(e) =>
          setProduct({ ...product, price: e.target.value })
        }
      />
      <button onClick={handleAddProduct}>
  Add Product
</button>
      <br /><br />

      <button onClick={() => navigate("/admin")}>
        Back
      </button>
    </div>
  );
}

export default AddProduct;