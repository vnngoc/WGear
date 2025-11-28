// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const admin = JSON.parse(localStorage.getItem('admin')); // Lấy thông tin admin từ localStorage

    // Kiểm tra xem admin có tồn tại và có thông tin hợp lệ không
    if (!admin || !admin.Name) {
        return <Navigate to="/admin/login" />;
    }

    return children; // Nếu đã đăng nhập, hiển thị component con
};

export default ProtectedRoute;