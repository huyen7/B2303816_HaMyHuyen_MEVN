const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Danh sách tên file hình ảnh bìa sách
const bookCoverFilenames = [
  "toi-thay-hoa-vang-tren-co-xanh.jpg",
  "clean-code.jpg",
  "sapiens.jpg",
  "thinking-fast-and-slow.jpg",
  "the-lean-startup.jpg",
  "lich-su-viet-nam.jpg",
  "javascript-the-good-parts.jpg",
  "dac-nhan-tam.jpg",
  "atomic-habits.jpg",
  "psychology-of-money.jpg",
  "homo-deus.jpg",
  "pragmatic-programmer.jpg",
  "educated.jpg",
  "7-habits.jpg",
  "dune.jpg",
  "1984.jpg",
  "to-kill-a-mockingbird.jpg",
  "the-great-gatsby.jpg",
  "pride-and-prejudice.jpg",
  "the-catcher-in-the-rye.jpg",
  "lord-of-the-rings.jpg",
  "harry-potter-1.jpg",
  "the-alchemist.jpg",
  "brave-new-world.jpg",
  "the-art-of-war.jpg",
  "rich-dad-poor-dad.jpg",
  "the-power-of-now.jpg",
  "steve-jobs.jpg",
  "subtle-art.jpg",
];

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// Hàm tải xuống file
const downloadFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(uploadsDir, filename);

    // Kiểm tra nếu file đã tồn tại
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skipped ${filename} (already exists)`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(filePath);
    const protocol = url.startsWith("https:") ? https : http;

    const request = protocol.get(url, (response) => {
      // Xử lý redirect
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filePath);
        downloadFile(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filePath);
        reject(
          new Error(`Failed to download ${filename}: ${response.statusCode}`)
        );
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`✅ Downloaded ${filename}`);
        resolve();
      });

      file.on("error", (err) => {
        file.close();
        fs.unlinkSync(filePath);
        reject(err);
      });
    });

    request.on("error", (err) => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(new Error(`Timeout downloading ${filename}`));
    });
  });
};

// Hàm tải xuống tất cả hình ảnh
const downloadAllCovers = async () => {
  console.log("🚀 Starting book cover downloads...");
  console.log(`📊 Total files to download: ${bookCovers.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (const cover of bookCovers) {
    try {
      await downloadFile(cover.url, cover.filename);
      successCount++;

      // Thêm delay nhỏ giữa các request để tránh rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error downloading ${cover.filename}:`, error.message);
      errorCount++;
    }
  }

  console.log("\n📊 Download Summary:");
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📁 Files saved to: ${uploadsDir}`);

  if (errorCount === 0) {
    console.log("\n🎉 All book covers downloaded successfully!");
  } else {
    console.log(
      "\n⚠️  Some downloads failed. You may need to retry or manually download missing images."
    );
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  downloadAllCovers()
    .then(() => {
      console.log("✨ Download process completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Download process failed:", error);
      process.exit(1);
    });
}

module.exports = { downloadAllCovers };