import React, { useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Menu, Badge } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/authSlice';

const Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    
    const cartItemCount = cart?.items?.reduce((count, item) => count + item.quantity, 0) || 0;
    
    const items = [
        {
            label: <Link to={"/"}>Home Page</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        ...(isAuthenticated ? [{
            label: <Link to={"/user"}>Users</Link>,
            key: 'user',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(isAuthenticated ? [{
            label: <Link to={"/cart"}>Giỏ hàng</Link>,
            key: 'cart',
            icon: <Badge count={cartItemCount} size="small"><ShoppingCartOutlined /></Badge>,
        }] : []),
        ...(isAuthenticated ? [{
            label: <Link to={"/orders"}>Đơn hàng</Link>,
            key: 'orders',
            icon: <ShoppingOutlined />,
        }] : []),

        {
            label: `Welcome ${user?.email ?? ""}`,
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                ...(isAuthenticated ? [
                    {
                        label: <Link to={"/profile"}>Hồ sơ</Link>,
                        key: 'profile',
                    },
                    {
                        label: 'Đăng xuất',
                        key: 'logout',
                    }
                ] : [
                    {
                        label: <Link to={"/login"}>Đăng nhập</Link>,
                        key: 'login',
                    }
                ]),
            ],
        },
    ];

    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        if (e.key === 'logout') {
            dispatch(logout());
            setCurrent('home');
            navigate('/');
            return;
        }
        setCurrent(e.key);
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default Header;
