import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import ForgotPasswordPage from './pages/forgot-password.jsx';
import ProfilePage from './pages/profile.jsx';
import ProductDetailPage from './pages/product-detail.jsx';
import AddProductPage from './pages/add-product.jsx';
import AddCategoryPage from './pages/add-category.jsx';
import CategoryProductsPage from './pages/category-products.jsx';
import CartPage from './pages/cart.jsx';
import CheckoutPage from './pages/checkout.jsx';
import OrdersPage from './pages/orders.jsx';
import OrderDetailPage from './pages/order-detail.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';
import AdminLayout from './components/layout/admin-layout.jsx';
import {
    AdminDashboardPage,
    AdminProductsPage,
    AdminCategoriesPage,
    AdminOrdersPage,
    AdminUsersPage,
    AdminVouchersPage,
    AdminInventoryPage,
    AdminReviewsPage
} from './pages/admin/index.js';
import { Provider } from 'react-redux';
import store from './Redux/store.js';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "user",
                element: <UserPage />
            },
            {
                path: "product/:productId",
                element: <ProductDetailPage />
            },
            {
                path: "add-product",
                element: <AddProductPage />
            },
            {
                path: "add-category",
                element: <AddCategoryPage />
            },
            {
                path: "category/:categorySlug",
                element: <CategoryProductsPage />
            },
            {
                path: "category",
                element: <CategoryProductsPage />
            },
            {
                path: "cart",
                element: <CartPage />
            },
            {
                path: "checkout",
                element: <CheckoutPage />
            },
            {
                path: "orders",
                element: <OrdersPage />
            },
            {
                path: "orders/:orderId",
                element: <OrderDetailPage />
            },
            {
                path: "profile",
                element: <ProfilePage />
            },
        ]
    },
    {
        path: "/admin",
        element: <AdminRoute />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <AdminDashboardPage /> },
                    { path: "products", element: <AdminProductsPage /> },
                    { path: "categories", element: <AdminCategoriesPage /> },
                    { path: "orders", element: <AdminOrdersPage /> },
                    { path: "users", element: <AdminUsersPage /> },
                    { path: "vouchers", element: <AdminVouchersPage /> },
                    { path: "inventory", element: <AdminInventoryPage /> },
                    { path: "reviews", element: <AdminReviewsPage /> }
                ]
            }
        ]
    },
    {
        path: "register",
        element: <RegisterPage />
    },
    {
        path: "login",
        element: <LoginPage />
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />
    },
    
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>,
)
