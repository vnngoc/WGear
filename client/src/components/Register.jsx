import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import '../css/Register.css';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [sentCode, setSentCode] = useState('');
    const [message, setMessage] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Tạo mã xác nhận ngẫu nhiên
        const code = Math.random().toString(36).substring(2, 8);
        setSentCode(code);

        try {
            // Kiểm tra tên người dùng hoặc email có tồn tại không
            const checkResponse = await axios.post('http://localhost:5000/api/check-user', { name, email });
            if (!checkResponse.data.available) {
                setMessage('Tên hoặc email đã tồn tại. Vui lòng chọn khác.');
                return;
            }

            // Gửi email xác nhận
            await emailjs.send('service_wgo5m5a', 'template_duq3z3e', {
                name,
                email,
                verificationCode: code,
            }, '7oV_vV7xwhrwQvsb9');

            setMessage('Mã xác nhận đã được gửi đến email của bạn.');
            setIsCodeSent(true);
        } catch (error) {
            setMessage('Đã xảy ra lỗi khi gửi email hoặc kiểm tra tên. Vui lòng thử lại.');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        if (verificationCode === sentCode) {
            try {
                const response = await axios.post('http://localhost:5000/api/register', {
                    name,
                    email,
                    phone,
                    address,
                    password,
                });

                setMessage(response.data.message);
                if (response.status === 201) {
                    setTimeout(() => {
                        navigate('/login');
                    }, 3500);
                }
            } catch (error) {
                setMessage(error.response ? error.response.data.message : 'Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        } else {
            setMessage('Mã xác nhận không chính xác. Vui lòng thử lại.');
        }
    };

    return (
        <div className="login-container">
            <div className="Register-box">
                <h2>Đăng ký</h2>
                {message && <div className="message">{message}</div>}
                
                {!isCodeSent ? (
                    <form onSubmit={handleRegister}>
                        <input 
                            type="text" 
                            placeholder="Tên người dùng" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            pattern="^[A-Za-z0-9_]{3,20}$" 
                            title="Tên chỉ gồm chữ, số, dấu gạch dưới, từ 3-20 ký tự"
                        />
                        <input 
                            type="email" 
                            placeholder="user@gmail.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <input 
                            type="tel" 
                            placeholder="0912345678" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                            pattern="[0-9]{10,11}" 
                            title="Số điện thoại phải gồm 10-11 chữ số"
                        />
                        <input 
                            type="text" 
                            placeholder="số nhà, tên đường, phường, xã, tỉnh" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Mật khẩu (ít nhất 6 ký tự)" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            minLength={6} 
                            title="Mật khẩu phải có ít nhất 6 ký tự"
                        />
                        <button type="submit">Đăng Ký</button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <input 
                            type="text" 
                            placeholder="Mã xác nhận" 
                            value={verificationCode} 
                            onChange={(e) => setVerificationCode(e.target.value)} 
                            required 
                            pattern="[A-Za-z0-9]{6}" 
                            title="Mã xác nhận gồm 6 ký tự chữ hoặc số"
                        />
                        <button type="submit">Xác thực</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;





// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import emailjs from 'emailjs-com';
// import '../css/Register.css';
// import axios from 'axios';

// const Register = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [address, setAddress] = useState('');
//     const [password, setPassword] = useState('');
//     const [verificationCode, setVerificationCode] = useState('');
//     const [sentCode, setSentCode] = useState('');
//     const [message, setMessage] = useState('');
//     const [isCodeSent, setIsCodeSent] = useState(false);
//     const navigate = useNavigate();

//     const handleRegister = async (e) => {
//         e.preventDefault();

//         // Tạo mã xác nhận ngẫu nhiên
//         const code = Math.random().toString(36).substring(2, 8);
//         setSentCode(code); // Lưu mã xác nhận để kiểm tra sau

//         try {
//             // Kiểm tra tên người dùng có tồn tại không
//             const checkResponse = await axios.post('http://localhost:5000/api/check-user', { name, email });
//             if (!checkResponse.data.available) {
//                 setMessage('Tên hoặc email đã tồn tại. Vui lòng chọn khác.');
//                 return;
//             }

//             // Gửi email xác nhận
//             await emailjs.send('service_wgo5m5a', 'template_duq3z3e', {
//                 name,
//                 email,
//                 verificationCode: code,
//             }, '7oV_vV7xwhrwQvsb9'); // Thay 'user_your_user_id' bằng user ID của bạn từ EmailJS

//             setMessage('Mã xác nhận đã được gửi đến email của bạn.');
//             setIsCodeSent(true);
//         } catch (error) {
//             setMessage('Đã xảy ra lỗi khi gửi email hoặc kiểm tra tên. Vui lòng thử lại.');
//         }
//     };

//     const handleVerify = async (e) => {
//         e.preventDefault();

//         if (verificationCode === sentCode) {
//             try {
//                 const response = await axios.post('http://localhost:5000/api/register', {
//                     name,
//                     email,
//                     phone,
//                     address,
//                     password,
//                 });

//                 setMessage(response.data.message);
//                 if (response.status === 201) {
//                     setTimeout(() => {
//                         navigate('/login');
//                     }, 3500);
//                 }
//             } catch (error) {
//                 setMessage(error.response ? error.response.data.message : 'Đã xảy ra lỗi. Vui lòng thử lại.');
//             }
//         } else {
//             setMessage('Mã xác nhận không chính xác. Vui lòng thử lại.');
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="Register-box">
//                 <h2>Đăng ký</h2>
//                 {message && <div className="message">{message}</div>}
                
//                 {!isCodeSent ? (
//                     <form onSubmit={handleRegister}>
//                         <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
//                         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                         <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
//                         <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
//                         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                         <button type="submit">Đăng Kí</button>
//                     </form>
//                 ) : (
//                     <form onSubmit={handleVerify}>
//                         <input type="text" placeholder="Mã xác nhận" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
//                         <button type="submit">Xác thực</button>
//                     </form>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Register;