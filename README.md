# Ứng dụng Mượn Sách Trực Tuyến - MEVN Stack

Ứng dụng web mượn sách trực tuyến hoàn chỉnh được xây dựng với MEVN stack (MongoDB, Express.js, Vue.js, Node.js).

## Tính năng chính

- 🔐 Hệ thống đăng ký và xác thực người dùng với JWT
- 📚 Duyệt danh mục sách với tìm kiếm, lọc và phân trang
- 📋 Hệ thống yêu cầu mượn sách với quy trình phê duyệt
- 👤 Dashboard người dùng với lịch sử mượn và thông báo
- 👨‍💼 Panel admin cho quản lý sách và người dùng
- 💰 Tính toán phí quá hạn tự động
- 📧 Thông báo email cho các sự kiện quan trọng

## Công nghệ sử dụng

- **Backend**: Node.js 18+, Express.js 4.x, MongoDB 6.x, Mongoose 7.x
- **Frontend**: Vue.js 3.3+, TypeScript, Tailwind CSS 3.x
- **Authentication**: JWT với refresh tokens, RBAC
- **Validation**: Joi
- **Security**: bcrypt, rate limiting, CORS

## Cấu trúc dự án

```
├── backend/          # Node.js/Express API server
├── frontend/         # Vue.js client application
└── docs/            # Documentation files
```

## Cài đặt và chạy

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

API server chạy trên `http://localhost:3000`
Frontend chạy trên `http://localhost:5173`

## License

MIT License
