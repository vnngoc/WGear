const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const customerRoutes = require('./routes/customer.routes');
const vnpayRoutes = require('./routes/vnpay');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối Database
connectDB();

// Routes
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/v1/vnpay', vnpayRoutes);

// Import controllers for backward compatibility
const productController = require('./controllers/product.controller');
const orderController = require('./controllers/order.controller');

// Backward compatibility routes
app.get('/api/search', productController.searchProducts);
app.get('/api/adminorders', orderController.getAllOrders);

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// const bcrypt = require('bcryptjs');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const vnpayRouter = require('./routes/vnpay');
// // Sử dụng router VNPAY
// app.use('/api/v1/vnpay', vnpayRouter);

// // Sử dụng mongoURI
// const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/gearshop";

// // Kết nối MongoDB
// mongoose.connect(mongoURI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Failed to connect to MongoDB:', err));

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// // Định nghĩa schema và model cho sản phẩm
// const productSchema = new mongoose.Schema({
//     Name: String,
//     Description: String,
//     Price: String,
//     Img: String,
//     Type: String,
//     Brand: String,
//     Stock: { type: Number, required: true },
// }, { collection: 'product' });

// const Product = mongoose.model('Product', productSchema);

// // Định nghĩa schema và model cho Category
// const categorySchema = new mongoose.Schema({
//     Type: String
// }, { collection: 'category' });

// const Category = mongoose.model('Category', categorySchema);

// const customerSchema = new mongoose.Schema({
//     Name: { type: String, unique: true },
//     Email: { type: String, unique: true },
//     Phone: Number,
//     Address: String,
//     Password: String,
// }, { collection: 'customer' });

// const Customer = mongoose.model('Customer', customerSchema);

// // Định nghĩa schema và model cho admin
// const adminSchema = new mongoose.Schema({
//     username: String,
//     password: String
// }, { collection: 'admin' });

// const Admin = mongoose.model('Admin', adminSchema);


// //Định nghĩa Model cho Order
// const orderSchema = new mongoose.Schema({
//     user: { type: Object, required: true }, // User data
//     products: [
//         {
//             productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//             quantity: { type: Number, required: true },
//             name: { type: String, required: true },
//             price: { type: Number, required: true }
//         }
//     ],
//     totalPrice: { type: Number, required: true },
//     method: { type: String, default: 'Chưa thanh toán' },
//     status: { type: String, default: 'Chưa được xác nhận' },
//     createdAt: { type: Date, default: Date.now }
// }, { collection: 'order' });

// const Order = mongoose.model('Order', orderSchema);

// module.exports = { Order, Product, Category, Customer, Admin };

// // API để lấy danh sách sản phẩm
// app.get('/api/product', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API để lấy chi tiết sản phẩm theo ID
// app.get('/api/product/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);

//         // Nếu không tìm thấy sản phẩm với id tương ứng
//         if (!product) {
//             return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
//         }

//         res.json(product);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Lỗi server hoặc ID không hợp lệ" });
//     }
// });

// // API sản phẩm liên quan
// app.get('/api/products/related', async (req, res) => {
//     const { name, excludeId } = req.query;

//     if (!name) {
//         return res.status(400).json({ message: 'Missing name query parameter' });
//     }

//     try {
//         const searchKey = name.substring(0, 10);

//         const products = await Product.find({
//             Name: { $regex: new RegExp(searchKey, 'i') },
//             _id: { $ne: excludeId }
//         });

//         res.json(products || []); // Luôn trả về mảng
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', error: err.message });
//     }
// });

// // API lấy danh sách category
// app.get('/api/category', async (req, res) => {
//     try {
//         const categories = await Category.find();
//         res.json(categories);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API để thêm category
// app.post('/api/category', async (req, res) => {
//     const newCategory = new Category({ Type: req.body.Type });
//     try {
//         const savedCategory = await newCategory.save();
//         res.status(201).json(savedCategory);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // API để sửa category
// app.put('/api/category/:id', async (req, res) => {
//     const { id } = req.params;

//     // Kiểm tra xem ID có hợp lệ không
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: "ID không hợp lệ" });
//     }

//     try {
//         const updatedCategory = await Category.findByIdAndUpdate(id, { Type: req.body.Type }, { new: true });
//         if (!updatedCategory) {
//             return res.status(404).json({ message: "Category không tìm thấy" });
//         }
//         res.json(updatedCategory);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // API để xóa category
// app.delete('/api/category/:id', async (req, res) => {
//     try {
//         const deletedCategory = await Category.findByIdAndDelete(req.params.id);
//         if (!deletedCategory) {
//             return res.status(404).json({ message: "Category không tìm thấy" });
//         }
//         res.json({ message: "Category đã bị xóa" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API để thêm sản phẩm
// app.post('/api/product', async (req, res) => {
//     const newProduct = new Product(req.body);
//     try {
//         const savedProduct = await newProduct.save();
//         res.status(201).json(savedProduct);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // API để sửa sản phẩm
// app.put('/api/product/:id', async (req, res) => {
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedProduct) {
//             return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
//         }
//         res.json(updatedProduct);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // API để xóa sản phẩm
// app.delete('/api/product/:id', async (req, res) => {
//     try {
//         const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//         if (!deletedProduct) {
//             return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
//         }
//         res.json({ message: "Sản phẩm đã bị xóa" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API để tìm kiếm sản phẩm theo tên
// app.get('/api/search', async (req, res) => {
//     const { query } = req.query; // Lấy từ query string
//     try {
//         const products = await Product.find({ Name: { $regex: query, $options: 'i' } }); // Tìm kiếm không phân biệt chữ hoa thường
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API để thêm sản phẩm vào giỏ hàng
// app.post('/api/cart', async (req, res) => {
//     const { customer_id, productId, quantity } = req.body;

//     try {
//         let cart = await Cart.findOne({ customer_id });

//         if (cart) {
//             // Nếu giỏ hàng đã tồn tại, kiểm tra sản phẩm đã có chưa
//             const existingProduct = cart.products.find(item => item.productId.equals(productId));

//             if (existingProduct) {
//                 // Nếu sản phẩm đã có, cập nhật số lượng
//                 existingProduct.quantity += quantity;
//             } else {
//                 // Nếu không, thêm sản phẩm mới vào giỏ hàng
//                 cart.products.push({ productId, quantity });
//             }
//             await cart.save();
//         } else {
//             // Nếu giỏ hàng chưa tồn tại, tạo mới
//             cart = new Cart({ customer_id, products: [{ productId, quantity }] });
//             await cart.save();
//         }

//         res.status(201).json(cart);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // API đăng nhập
// app.post('/api/login', async (req, res) => {
//     const { name, password } = req.body;

//     try {
//         const customer = await Customer.findOne({ Name: name });
//         if (!customer) {
//             return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
//         }

//         // So sánh mật khẩu đã hash
//         const isPasswordValid = await bcrypt.compare(password, customer.Password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
//         }

//         res.status(200).json({ message: 'Đăng nhập thành công', customer: { Name: customer.Name } });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// // API để kiểm tra tên và email người dùng đã tồn tại hay chưa
// app.post('/api/check-user', async (req, res) => {
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
// });

// // API để đăng ký
// app.post('/api/register', async (req, res) => {
//     const { name, email, phone, address, password } = req.body;

//     try {
//         const existingCustomer = await Customer.findOne({ Email: email });
//         if (existingCustomer) {
//             return res.status(400).json({ message: 'Email đã được sử dụng. Vui lòng chọn email khác.' });
//         }

//         // Hash mật khẩu trước khi lưu
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         const newCustomer = new Customer({
//             Name: name,
//             Email: email,
//             Phone: phone,
//             Address: address,
//             Password: hashedPassword, // Lưu mật khẩu đã hash
//         });

//         await newCustomer.save();
//         res.status(201).json({ message: 'Tài khoản đã được tạo thành công! Bạn có thể đăng nhập.' });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });


// // Hàm gửi email xác nhận qua EmailJS
// const sendVerificationEmail = async (email, verificationCode) => {
//     const emailjs = require('emailjs-com');

//     const templateParams = {
//         to_email: email,
//         verification_code: verificationCode,
//     };

//     return emailjs.send('service_wgo5m5a', 'template_duq3z3e', templateParams, '7oV_vV7xwhrwQvsb9'); // Thay 'user_your_user_id' bằng user ID của bạn từ EmailJS
// };

// // API để xác minh mã
// app.post('/api/verify', async (req, res) => {
//     const { email, verificationCode } = req.body;

//     try {
//         const customer = await Customer.findOne({ Email: email });

//         if (!customer) {
//             return res.status(404).json({ message: 'Người dùng không tồn tại.' });
//         }

//         if (customer.VerificationCode !== verificationCode) {
//             return res.status(400).json({ message: 'Mã xác nhận không chính xác.' });
//         }

//         // Nếu mã xác nhận đúng, lưu tài khoản vào cơ sở dữ liệu
//         customer.VerificationCode = undefined; // Xóa mã xác nhận
//         await customer.save(); // Cập nhật thông tin khách hàng

//         res.status(200).json({ message: 'Đăng ký thành công! Bạn có thể đăng nhập.' });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// //API đăng nhập ADMIN
// app.post('/api/admin/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const admin = await Admin.findOne({ username: username });
//         if (!admin) {
//             return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
//         }

//         // So sánh mật khẩu đã hash
//         const isPasswordValid = await bcrypt.compare(password, admin.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
//         }

//         res.status(200).json({ message: 'Đăng nhập thành công', admin: { Name: admin.username } });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API tạo hóa đơn
// app.post('/api/orders', async (req, res) => {
//     const { user, products, totalPrice, method, status } = req.body;

//     if (!user || !products || !totalPrice) {
//         return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const newOrder = new Order({
//         user,
//         products,
//         totalPrice,
//         method,
//         status
//     });

//     try {
//         // Lưu đơn hàng
//         await newOrder.save();

//         // Cập nhật số lượng tồn kho
//         for (const product of products) {
//             await Product.findByIdAndUpdate(
//                 product.productId,
//                 { $inc: { Stock: -product.quantity } },
//                 { new: true }
//             );
//         }

//         res.status(201).json({ message: 'Order created successfully', orderId: newOrder._id });
//     } catch (err) {
//         console.error("Error creating order or updating stock:", err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // API lịch sử hóa đơn theo tên người dùng
// app.get('/api/orders/name/:name', async (req, res) => {
//     try {
//         const orders = await Order.find({ 'user.Name': req.params.name }).populate('products.productId');
//         res.json(orders);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API để lấy tất cả đơn hàng trang admin
// app.get('/api/adminorders', async (req, res) => {
//     try {
//         const orders = await Order.find().populate('products.productId');
//         res.json(orders);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API để lấy danh sách tất cả khách hàng
// app.get('/api/customers', async (req, res) => {
//     try {
//         const customers = await Customer.find();
//         res.json(customers);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API để hủy đơn hàng
// app.put('/api/orders/:id', async (req, res) => {
//     const { status } = req.body;
//     try {
//         const order = await Order.findById(req.params.id);
//         if (!order) {
//             return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
//         }

//         // Cập nhật số lượng hàng trong kho
//         for (const product of order.products) {
//             await Product.findByIdAndUpdate(
//                 product.productId,
//                 { $inc: { Stock: product.quantity } }, // Cộng số lượng sản phẩm vào kho
//                 { new: true }
//             );
//         }

//         // Cập nhật trạng thái đơn hàng thành 'Đơn hàng đã hủy'
//         order.status = status || 'Đơn hàng đã hủy';
//         await order.save();

//         res.json(order);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // API để xác nhận đơn hàng
// app.put('/api/orders/confirm/:id', async (req, res) => {
//     try {
//         const updatedOrder = await Order.findByIdAndUpdate(
//             req.params.id,
//             { status: 'Đã được xác nhận' },
//             { new: true }
//         );
//         if (!updatedOrder) {
//             return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
//         }
//         res.json(updatedOrder);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
