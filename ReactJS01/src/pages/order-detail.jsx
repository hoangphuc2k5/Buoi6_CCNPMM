import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, List, Tag, Steps, Divider, Space, Modal, Input, message, Spin, Descriptions, Image } from 'antd';
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getOrderDetailApi, cancelOrderApi } from '../util/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ORDER_STATUS_MAP = {
    1: { text: 'Đơn hàng mới', color: 'blue', description: 'Đơn hàng của bạn đã được tạo' },
    2: { text: 'Đã xác nhận', color: 'cyan', description: 'Đơn hàng đã được xác nhận' },
    3: { text: 'Đang chuẩn bị hàng', color: 'orange', description: 'Shop đang chuẩn bị hàng cho bạn' },
    4: { text: 'Đang giao hàng', color: 'purple', description: 'Đơn hàng đang trên đường đến bạn' },
    5: { text: 'Đã giao thành công', color: 'green', description: 'Đơn hàng đã được giao thành công' },
    6: { text: 'Đã hủy', color: 'red', description: 'Đơn hàng đã bị hủy' },
    7: { text: 'Yêu cầu hủy', color: 'volcano', description: 'Yêu cầu hủy đơn hàng đang được xử lý' }
};

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [canceling, setCanceling] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            const response = await getOrderDetailApi(orderId);
                if (response?.EC === 0) {
                    setOrder(response.DT);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            message.warning('Vui lòng nhập lý do hủy đơn hàng');
            return;
        }

        setCanceling(true);
        try {
            const response = await cancelOrderApi(orderId, cancelReason);
                if (response?.EC === 0 || response?.EC === 2) {
                    message.success(response?.EM || 'Thao tác thành công');
                setCancelModalVisible(false);
                fetchOrderDetail();
            } else {
                    message.error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra');
        } finally {
            setCanceling(false);
        }
    };

    const canCancel = order && (order.status === 1 || order.status === 2);
    const canRequestCancel = order && order.status === 3;
    const statusInfo = order ? ORDER_STATUS_MAP[order.status] : null;

    const getSteps = () => {
        const allSteps = [
            { title: 'Đơn hàng mới', status: 1 },
            { title: 'Đã xác nhận', status: 2 },
            { title: 'Chuẩn bị hàng', status: 3 },
            { title: 'Đang giao hàng', status: 4 },
            { title: 'Hoàn thành', status: 5 }
        ];

        if (!order) return allSteps;

        if (order.status === 6 || order.status === 7) {
            return allSteps.slice(0, Math.max(1, order.statusHistory.length));
        }

        return allSteps;
    };

    const getCurrentStep = () => {
        if (!order) return 0;
        if (order.status === 6 || order.status === 7) return Math.max(0, order.statusHistory.length - 2);
        return Math.min(order.status - 1, 4);
    };

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex justify-center items-center min-h-[60vh]">
                <Spin size="large" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <Title level={2}>Không tìm thấy đơn hàng</Title>
                <Button onClick={() => navigate('/orders')} icon={<ArrowLeftOutlined />}>
                    Quay lại đơn hàng
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button onClick={() => navigate('/orders')} icon={<ArrowLeftOutlined />} className="mb-6">
                Quay lại đơn hàng
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title={`Đơn hàng #${order._id.slice(-8).toUpperCase()}`} className="mb-6">
                        <div className="mb-6">
                            <Space>
                                <Tag color={statusInfo?.color} className="text-base px-4 py-1">
                                    {statusInfo?.text}
                                </Tag>
                                <Text type="secondary">
                                    Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                                </Text>
                            </Space>
                        </div>

                        <div className="mb-6">
                            <Title level={4}>Trạng thái đơn hàng</Title>
                            <Steps
                                direction="vertical"
                                size="small"
                                current={getCurrentStep()}
                                items={getSteps()}
                                status={order.status === 6 || order.status === 7 ? 'error' : 'process'}
                            />
                            
                            <Divider />
                            
                            <Title level={5}>Lịch sử trạng thái</Title>
                            <List
                                dataSource={order.statusHistory}
                                renderItem={(item) => (
                                    <List.Item>
                                        <div className="flex justify-between w-full">
                                            <div>
                                                <Tag color={ORDER_STATUS_MAP[item.status]?.color}>
                                                    {ORDER_STATUS_MAP[item.status]?.text}
                                                </Tag>
                                                {item.note && <Paragraph className="mb-0 mt-1">{item.note}</Paragraph>}
                                            </div>
                                            <Text type="secondary">
                                                {new Date(item.timestamp).toLocaleString('vi-VN')}
                                            </Text>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>

                        {(canCancel || canRequestCancel) && (
                            <Button
                                type="primary"
                                danger
                                onClick={() => setCancelModalVisible(true)}
                            >
                                {canRequestCancel ? 'Yêu cầu hủy đơn hàng' : 'Hủy đơn hàng'}
                            </Button>
                        )}
                    </Card>

                    <Card title="Sản phẩm">
                        <List
                            dataSource={order.items}
                            renderItem={(item) => (
                                <List.Item>
                                    <div className="flex items-center gap-4 w-full">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                className="object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <Text strong>{item.name}</Text>
                                            <br />
                                            <Text type="secondary">Số lượng: {item.quantity}</Text>
                                        </div>
                                        <Text type="danger" strong>
                                            {item.price.toLocaleString('vi-VN')} ₫
                                        </Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>

                <div>
                    <Card title="Thông tin giao hàng" className="mb-6">
                        <Descriptions column={1}>
                            <Descriptions.Item label="Họ tên">{order.shippingAddress.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{order.shippingAddress.phone}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">{order.shippingAddress.address}</Descriptions.Item>
                            {order.shippingAddress.note && (
                                <Descriptions.Item label="Ghi chú">{order.shippingAddress.note}</Descriptions.Item>
                            )}
                        </Descriptions>
                    </Card>

                    <Card title="Thông tin thanh toán">
                        <Descriptions column={1}>
                            <Descriptions.Item label="Phương thức">
                                {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Ví điện tử'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={order.paymentStatus ? 'green' : 'orange'}>
                                    {order.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Text>Tạm tính:</Text>
                                <Text>{order.totalPrice.toLocaleString('vi-VN')} ₫</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text>Phí vận chuyển:</Text>
                                <Text>0 ₫</Text>
                            </div>
                            <Divider className="my-2" />
                            <div className="flex justify-between">
                                <Text strong className="text-lg">Tổng cộng:</Text>
                                <Text type="danger" strong className="text-lg">
                                    {order.totalPrice.toLocaleString('vi-VN')} ₫
                                </Text>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal
                title={
                    <Space>
                        <ExclamationCircleOutlined className="text-red-500" />
                        {canRequestCancel ? 'Yêu cầu hủy đơn hàng' : 'Hủy đơn hàng'}
                    </Space>
                }
                open={cancelModalVisible}
                onOk={handleCancelOrder}
                onCancel={() => setCancelModalVisible(false)}
                confirmLoading={canceling}
                okText="Xác nhận"
                cancelText="Đóng"
                okButtonProps={{ danger: true }}
            >
                <Paragraph>
                    {canRequestCancel 
                        ? 'Bạn chắc chắn muốn yêu cầu hủy đơn hàng này?'
                        : 'Bạn chắc chắn muốn hủy đơn hàng này?'
                    }
                </Paragraph>
                <TextArea
                    rows={4}
                    placeholder="Nhập lý do hủy đơn hàng"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default OrderDetailPage;
