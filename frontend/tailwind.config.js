/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // THAY THẾ bằng dải màu Indigo (hoặc màu chàm)
        primary: {
          50: "#eef2ff",    // Lớp nền rất nhạt
          100: "#e0e7ff",   // Lớp nền nhạt (dùng cho badge, hover)
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",   // Màu chính (Main Primary)
          600: "#4f46e5",
          700: "#4338ca",   // Màu đậm (Dùng cho chữ, nút)
          800: "#3730a3",
          900: "#312e81",
        },
      },
      fontFamily: {
        // Giữ nguyên font Inter
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    // Nếu bạn muốn hỗ trợ các lớp cũ như 'input', bạn có thể cần thêm plugin form
    // require('@tailwindcss/forms'),
  ],
};