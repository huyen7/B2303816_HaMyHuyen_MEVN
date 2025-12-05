const bcrypt = require('bcryptjs');
const newPassword = 'MatKhauAdminMoi123'; // <-- THAY ĐỔI MẬT KHẨU CỦA BẠN TẠI ĐÂY
const saltRounds = 10; // Đảm bảo trùng với saltRounds mà ứng dụng của bạn đang dùng

bcrypt.hash(newPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error('Lỗi khi băm mật khẩu:', err);
        return;
    }
    console.log('Chuỗi Băm Mới (Hash):');
    console.log(hash);
});