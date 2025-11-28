import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Thử đăng nhập Admin trước
        try {
            const adminRes = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: identifier, password }),
            });

            const adminData = await adminRes.json();
            if (adminRes.ok) {
                localStorage.setItem('admin', JSON.stringify(adminData.admin));
                navigate('/admin');
                return;
            }
        } catch (err) {
            console.log("Admin login error:", err);
        }

        // Nếu không phải admin → thử đăng nhập Customer
        try {
            const userRes = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: identifier, password }),
            });

            const userData = await userRes.json();
            if (userRes.ok) {
                localStorage.setItem('user', JSON.stringify(userData.customer));
                navigate('/');
                return;
            } else {
                setError(userData.message);
            }
        } catch (err) {
            setError('Lỗi kết nối tới server');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng nhập</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="user@gmail.com hoặc nguyenvanA"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        title="Mật khẩu phải có ít nhất 6 ký tự"
                    />

                    <div className="login-options">
                        <label>
                            <input type="checkbox" /> Ghi nhớ đăng nhập
                        </label>
                        <Link to="/forgot-password" className="forgot-link">Quên mật khẩu?</Link>
                    </div>

                    <button type="submit">Đăng nhập</button>
                </form>

                {error && <p className="error">{error}</p>}

                <p>
                    Bạn chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;







// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Nhập useNavigate
// import '../css/Login.css';

// const Login = () => {
//     const [name, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate(); // Khởi tạo useNavigate

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         try {
//             const response = await fetch('http://localhost:5000/api/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ name, password }),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 // Lưu thông tin người dùng vào localStorage (bao gồm cả tên)
//                 localStorage.setItem('user', JSON.stringify(data.customer)); // Lưu thông tin người dùng

//                 // Chuyển hướng tới trang chủ
//                 navigate('/');
//             } else {
//                 setError(data.message);
//             }
//         } catch (err) {
//             setError('Lỗi kết nối tới server');
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-box">
//                 <h2>Đăng nhập</h2>
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text"
//                         placeholder="Name"
//                         value={name}
//                         onChange={(e) => setUsername(e.target.value)}
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <button type="submit">Đăng nhập</button>
//                 </form>
//                 {error && <p className="error">{error}</p>}
//                 <p>
//                     Bạn chưa có tài khoản? <Link to="/register">Đăng ký Tại đây</Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Login;