const Product = require('../models/Product');

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server hoặc ID không hợp lệ" });
    }
};

// Lấy sản phẩm liên quan
exports.getRelatedProducts = async (req, res) => {
    const { name, excludeId } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Missing name query parameter' });
    }

    try {
        const searchKey = name.substring(0, 10);

        const products = await Product.find({
            Name: { $regex: new RegExp(searchKey, 'i') },
            _id: { $ne: excludeId }
        });

        res.json(products || []);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Tìm kiếm sản phẩm
exports.searchProducts = async (req, res) => {
    const { query } = req.query;
    try {
        const products = await Product.find({ Name: { $regex: query, $options: 'i' } });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm sản phẩm
exports.createProduct = async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Sửa sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
        }
        res.json({ message: "Sản phẩm đã bị xóa" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};