const mongoose = require('mongoose');
const Category = require('../models/Category');

// Lấy danh sách category
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm category
exports.createCategory = async (req, res) => {
    const newCategory = new Category({ Type: req.body.Type });
    try {
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Sửa category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, { Type: req.body.Type }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category không tìm thấy" });
        }
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa category
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category không tìm thấy" });
        }
        res.json({ message: "Category đã bị xóa" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};