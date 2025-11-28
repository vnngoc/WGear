import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import '../css/ProductList.css';
import Header from './Header';
import Menu from './Menu';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const query = new URLSearchParams(useLocation().search).get('query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/search?query=${query}`);
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query]);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Header />
            <Menu />
            <div className="pl-product-list">
                <h2>Kết quả tìm kiếm cho: "{query}"</h2>
                <ul>
                    {products.length > 0 ? (
                        products.map(product => (
                            <li key={product._id} className="pl-product-list-item">
                                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                    <img src={`${process.env.PUBLIC_URL}/${product.Img}`} alt={product.Name} />
                                    <h4 className="product-name">{product.Name}</h4>
                                </Link>
                                <div className="pl-priceandbutton">
                                    <div className="priceproduct">{formatPrice(product.Price)}</div>
                                    <div className="pl-button-group">
                                        <button className="pl-btn-add-to-cart">Thêm vào giỏ hàng</button>
                                        <button className="pl-btn-buy-now">Mua ngay</button>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div>Không tìm thấy sản phẩm nào.</div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SearchResults;