import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Menu from '../components/Menu';
import '../css/Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setSelectedProducts(storedCart);
    }, []);

    const handleRemoveFromCart = (productId) => {
        const updatedCart = selectedProducts.filter(item => item.productId !== productId);
        setSelectedProducts(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleIncreaseQuantity = (productId) => {
        const updatedCart = selectedProducts.map(item => {
            if (item.productId === productId) {
                axios.get(`http://localhost:5000/api/product/${item.productId}`)
                    .then(res => {
                        const stock = res.data.Stock;
                        if (item.quantity < stock) {
                            item.quantity += 1;
                        } else {
                            alert(`Sản phẩm này chỉ còn ${stock} trong kho.`);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching stock:', error);
                    });
            }
            return item;
        });
        
        setSelectedProducts(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleDecreaseQuantity = (productId) => {
        const updatedCart = selectedProducts.map(item => {
            if (item.productId === productId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setSelectedProducts(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const totalMoney = (items) => {
        return items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    const handlePayment = async (isCashOnDelivery = false) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert("Bạn cần đăng nhập để thực hiện thanh toán.");
            navigate('/login');
            return;
        }
    
        try {
            if (selectedProducts.length === 0) {
                alert("Giỏ hàng của bạn trống. Không thể thanh toán.");
                return;
            }
    
            const total = totalMoney(selectedProducts);
            if (total < 5000 || total >= 1000000000) {
                alert("Số tiền giao dịch không hợp lệ.");
                return;
            }
    
            const orderData = {
                user: {
                    ...JSON.parse(storedUser),
                    name: customerName,
                    address: customerAddress,
                },
                products: selectedProducts.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    name: item.productName,
                    price: item.price
                })),
                totalPrice: total,
                method: isCashOnDelivery ? 'Thanh toán sau khi nhận hàng' : 'Thanh toán qua ngân hàng',
                status: isCashOnDelivery ? 'Chưa được xác nhận' : 'Đã được xác nhận',
            };
    
            if (isCashOnDelivery) {
                await axios.post('http://localhost:5000/api/orders', orderData);
                alert('Đặt hàng thành công!');
                setSelectedProducts([]);
                localStorage.removeItem('cart');
                navigate('/orders');
            } else {
                const paymentResponse = await axios.post("http://localhost:5000/api/v1/vnpay/create_payment_url", {
                    amount: total,
                    language: "vn",
                });
    
                if (paymentResponse.status === 200 && paymentResponse.data) {
                    await axios.post('http://localhost:5000/api/orders', orderData);
                    alert('Đang chuyển đến trang thanh toán...');
                    setSelectedProducts([]);
                    localStorage.removeItem('cart');
                    window.location.href = paymentResponse.data;
                }
            }
        } catch (error) {
            console.error('Lỗi trong quá trình thanh toán:', error);
            alert(`LỖI: ${error.message}`);
        }
    };

    return (
        <div>
            <Header />
            <Menu />
            <h1 className="giohang">Giỏ hàng</h1>
            {selectedProducts.length === 0 ? (
                <p className="giohang">Giỏ hàng của bạn trống.</p>
            ) : (
                <div className="cart-container">
                    <div className="cart-items">
                        {selectedProducts.map(item => (
                            <div key={item.productId} className="cart-item">
                                <img src={`/${item.image}`} alt={item.productName} />
                                <div className="cart-item-details">
                                    <h3>{item.productName}</h3>
                                    <p>Giá: {item.price.toLocaleString("vi-VN")} VNĐ</p>
                                    <div className="quantity-control">
                                        <button className="quantity-button" onClick={() => handleDecreaseQuantity(item.productId)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button className="quantity-button" onClick={() => handleIncreaseQuantity(item.productId)}>+</button>
                                    </div>
                                    <button className="remove-button" onClick={() => handleRemoveFromCart(item.productId)}>Xóa</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Tổng tiền: {totalMoney(selectedProducts).toLocaleString("vi-VN")} VNĐ</h2>
                        <input 
                            type="text" 
                            placeholder="Họ tên" 
                            value={customerName} 
                            onChange={(e) => setCustomerName(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Địa chỉ" 
                            value={customerAddress} 
                            onChange={(e) => setCustomerAddress(e.target.value)} 
                        />
                        <button className="checkout-button" onClick={() => handlePayment()}>Thanh toán qua ngân hàng</button>
                        <button className="checkout-button" onClick={() => handlePayment(true)}>Thanh toán sau khi nhận hàng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;