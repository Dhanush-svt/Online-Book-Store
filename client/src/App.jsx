import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteLayout, SellerLayout, AdminLayout } from "./Components/Layouts";
import PrivateRoute from "./Components/PrivateRoute";

import Home from "./Components/Home";

// User
import Login from "./User/Login";
import Signup from "./User/Signup";
import Uhome from "./User/Uhome";
import Products from "./User/Products";
import Uitem from "./User/Uitem";
import Cart from "./User/Cart";
import MyOrders from "./User/MyOrders";
import Profile from "./User/Profile";

// Seller
import Slogin from "./Seller/Slogin";
import Ssignup from "./Seller/Ssignup";
import Shome from "./Seller/Shome";
import Addbook from "./Seller/Addbook";
import MyProducts from "./Seller/MyProducts";
import Orders from "./Seller/Orders";

// Admin
import Alogin from "./Admin/Alogin";
import Asignup from "./Admin/Asignup";
import Ahome from "./Admin/Ahome";
import Items from "./Admin/items";
import SellerAdmin from "./Admin/Seller";
import Users from "./Admin/Users";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public + user-facing site */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Uitem />} />

          <Route path="/home" element={<PrivateRoute role="user" redirectTo="/login"><Uhome /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute role="user" redirectTo="/login"><Cart /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute role="user" redirectTo="/login"><MyOrders /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute role="user" redirectTo="/login"><Profile /></PrivateRoute>} />
        </Route>

        {/* Seller portal */}
        <Route path="/seller/login" element={<Slogin />} />
        <Route path="/seller/signup" element={<Ssignup />} />
        <Route element={<SellerLayout />}>
          <Route path="/seller/home" element={<PrivateRoute role="seller" redirectTo="/seller/login"><Shome /></PrivateRoute>} />
          <Route path="/seller/add-book" element={<PrivateRoute role="seller" redirectTo="/seller/login"><Addbook /></PrivateRoute>} />
          <Route path="/seller/products" element={<PrivateRoute role="seller" redirectTo="/seller/login"><MyProducts /></PrivateRoute>} />
          <Route path="/seller/orders" element={<PrivateRoute role="seller" redirectTo="/seller/login"><Orders /></PrivateRoute>} />
        </Route>

        {/* Admin portal */}
        <Route path="/admin/login" element={<Alogin />} />
        <Route path="/admin/signup" element={<Asignup />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/home" element={<PrivateRoute role="admin" redirectTo="/admin/login"><Ahome /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute role="admin" redirectTo="/admin/login"><Users /></PrivateRoute>} />
          <Route path="/admin/sellers" element={<PrivateRoute role="admin" redirectTo="/admin/login"><SellerAdmin /></PrivateRoute>} />
          <Route path="/admin/books" element={<PrivateRoute role="admin" redirectTo="/admin/login"><Items /></PrivateRoute>} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
