const fs = require('fs');
const path = require('path');

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Danh sách file cần tạo
const files = [
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

// Tạo file SVG đơn giản cho mỗi sách
files.forEach((filename, index) => {
  const filePath = path.join(uploadsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    const title = filename.replace('.jpg', '').replace(/-/g, ' ').toUpperCase();
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
    const color = colors[index % colors.length];
    
    const svgContent = `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="${color}"/>
  <rect x="20" y="20" width="360" height="560" fill="rgba(255,255,255,0.1)"/>
  <text x="200" y="300" text-anchor="middle" font-family="Arial" font-size="16" fill="white">${title.substring(0, 20)}</text>
</svg>`;
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created: ${filename}`);
  }
});

console.log('All book covers created!');