import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag, Button, Space, Spin, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getOrdersApi } from '../util/api';

const { Title } = Typography;

const ORDER_STATUS_MAP = {
    1: { text: 'Đơn hàng mới', color: 'blue' },
    2: { text: 'Đã xác nhận', color: 'cyan' },
    3: { text: 'Đang chuẩn bị hàng', color: 'orange' },
    4: { text: 'Đang giao hàng', color: 'purple' },
    5: { text: 'Đã giao thành công', color: 'green' },
    6: { text: 'Đã hủy', color: 'red' },
    7: { text: 'Yêu cầu hủy', color: 'volcano' }
};

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getOrdersApi();
            if (response?.EC === 0) {
                setOrders(response.DT);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <span className="font-mono text-sm">{id.slice(-8).toUpperCase()}</span>,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString('vi-VN'),
        },
        {
            title: 'Số sản phẩm',
            key: 'itemCount',
            render: (_, record) => record.items.reduce((sum, item) => sum + item.quantity, 0),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => (
                <span className="text-red-600 font-bold">
                    {price.toLocaleString('vi-VN')} ₫
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusInfo = ORDER_STATUS_MAP[status];
                return <Tag color={statusInfo?.color || 'default'}>{statusInfo?.text || 'Không xác định'}</Tag>;
            },
        },
        {
            title: 'Phương thức TT',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (method) => (method === 'COD' ? 'COD' : 'Ví điện tử'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/orders/${record._id}`)}
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Title level={2} className="mb-6">Lịch sử đơn hàng</Title>
            
            <Card>
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Spin size="large" />
                    </div>
                ) : orders.length === 0 ? (
                    <Empty description="Bạn chưa có đơn hàng nào" />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} đơn hàng`,
                        }}
                    />
                )}
            </Card>
        </div>
    );
};

export default OrdersPage;
