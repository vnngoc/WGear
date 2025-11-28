const Order = require('../models/Order');
const Product = require('../models/Product');

// Tạo hóa đơn
exports.createOrder = async (req, res) => {
    const { user, products, totalPrice, method, status } = req.body;

    if (!user || !products || !totalPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = new Order({
        user,
        products,
        totalPrice,
        method,
        status
    });

    try {
        await newOrder.save();

        // Cập nhật số lượng tồn kho
        for (const product of products) {
            await Product.findByIdAndUpdate(
                product.productId,
                { $inc: { Stock: -product.quantity } },
                { new: true }
            );
        }

        res.status(201).json({ message: 'Order created successfully', orderId: newOrder._id });
    } catch (err) {
        console.error("Error creating order or updating stock:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Lấy lịch sử hóa đơn theo tên người dùng
exports.getOrdersByName = async (req, res) => {
    try {
        const orders = await Order.find({ 'user.Name': req.params.name }).populate('products.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy tất cả đơn hàng (admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
        }

        // Cập nhật số lượng hàng trong kho
        for (const product of order.products) {
            await Product.findByIdAndUpdate(
                product.productId,
                { $inc: { Stock: product.quantity } },
                { new: true }
            );
        }

        order.status = status || 'Đơn hàng đã hủy';
        await order.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Xác nhận đơn hàng
exports.confirmOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: 'Đã được xác nhận' },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
        }
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};