require("dotenv").config();
const bcrypt = require('bcryptjs'); // <--- CẦN THÊM DÒNG NÀY
const mongoose = require("mongoose");
const User = require("../models/User");
const Category = require("../models/Category");
const Book = require("../models/Book");
const BorrowingRequest = require("../models/BorrowingRequest");

// Sample data
const categories = [
  { name: "Văn học", description: "Sách văn học trong và ngoài nước" },
  { name: "Khoa học", description: "Sách khoa học tự nhiên và ứng dụng" },
  {
    name: "Công nghệ",
    description: "Sách về công nghệ thông tin và lập trình",
  },
  { name: "Kinh tế", description: "Sách về kinh tế, tài chính và quản lý" },
  { name: "Lịch sử", description: "Sách lịch sử Việt Nam và thế giới" },
  {
    name: "Tâm lý học",
    description: "Sách về tâm lý học và phát triển bản thân",
  },
  { name: "Triết học", description: "Sách triết học và tư tưởng" },
  { name: "Giáo dục", description: "Sách giáo khoa và tài liệu học tập" },
];

const users = [
  {
    firstName: "Admin",
    lastName: "Book",
    email: "admin@book.com",
    password: "adminbook123*",
    role: "admin",
    isEmailVerified: true,
  },
  {
    firstName: "Admin",
    lastName: "Book New",
    email: "admin@booknew.com",
    password: "adminbooknew123*",
    role: "admin",
    isEmailVerified: true,
  },
  {
    firstName: "Nguyễn",
    lastName: "Văn An",
    email: "nguyenvanan@email.com",
    password: "nguyenvanan123*",
    role: "user",
    isEmailVerified: true,
  },
  {
    firstName: "Trần",
    lastName: "Thị Bình",
    email: "tranthibinh@email.com",
    password: "tranthibinh123*",
    role: "user",
    isEmailVerified: true,
  },
  {
    firstName: "Lê",
    lastName: "Minh Cường",
    email: "leminhcuong@email.com",
    password: "leminhcuong123*",
    role: "user",
    isEmailVerified: false,
  },
  {
    firstName: "Phạm",
    lastName: "Thu Dung",
    email: "phamthudung@email.com",
    password: "phamthudung123*",
    role: "user",
    isEmailVerified: true,
  },
];

const books = [
  {
    title: "Tôi thấy hoa vàng trên cỏ xanh",
    author: "Nguyễn Nhật Ánh",
    isbn: "9786041001234",
    description:
      "Cuốn tiểu thuyết nổi tiếng về tuổi thơ miền quê Việt Nam, kể về những kỷ niệm đẹp của tuổi thơ qua con mắt của cậu bé Thiều.",
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 2010,
    coverImageUrl: "/uploads/toi-thay-hoa-vang-tren-co-xanh.jpg",
    tags: ["văn học", "tuổi thơ", "việt nam"],
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    description:
      "Hướng dẫn viết code sạch và dễ bảo trì. Cuốn sách kinh điển về kỹ thuật lập trình chuyên nghiệp.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2008,
    coverImageUrl: "/uploads/clean-code.jpg",
    tags: ["programming", "software development", "best practices"],
  },
  {
    title: "Sapiens: Lược sử loài người",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    description:
      "Câu chuyện về sự tiến hóa của loài người từ thời tiền sử đến hiện đại, khám phá những bước ngoặt lớn trong lịch sử nhân loại.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 2014,
    coverImageUrl: "/uploads/sapiens.jpg",
    tags: ["lịch sử", "nhân loại", "tiến hóa"],
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "9780374533557",
    description:
      "Nghiên cứu về cách thức hoạt động của tư duy con người, phân tích hai hệ thống tư duy nhanh và chậm.",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 2011,
    coverImageUrl: "/uploads/thinking-fast-and-slow.jpg",
    tags: ["tâm lý học", "tư duy", "hành vi"],
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "9780307887894",
    description:
      "Phương pháp khởi nghiệp tinh gọn và hiệu quả, hướng dẫn cách xây dựng startup thành công.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2011,
    coverImageUrl: "/uploads/the-lean-startup.jpg",
    tags: ["kinh doanh", "khởi nghiệp", "quản lý"],
  },
  {
    title: "Lịch sử Việt Nam",
    author: "Trần Trọng Kim",
    isbn: "9786041002345",
    description:
      "Tổng quan về lịch sử Việt Nam từ thời cổ đại, tác phẩm kinh điển về lịch sử dân tộc.",
    totalCopies: 6,
    availableCopies: 6,
    publishedYear: 1920,
    coverImageUrl: "/uploads/lich-su-viet-nam.jpg",
    tags: ["lịch sử", "việt nam", "cổ đại"],
  },
  {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    isbn: "9780596517748",
    description:
      "Những phần tốt nhất của ngôn ngữ JavaScript, hướng dẫn viết JavaScript hiệu quả và an toàn.",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 2008,
    coverImageUrl: "/uploads/javascript-the-good-parts.jpg",
    tags: ["javascript", "programming", "web development"],
  },
  {
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    isbn: "9786041003456",
    description:
      "Nghệ thuật giao tiếp và ứng xử trong cuộc sống, cuốn sách kinh điển về kỹ năng mềm.",
    totalCopies: 8,
    availableCopies: 8,
    publishedYear: 1936,
    coverImageUrl: "/uploads/dac-nhan-tam.jpg",
    tags: ["kỹ năng sống", "giao tiếp", "phát triển bản thân"],
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    description:
      "Hướng dẫn xây dựng thói quen tốt và loại bỏ thói quen xấu một cách hiệu quả.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 2018,
    coverImageUrl: "/uploads/atomic-habits.jpg",
    tags: ["phát triển bản thân", "thói quen", "tâm lý học"],
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    isbn: "9780857197689",
    description:
      "Những bài học vượt thời gian về tài chính và đầu tư từ góc nhìn tâm lý học.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2020,
    coverImageUrl: "/uploads/psychology-of-money.jpg",
    tags: ["tài chính", "đầu tư", "tâm lý học"],
  },
  {
    title: "Homo Deus",
    author: "Yuval Noah Harari",
    isbn: "9781784703936",
    description:
      "Tương lai của loài người trong thế kỷ 21, khám phá những thách thức và cơ hội phía trước.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2016,
    coverImageUrl: "/uploads/homo-deus.jpg",
    tags: ["tương lai", "công nghệ", "nhân loại"],
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    isbn: "9780135957059",
    description:
      "Hướng dẫn trở thành lập trình viên chuyên nghiệp với những kỹ thuật và nguyên tắc thực tế.",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 2019,
    coverImageUrl: "/uploads/pragmatic-programmer.jpg",
    tags: ["programming", "software development", "career"],
  },
  {
    title: "Educated",
    author: "Tara Westover",
    isbn: "9780399590504",
    description:
      "Hồi ký về hành trình giáo dục và tự giải phóng của một cô gái từ gia đình cực đoan.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2018,
    coverImageUrl: "/uploads/educated.jpg",
    tags: ["hồi ký", "giáo dục", "gia đình"],
  },
  {
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    isbn: "9781982137274",
    description:
      "7 thói quen của người thành đạt, hướng dẫn phát triển hiệu quả cá nhân và lãnh đạo.",
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 1989,
    coverImageUrl: "/uploads/7-habits.jpg",
    tags: ["lãnh đạo", "hiệu quả", "phát triển bản thân"],
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    isbn: "9780441172719",
    description:
      "Tiểu thuyết khoa học viễn tưởng kinh điển về hành tinh sa mạc Arrakis và gia tộc Atreides.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1965,
    coverImageUrl: "/uploads/dune.jpg",
    tags: ["khoa học viễn tưởng", "phiêu lưu", "kinh điển"],
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    description:
      "Tiểu thuyết dystopia kinh điển về xã hội toàn trị và sự kiểm soát tuyệt đối của Big Brother.",
    totalCopies: 6,
    availableCopies: 6,
    publishedYear: 1949,
    coverImageUrl: "/uploads/1984.jpg",
    tags: ["dystopia", "chính trị", "kinh điển"],
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    description:
      "Câu chuyện về công lý và thiên kiến qua con mắt của cô bé Scout Finch ở miền Nam nước Mỹ.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1960,
    coverImageUrl: "/uploads/to-kill-a-mockingbird.jpg",
    tags: ["văn học", "công lý", "kinh điển"],
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    description:
      "Tác phẩm kinh điển về giấc mơ Mỹ và sự sa đọa của xã hội thượng lưu những năm 1920.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1925,
    coverImageUrl: "/uploads/the-great-gatsby.jpg",
    tags: ["văn học", "kinh điển", "mỹ"],
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    description:
      "Câu chuyện tình yêu kinh điển giữa Elizabeth Bennet và Mr. Darcy trong xã hội Anh thế kỷ 19.",
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 1813,
    coverImageUrl: "/uploads/pride-and-prejudice.jpg",
    tags: ["lãng mạn", "kinh điển", "anh"],
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769174",
    description:
      "Câu chuyện về Holden Caulfield, một thiếu niên nổi loạn tìm kiếm ý nghĩa cuộc sống ở New York.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1951,
    coverImageUrl: "/uploads/the-catcher-in-the-rye.jpg",
    tags: ["văn học", "tuổi teen", "kinh điển"],
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    isbn: "9780544003415",
    description:
      "Cuộc phiêu lưu epic về Frodo và nhiệm vụ tiêu hủy chiếc nhẫn quyền lực ở Middle-earth.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1954,
    coverImageUrl: "/uploads/lord-of-the-rings.jpg",
    tags: ["fantasy", "phiêu lưu", "kinh điển"],
  },
  {
    title: "Harry Potter và Hòn đá Phù thủy",
    author: "J.K. Rowling",
    isbn: "9780439708180",
    description:
      "Cuộc phiêu lưu đầu tiên của Harry Potter tại trường phù thủy Hogwarts.",
    totalCopies: 8,
    availableCopies: 8,
    publishedYear: 1997,
    coverImageUrl: "/uploads/harry-potter-1.jpg",
    tags: ["fantasy", "phiêu lưu", "thiếu nhi"],
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780062315007",
    description:
      "Hành trình tìm kiếm kho báu và khám phá bản thân của cậu bé chăn cừu Santiago.",
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 1988,
    coverImageUrl: "/uploads/the-alchemist.jpg",
    tags: ["triết học", "tâm linh", "phiêu lưu"],
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "9780060850524",
    description:
      "Thế giới tương lai dystopia nơi con người được kiểm soát bởi công nghệ và dược phẩm.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1932,
    coverImageUrl: "/uploads/brave-new-world.jpg",
    tags: ["dystopia", "khoa học viễn tưởng", "triết học"],
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    isbn: "9781599869773",
    description:
      "Tác phẩm kinh điển về chiến lược quân sự và nghệ thuật lãnh đạo của Trung Quốc cổ đại.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1910,
    coverImageUrl: "/uploads/the-art-of-war.jpg",
    tags: ["chiến lược", "lãnh đạo", "kinh điển"],
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    isbn: "9781612680194",
    description:
      "Những bài học về tài chính và đầu tư từ hai người cha với tư duy khác nhau.",
    totalCopies: 6,
    availableCopies: 6,
    publishedYear: 1997,
    coverImageUrl: "/uploads/rich-dad-poor-dad.jpg",
    tags: ["tài chính", "đầu tư", "giáo dục"],
  },
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    isbn: "9781577314806",
    description:
      "Hướng dẫn sống trong hiện tại và đạt được sự giác ngộ tâm linh.",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1997,
    coverImageUrl: "/uploads/the-power-of-now.jpg",
    tags: ["tâm linh", "thiền", "phát triển bản thân"],
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    isbn: "9781451648539",
    description:
      "Tiểu sử chính thức của Steve Jobs, người đồng sáng lập Apple và biểu tượng của sự đổi mới.",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 2011,
    coverImageUrl: "/uploads/steve-jobs.jpg",
    tags: ["tiểu sử", "công nghệ", "doanh nhân"],
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    isbn: "9780062457714",
    description:
      "Cách tiếp cận thẳng thắn và thực tế về việc sống một cuộc đời có ý nghĩa.",
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 2016,
    coverImageUrl: "/uploads/subtle-art.jpg",
    tags: ["phát triển bản thân", "triết học", "hài hước"],
  },
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/book_borrowing_db"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Book.deleteMany({}),
      BorrowingRequest.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
};

// Seed categories
const seedCategories = async () => {
  try {
    const createdCategories = await Category.insertMany(categories);
    console.log(`📚 Created ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Salt Rounds phải khớp với User Model
    const saltRounds = 12; 
    
    const allUsersData = users; 

    // Tạo một mảng Promise để băm mật khẩu cho TẤT CẢ người dùng
    const usersToInsert = await Promise.all(allUsersData.map(async user => {
        // Chỉ băm nếu mật khẩu tồn tại
        const hash = await bcrypt.hash(user.password, saltRounds);
        // Cẩn thận: Nếu bạn có băm mật khẩu trong User Model,
        // bạn sẽ băm hai lần (double-hash) ở đây. 
        // Tuy nhiên, với insertMany, băm thủ công là cần thiết.
        return { ...user, password: hash };
    }));

    // SỬ DỤNG insertMany với dữ liệu đã được băm
    const createdUsers = await User.insertMany(usersToInsert); 
    
    console.log(`👥 Created ${createdUsers.length} users (Gồm 1 admin và ${createdUsers.length - 1} users thường)`);
    return createdUsers;
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
};

// Seed books
const seedBooks = async (categories) => {
  try {
    const booksWithCategories = books.map((book, index) => ({
      ...book,
      category: categories[index % categories.length]._id,
    }));

    const createdBooks = await Book.insertMany(booksWithCategories);
    console.log(`📖 Created ${createdBooks.length} books`);
    return createdBooks;
  } catch (error) {
    console.error("Error seeding books:", error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();
    await clearData();

    const createdCategories = await seedCategories();
    const createdUsers = await seedUsers();
    const createdBooks = await seedBooks(createdCategories);

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Books: ${createdBooks.length}`);
    //console.log("\n🔐 Admin credentials:");
    //console.log("   Email: admin@book.com");
    //console.log("   Password: adminbook123*");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };