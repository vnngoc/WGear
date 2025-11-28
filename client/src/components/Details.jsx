import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Menu from '../components/Menu';

const Details = () => {
    return (
        <div>
            <Header />
            <Menu />
            <h1>Trang Chi Tiết</h1>
            <p>Đây là trang chi tiết!</p>
            <Link to="/">Quay Lại Trang Chủ</Link>
        </div>
    );
};

export default Details;