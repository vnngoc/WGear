import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const handleUserNameClick = () => {
        if (user) {
            navigate('/orders');
        }
    };

    return (
        <header>
            <nav>
                <ul>
                    <div className="header-logo">
                        <a href="/">
                            <img src="https://file.hstatic.net/200000837185/file/logo-web-white-2_d77f90f6d67c47bea3c129624300ba8f.png" alt="Logo" />
                        </a>
                    </div>
                    <form onSubmit={handleSearchSubmit} className="headersearch-form">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button type="submit">Tìm</button>
                    </form>
                    <div className="header-cart">
                        <a href="/cart">
                            <img src="https://img.icons8.com/?size=100&id=59997&format=png&color=FFFFFF" alt="Cart" />
                        </a>
                    </div>
                    <div className="header-user">
                        {user ? (
                            <>
                                <span onClick={handleUserNameClick} className="user-name">
                                    {user.Name}
                                </span>
                                <div className="user-menu">
                                    <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
                                </div>
                            </>
                        ) : (
                            <a href="/login">
                                <img src="https://img.icons8.com/?size=100&id=85356&format=png&color=FFFFFF" alt="Login" />
                            </a>
                        )}
                    </div>
                </ul>
            </nav>
        </header>
    );
};

export default Header;