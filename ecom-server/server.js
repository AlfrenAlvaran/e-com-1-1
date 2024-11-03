require("dotenv").config(); // Add this to use environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer"); // Import multer
const path = require("path"); // Import path module
const { log } = require("console");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  },
});

const upload = multer({ storage: storage });

// MongoDB connection URI
// const uri =
//   "mongodb+srv://johnruzell123:ruzellrivera03@mernapp.r3ftv8a.mongodb.net/?retryWrites=true&w=majority&appName=mernapp";
// const uri = "mongodb+srv://alfren667:chen050221@cluster0.t69rl.mongodb.net/";
const uri = 'mongodb+srv://alfren667:chen050221@cluster0.t69rl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// User model
const User = mongoose.model(
  "User ",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    userType: String, // Added userType to your model
  })
);

// Product model
const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    title: String,
    description: String,
    file: String, // You may want to store the file path or URL
    sellerName: String,
    createdAt: { type: Date, default: Date.now },
    comments: [
      {
        // Added comments field to store comments
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    messages: [
      {
        // Added messages field to store messages
        sender: String, // Buyer or Seller
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reviews: [
      {
        text: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  })
);

// Registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, userType } = req.body;

    console, log(req.body);
    // Input validation
    if (!firstname || !lastname || !email || !password || !userType) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User  already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      userType,
    });

    await user.save();
    res.status(201).send({ message: "User  registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error registering user" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET
    );
    res.send({ token, userType: user.userType });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error logging in" });
  }
});
app.use("/uploads", express.static("uploads"));
// Create a new product
app.post("/api/products", async (req, res) => {
  try {
    const { title, description, file, sellerName } = req.body;
    // const imgFile = req.file?.fieldname;

    // Input validation
    if (!title || !description || !file || !sellerName) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const product = new Product({
      title,
      description,
      file,
      sellerName,
    });

    await product.save();
    res.status(201).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error creating product" });
  }
});


app.post('/api/delete', async (req, res) => {
  const { _id } = req.body
  console.log(req.body)
  const response = await Product.findByIdAndDelete(_id)

  if(response) {
    res.status(200).json({ error: false, message: 'Product removed.' });
  }
  
})
// Upload file endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    res.send({ filename: req.file.filename });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error uploading file" });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving products" });
  }
});

// Search for products
app.get("/api/products/search", async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from the query parameters
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error searching for products" });
  }
});

// Submit a comment
app.post("/api/comments/:productId", async (req, res) => {
  try {
    const { text } = req.body;
    const productId = req.params.productId;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .send({ message: "Failed to authenticate token" });
      }

      req.user = decoded;
    });
    console.log(text);

    if (!text) {
      return res.status(400).send({ message: "Comment text is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    product.comments.push({ text });
    await product.save();
    res.status(201).send({ message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error adding comment" });
  }
});


app.get("/api/comments/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send(product.comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving comments" });
  }
});

// Send a message
app.post("/api/messages/:productId", async (req, res) => {
  try {
    const { text } = req.body;
    const productId = req.params.productId;
    console.log(req.params.productId);
    console.log(req.body);

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .send({ message: "Failed to authenticate token" });
      }

      req.user = decoded;
    });
    // Input validation
    if (!text) {
      return res.status(400).send({ message: "Message text is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    product.messages.push({ text, sender: req.user.userType });
    await product.save();
    res.status(201).send({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error sending message" });
  }
});

// Get messages for a product
app.get("/api/messages/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send(product.messages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving messages" });
  }
});

// Test endpoint
app.get("/api/test", (req, res) => {
  try {
    res.json({ message: "testing" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error on test endpoint" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/api/logout", async (req, res) => {
  try {
    // Invalidate the token or perform any other necessary actions
    res.send({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error logging out" });
  }
});

// Payment Security Endpoint
app.get("/api/payment-security", async (req, res) => {
  try {
    const paymentMethods = [
      "GCash",
      "PayMaya",
      "Credit Card",
      "Cash on Delivery",
    ];
    res.send(paymentMethods);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving payment methods" });
  }
});

// Process payment endpoint
app.post("/api/process-payment", async (req, res) => {
  try {
    const { paymentMethod, amount } = req.body;

    // Input validation
    if (!paymentMethod || !amount) {
      return res
        .status(400)
        .send({ message: "Payment method and amount are required" });
    }
    return res.status(200).json({
      message: "Payment processed successfully",
      paymentMethod,
      amount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error processing payment" });
  }
});

// Shipping methods endpoint
app.get("/api/shipping-methods", async (req, res) => {
  try {
    const shippingMethods = [
      { id: "jt", name: "J&T", cost: 50 },
      { id: "flash", name: "Flash Express", cost: 70 },
    ];
    res.send(shippingMethods);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving shipping methods" });
  }
});

// Submit a review
app.post("/api/reviews/:productId", async (req, res) => {
  try {
    const { text, rating } = req.body;
    const productId = req.params.productId;

    // Input validation
    if (!text || !rating) {
      return res
        .status(400)
        .send({ message: "Review text and rating are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    product.reviews.push({ text, rating });
    await product.save();
    res.status(201).send({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error adding review" });
  }
});

// Get reviews for a product
app.get("/api/reviews/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send(product.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error retrieving reviews" });
  }
});
