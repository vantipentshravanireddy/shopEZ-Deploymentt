import "./Cart.css";
import { useEffect, useState } from "react";
import API from "../services/api";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const [showCheckout, setShowCheckout] =
    useState(false);

  const [address, setAddress] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash On Delivery");

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await API.get(
        `/cart/${user.user._id}`
      );

      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await API.delete(`/cart/${id}`);

      alert("Item Removed");

      setCartItems(
        cartItems.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      console.log(`Updating cart item ${id} to quantity ${newQuantity}`);
      
      const response = await API.put(`/cart/${id}`, {
        quantity: newQuantity,
      });

      console.log("Update successful:", response.data);

      setCartItems(
        cartItems.map((item) =>
          item._id === id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.log("Update error details:", error.response?.data || error.message);
      alert("Failed to update quantity: " + (error.response?.data?.message || error.message));
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await API.post("/orders", {
        userId: user.user._id,
        username: user.user.username,
        email: user.user.email,

        mobile,
        address,
        pincode,
        paymentMethod,
      });

      alert(res.data.message);

      setShowCheckout(false);

      fetchCartItems();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          error.message
      );
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">My Cart</h1>

      <div className="cart-summary">
        <h3>Items: {cartItems.length}</h3>

        <h2>Total Price: ₹{totalPrice}</h2>

        <button
          className="place-order-btn"
          onClick={() =>
            setShowCheckout(true)
          }
        >
          Proceed To Checkout
        </button>
      </div>

      {cartItems.map((item) => (
        <div
          key={item._id}
          className="cart-card"
        >
          <h3>{item.productName}</h3>

          <p>₹{item.price}</p>

          <div className="quantity-container">
            <p>Quantity:</p>
            <button
              className="qty-btn"
              onClick={() =>
                updateQuantity(
                  item._id,
                  item.quantity - 1
                )
              }
            >
              -
            </button>
            <span className="qty-display">
              {item.quantity}
            </span>
            <button
              className="qty-btn"
              onClick={() =>
                updateQuantity(
                  item._id,
                  item.quantity + 1
                )
              }
            >
              +
            </button>
          </div>

          <p className="item-total">
            Subtotal: ₹{item.price * item.quantity}
          </p>

          <button
            className="remove-btn"
            onClick={() =>
              removeFromCart(item._id)
            }
          >
            Remove
          </button>

          <hr />
        </div>
      ))}

      {showCheckout && (
        <div className="checkout-popup">
          <div className="checkout-box">
            <h2>Checkout Details</h2>

            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value
                )
              }
            />

            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) =>
                setPincode(
                  e.target.value
                )
              }
            />

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            >
              <option>
                Cash On Delivery
              </option>

              <option>
                UPI
              </option>

              <option>
                Net Banking
              </option>
            </select>

            <button
              onClick={placeOrder}
            >
              Confirm Order
            </button>

            <button
              onClick={() =>
                setShowCheckout(false)
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;