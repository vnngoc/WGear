import React from 'react';
import Header from './Header';
import Menu from './Menu';
import '../css/Home.css';
import ProductList from './ProductList';
import Footer from './Footer';

const Home = () => {
    return (
        <div>
            <Header />
            <Menu />
            <div className="home-thumbnail">
                <img src="https://global-uploads.webflow.com/60af8c708c6f35480d067652/61d1b96ac77bbfa4c23b89a1_screenshot_1641134415.png" alt="Ad"/>
            </div>
            <h1 className="home-h1">SẢN PHẨM</h1>
            <ProductList />
            <Footer />
        </div>
    );
};

export default Home;