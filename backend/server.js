require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Thư viện CORS
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

// 1. Cấu hình CORS CHÍNH XÁC và DUY NHẤT
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const corsConfig = {
    origin: allowedOrigin,
    optionsSuccessStatus: 200,
    credentials: true,
};

// Trong file server.js, ngay sau require("dotenv").config();

// 🛑 SỬA LỖI: Cập nhật tên biến để khớp với JWT_ACCESS_SECRET trong .env
if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("🚨 LỖI CẤU HÌNH: JWT Secret keys không được tải!");
  // Nếu bạn thấy lỗi này, có nghĩa là file .env chưa được tải
  // process.exit(1); 
} else {
  console.log("✅ JWT Secrets đã được tải thành công.");
}

app.use(cors(corsConfig));

// Security middleware (Đặt SAU CORS để tránh ghi đè)
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
   message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter); // Áp dụng cho các route /api/

// Logging
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static files (Phục vụ ảnh bìa)
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path, stat) => {
      // Thêm header CORP cho các tài nguyên tĩnh như hình ảnh
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); 
    },
  })
);

// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/book_borrowing_db"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/api/borrowing", require("./routes/borrowing"));
app.use("/api/users", require("./routes/users"));
app.use("/api/categories", require("./routes/categories"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Quick seed endpoint for testing
app.post("/api/seed", async (req, res) => {
  try {
    const Category = require("./models/Category");
    const Book = require("./models/Book");

    // Clear existing data
    await Category.deleteMany({});
    await Book.deleteMany({});

    // Create categories
    const categories = await Category.insertMany([
      { name: "Văn học", description: "Sách văn học trong và ngoài nước" },
      {
        name: "Công nghệ",
        description: "Sách về công nghệ thông tin và lập trình",
      },
      { name: "Khoa học", description: "Sách khoa học tự nhiên và ứng dụng" },
    ]);

    // Create books
    const books = await Book.insertMany([
      {
        title: "Tôi thấy hoa vàng trên cỏ xanh",
        author: "Nguyễn Nhật Ánh",
        isbn: "9786041001234",
        description: "Cuốn tiểu thuyết nổi tiếng về tuổi thơ miền quê Việt Nam",
        totalCopies: 5,
        availableCopies: 5,
        publishedYear: 2010,
        category: categories[0]._id,
        tags: ["văn học", "tuổi thơ", "việt nam"],
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        description: "Hướng dẫn viết code sạch và dễ bảo trì",
        totalCopies: 3,
        availableCopies: 3,
        publishedYear: 2008,
        category: categories[1]._id,
        tags: ["programming", "software development"],
      },
      {
        title: "Sapiens: Lược sử loài người",
        author: "Yuval Noah Harari",
        isbn: "9780062316097",
        description: "Câu chuyện về sự tiến hóa của loài người",
        totalCopies: 4,
        availableCopies: 4,
        publishedYear: 2014,
        category: categories[2]._id,
        tags: ["lịch sử", "nhân loại", "tiến hóa"],
      },
    ]);

    res.json({
      success: true,
      message: `Created ${categories.length} categories and ${books.length} books`,
      data: { categories: categories.length, books: books.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Book Borrowing API ready at http://localhost:${PORT}/api`);
});