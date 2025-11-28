import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../css/ProductDetail.css';
import Header from '../components/Header';
import Menu from '../components/Menu';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/product/${id}`);
                setProduct(res.data);
    
                const relatedRes = await axios.get(
                    `http://localhost:5000/api/products/related?name=${encodeURIComponent(res.data.Name)}&excludeId=${id}`
                );
    
                // Giới hạn danh sách chỉ lấy 3 sản phẩm liên quan
                setRelatedProducts((relatedRes.data || []).slice(0, 3));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleIncrease = () => {
        if (quantity < product.Stock) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (quantity > product.Stock) {
            setNotification(`Chỉ còn ${product.Stock} sản phẩm trong kho!`);
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.productId === product._id);
    
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ 
                productId: product._id, 
                productName: product.Name, 
                price: product.Price, 
                image: product.Img,   
                quantity: quantity 
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        setNotification(`Thêm ${quantity} ${product.Name} vào giỏ hàng thành công!`);

        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="product-detail-container">
            <Header />
            <Menu />
            {notification && (
                <div className="notification">{notification}</div>
            )}
            <div className="product-detail">
                <div className="product-info">
                    <div className="image-container">
                        <img src={`${process.env.PUBLIC_URL}/${product.Img}`} alt={product.Name} />
                    </div>
                    <div className="details-container">
                        <h1 className="product-title">{product.Name}</h1>
                        <p className="product-description">{product.Description}</p>
                        <p className="product-price">Giá: {product.Price.toLocaleString()} VNĐ</p>
                        <p className="product-stock">Tồn kho: {product.Stock} sản phẩm</p>

                        <div className="quantity-control">
                            <button className="quantity-button" onClick={handleDecrease}>-</button>
                            <span className="quantity">{quantity}</span>
                            <button className="quantity-button" onClick={handleIncrease}>+</button>
                        </div>
                        <button 
                            className="add-to-cart-button" 
                            onClick={handleAddToCart}
                            disabled={product.Stock === 0}  // Disable button if stock is 0
                        >
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>

                <h2 className="related-products-title">Sản phẩm liên quan</h2>
                <div className="related-products">
                    {relatedProducts.length > 0 ? (
                        relatedProducts.map(relatedProduct => (
                            <div className="related-product-item" key={relatedProduct._id}>
                            <Link to={`/product/${relatedProduct._id}`}>
                            <img 
                                src={`${process.env.PUBLIC_URL}/${relatedProduct.Img}`} 
                                alt={relatedProduct.Name} 
                                className="related-product-img" 
                            />
                            <h3 className="related-product-name">{relatedProduct.Name}</h3>
                            <p className="related-product-price">{relatedProduct.Price.toLocaleString()} VNĐ</p>
                            </Link>
                </div>
        ))
    ) : (
        <p className="no-related-products">Không có sản phẩm liên quan.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;
