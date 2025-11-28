const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

// -------------------- CUSTOMER --------------------

// Đăng nhập customer
const login = async (req, res) => {
    const { name, password } = req.body;

    try {
        const customer = await Customer.findOne({ Name: name });
        if (!customer) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        res.status(200).json({
            message: 'Đăng nhập thành công',
            customer: { Name: customer.Name, role: "customer" }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Kiểm tra tên và email người dùng
const checkUser = async (req, res) => {
    const { name, email } = req.body;

    try {
        const existingCustomerByName = await Customer.findOne({ Name: name });
        const existingCustomerByEmail = await Customer.findOne({ Email: email });

        if (existingCustomerByName || existingCustomerByEmail) {
            return res.status(200).json({ available: false });
        }
        res.status(200).json({ available: true });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    }
};

// Đăng ký customer
const register = async (req, res) => {
    const { name, email, phone, address, password } = req.body;

    try {
        const existingCustomer = await Customer.findOne({ Email: email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email đã được sử dụng. Vui lòng chọn email khác.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newCustomer = new Customer({
            Name: name,
            Email: email,
            Phone: phone,
            Address: address,
            Password: hashedPassword,
        });

        await newCustomer.save();
        res.status(201).json({ message: 'Tài khoản đã được tạo thành công! Bạn có thể đăng nhập.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xác minh mã
const verify = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const customer = await Customer.findOne({ Email: email });

        if (!customer) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        if (customer.VerificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Mã xác nhận không chính xác.' });
        }

        customer.VerificationCode = undefined;
        await customer.save();

        res.status(200).json({ message: 'Đăng ký thành công! Bạn có thể đăng nhập.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// -------------------- ADMIN --------------------

// Đăng nhập admin
const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username: username });
        if (!admin) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        // So sánh trực tiếp (chưa dùng bcrypt)
        if (password !== admin.password) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        res.status(200).json({
            message: 'Đăng nhập thành công',
            admin: { Name: admin.username, role: "admin" }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// -------------------- EXPORT --------------------
module.exports = {
    login,
    checkUser,
    register,
    verify,
    adminLogin
};



// const bcrypt = require('bcryptjs');
// const Customer = require('../models/Customer');
// const Admin = require('../models/Admin');

// // Đăng nhập customer
// exports.login = async (req, res) => {
//     const { name, password } = req.body;

//     try {
//         const customer = await Customer.findOne({ Name: name });
//         if (!customer) {
//             return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, customer.Password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
//         }

//         res.status(200).json({ message: 'Đăng nhập thành công', customer: { Name: customer.Name } });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Kiểm tra tên và email người dùng
// exports.checkUser = async (req, res) => {
//     const { name, email } = req.body;

//     try {
//         const existingCustomerByName = await Customer.findOne({ Name: name });
//         const existingCustomerByEmail = await Customer.findOne({ Email: email });

//         if (existingCustomerByName || existingCustomerByEmail) {
//             return res.status(200).json({ available: false });
//         }
//         res.status(200).json({ available: true });
//     } catch (err) {
//         res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
//     }
// };

// // Đăng ký
// exports.register = async (req, res) => {
//     const { name, email, phone, address, password } = req.body;

//     try {
//         const existingCustomer = await Customer.findOne({ Email: email });
//         if (existingCustomer) {
//             return res.status(400).json({ message: 'Email đã được sử dụng. Vui lòng chọn email khác.' });
//         }

//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         const newCustomer = new Customer({
//             Name: name,
//             Email: email,
//             Phone: phone,
//             Address: address,
//             Password: hashedPassword,
//         });

//         await newCustomer.save();
//         res.status(201).json({ message: 'Tài khoản đã được tạo thành công! Bạn có thể đăng nhập.' });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// // Xác minh mã
// exports.verify = async (req, res) => {
//     const { email, verificationCode } = req.body;

//     try {
//         const customer = await Customer.findOne({ Email: email });

//         if (!customer) {
//             return res.status(404).json({ message: 'Người dùng không tồn tại.' });
//         }

//         if (customer.VerificationCode !== verificationCode) {
//             return res.status(400).json({ message: 'Mã xác nhận không chính xác.' });
//         }

//         customer.VerificationCode = undefined;
//         await customer.save();

//         res.status(200).json({ message: 'Đăng ký thành công! Bạn có thể đăng nhập.' });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// // Đăng nhập admin
// exports.adminLogin = async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const admin = await Admin.findOne({ username: username });
//         if (!admin) {
//             return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
//         }

//         // So sánh trực tiếp (không dùng bcrypt)
//         if (password !== admin.password) {
//             return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
//         }

//         res.status(200).json({
//             message: 'Đăng nhập thành công',
//             admin: { Name: admin.username }
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
