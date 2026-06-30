const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
  .connect("mongodb://127.0.0.1:27017/shopez")
  .then(async () => {
    console.log("MongoDB Connected");

    await Product.insertMany([
      // Smartphones
     
      {
        name: "Google Pixel 9",
        price: 79999,
        image: "/images/google9.jpg",
        description: "Google flagship smartphone with best camera",
        category: "Smartphones",
      },
      {
        name: "Realme GT",
        price: 34999,
        image: "/images/realmegt.jpg",
        description: "Gaming smartphone with high refresh rate",
        category: "Smartphones",
      },
      {
        name: "Redmi Note 14",
        price: 24999,
        image: "/images/redmi14.jpg",
        description: "Budget smartphone with great features",
        category: "Smartphones",
      },
      {
        name: "iPhone 15 Pro",
        price: 99999,
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600",
        description: "Latest Apple smartphone with A17 chip",
        category: "Smartphones",
      },
      // Laptops
     
      {
        name: "Dell XPS 13",
        price: 109999,
        image: "/images/dellxps13.jpg",
        description: "Premium Dell ultrabook laptop",
        category: "Laptops",
      },
      
      // Tablets
      
      // Audio
      {
        name: "Sony WH-1000XM5",
        price: 29999,
        image: "/images/SonyWH-1000XM5.jpg",
        description: "Premium noise cancelling headphones",
        category: "Audio",
      },
      {
        name: "Boat Airdopes",
        price: 1499,
        image: "/images/BoatAirdopes.jpg",
        description: "Affordable wireless earbuds",
        category: "Audio",
      },
     
      // Wearables
      {
        name: "Apple Watch",
        price: 39999,
        image: "/images/AppleWatch.jpg",
        description: "Smart watch with health tracking",
        category: "Wearables",
      },
      
    ]);

    console.log("Products Added Successfully!");
    process.exit();
  })
  .catch((err) => console.log(err));