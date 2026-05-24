import React from 'react';
import { Table, Button, InputNumber, Space, Card, Typography, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem, removeItemFromCart } from '../Redux/cartSlice';

const { Title, Text } = Typography;

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);

    const handleQuantityChange = (productId, value) => {
        dispatch(updateCartItem({ productId, quantity: value }));
    };

    const handleRemoveItem = (productId) => {
        dispatch(removeItemFromCart(productId));
        message.success('Xóa sản phẩm khỏi giỏ hàng thành công');
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product) => (
                <div className="flex items-center gap-4">
                    {product.images && product.images.length > 0 && (
                        <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-16 h-16 object-cover rounded"
                        />
                    )}
                    <Text strong>{product.name}</Text>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <Text type="danger" strong>
                    {price.toLocaleString('vi-VN')} ₫
                </Text>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    max={record.product?.stock || 999}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(record.product._id, value)}
                />
            ),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (_, record) => (
                <Text type="danger" strong>
                    {(record.price * record.quantity).toLocaleString('vi-VN')} ₫
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.product._id)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    const dataSource = cart?.items?.map((item, index) => ({
        key: index,
        ...item,
    })) || [];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Title level={2} className="mb-6">Giỏ hàng của bạn</Title>
            
            {dataSource.length === 0 ? (
                <Card>
                    <Empty 
                        description="Giỏ hàng của bạn trống"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button type="primary" onClick={() => navigate('/')}>
                            Tiếp tục mua sắm
                        </Button>
                    </Empty>
                </Card>
            ) : (
                <>
                    <Card className="mb-6">
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                        />
                    </Card>
                    
                    <Card className="flex justify-between items-center">
                        <div>
                            <Title level={4} className="mb-0">Tổng tiền:</Title>
                        </div>
                        <div className="flex items-center gap-4">
                            <Title level={2} type="danger" className="mb-0">
                                {cart?.totalPrice?.toLocaleString('vi-VN') || 0} ₫
                            </Title>
                            <Space>
                                <Button onClick={() => navigate('/')}>Tiếp tục mua sắm</Button>
                                <Button 
                                    type="primary" 
                                    size="large"
                                    icon={<ShoppingOutlined />}
                                    onClick={handleCheckout}
                                >
                                    Thanh toán
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default CartPage;
