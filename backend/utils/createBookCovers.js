const fs = require('fs');
const path = require('path');

// Danh sách tên file hình ảnh bìa sách
const bookCoverFilenames = [
  'toi-thay-hoa-vang-tren-co-xanh.jpg',
  'clean-code.jpg',
  'sapiens.jpg',
  'thinking-fast-and-slow.jpg',
  'the-lean-startup.jpg',
  'lich-su-viet-nam.jpg',
  'javascript-the-good-parts.jpg',
  'dac-nhan-tam.jpg',
  'atomic-habits.jpg',
  'psychology-of-money.jpg',
  'homo-deus.jpg',
  'pragmatic-programmer.jpg',
  'educated.jpg',
  '7-habits.jpg',
  'dune.jpg',
  '1984.jpg',
  'to-kill-a-mockingbird.jpg',
  'the-great-gatsby.jpg',
  'pride-and-prejudice.jpg',
  'the-catcher-in-the-rye.jpg',
  'lord-of-the-rings.jpg',
  'harry-potter-1.jpg',
  'the-alchemist.jpg',
  'brave-new-world.jpg',
  'the-art-of-war.jpg',
  'rich-dad-poor-dad.jpg',
  'the-power-of-now.jpg',
  'steve-jobs.jpg',
  'subtle-art.jpg'
];

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Hàm tạo file placeholder đơn giản
const createPlaceholderImage = (filename, index) => {
  const filePath = path.join(uploadsDir, filename);
  
  // Kiểm tra nếu file đã tồn tại
  if (fs.existsSync(filePath)) {
    console.log(`⏭️  Skipped ${filename} (already exists)`);
    return;
  }

  try {
    // Tạo một file SVG đơn giản làm placeholder
    const bookTitle = filename.replace('.jpg', '').replace(/-/g, ' ').toUpperCase();
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];
    const bgColor = colors[index % colors.length];
    
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="${bgColor}"/>
  <rect x="20" y="20" width="360" height="560" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <text x="200" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">
    ${bookTitle.length > 25 ? bookTitle.substring(0, 25) + '...' : bookTitle}
  </text>
  <text x="200" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)">
    Book Cover
  </text>
  <circle cx="200" cy="200" r="30" fill="rgba(255,255,255,0.2)"/>
  <text x="200" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white">📚</text>
</svg>`;
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ Created placeholder ${filename}`);
  } catch (error) {
    console.error(`❌ Error creating ${filename}:`, error.message);
  }
};

// Hàm tạo tất cả hình ảnh placeholder
const createAllCovers = () => {
  console.log('🚀 Starting book cover creation...');
  console.log(`📊 Total files to create: ${bookCoverFilenames.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  bookCoverFilenames.forEach((filename, index) => {
    try {
      createPlaceholderImage(filename, index);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating ${filename}:`, error.message);
      errorCount++;
    }
  });
  
  console.log('\n📊 Creation Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📁 Files saved to: ${uploadsDir}`);
  
  if (errorCount === 0) {
    console.log('\n🎉 All book covers created successfully!');
  } else {
    console.log('\n⚠️  Some files failed to create.');
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  createAllCovers();
  console.log('✨ Creation process completed!');
}

module.exports = { createAllCovers };