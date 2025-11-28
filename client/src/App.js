import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Home from './components/Home';
import Details from './components/Details';
import Login from './components/Login';
import Cart from './components/Cart';
import Register from './components/Register';
import AdminCategory from './components/AdminCategory';
import AdminProductList from './components/AdminProductList';
import SearchResults from './components/SearchResults';
import LaptopProductList from './components/LaptopProductList';
import GearProductList from './components/GearProductList';
import PkbgProductList from './components/PkbgProductList';
import LinhkienProductList from './components/LinhkienProductList';
import ManhinhProductList from './components/ManhinhProductList';
import AdminHome from './components/AdminHome';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentSuccess from './components/PaymentSuccess';
import OrderHistory from './components/OrderHistory';
import AdminOrderHistory from './components/AdminOrderHistory';
import AdminCustomerList from './components/AdminCustomerList';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* User routes */}
                <Route path="/" element={<Home />} />
                <Route path="/details" element={<Details />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/register" element={<Register />} />
                <Route path="/productlist" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/laptop" element={<LaptopProductList />}/>
                <Route path="/manhinh"  element={<ManhinhProductList />}/>
                <Route path="/gear"  element={<GearProductList />}/>
                <Route path="/linhkien"  element={<LinhkienProductList />}/>
                <Route path="/phukienbanghe"  element={<PkbgProductList />}/>
                <Route path="/search" element={<SearchResults />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/orders" element={<OrderHistory />} />

                {/* Admin routes */}
                <Route path="/admin" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
                <Route path="/admin/admincategory" element={<ProtectedRoute><AdminCategory /></ProtectedRoute>}/>
                <Route path="/admin/adminproductlist" element={<ProtectedRoute><AdminProductList /></ProtectedRoute>}/>
                <Route path="/admin/adminorderhistory" element={<ProtectedRoute><AdminOrderHistory /></ProtectedRoute>}/>
                <Route path="/admin/admincustomerlist" element={<ProtectedRoute><AdminCustomerList /></ProtectedRoute>}/>
            </Routes>
        </Router>
    );
};

export default App;
