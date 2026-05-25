import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Radio, message, Space, Divider, List } from 'antd';
import { CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrderApi, validateVoucherApi } from '../util/api';
import { fetchCart } from '../Redux/cartSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading: cartLoading } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [dispatch, isAuthenticated]);

    const handleSubmit = async (values) => {
        if (cartLoading) {
            message.warning('Đang tải giỏ hàng, vui lòng thử lại');
            return;
        }

        if (!cart?.items?.length) {
            message.error('Giỏ hàng trống');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                paymentMethod,
                voucherCode: appliedVoucher?.code || '',
                shippingAddress: {
                    fullName: values.fullName,
                    phone: values.phone,
                    address: values.address,
                    note: values.note || ''
                }
            };

            const response = await createOrderApi(orderData);
            if (response?.EC === 0) {
                message.success('Đặt hàng thành công!');
                dispatch(fetchCart());
                navigate(`/orders/${response.DT._id}`);
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) {
            message.warning('Vui long nhap ma giam gia');
            return;
        }
        setVoucherLoading(true);
        const res = await validateVoucherApi(voucherCode.trim());
        if (res?.EC === 0) {
            setAppliedVoucher({ code: res.DT.code });
            setDiscountAmount(res.DT.discountAmount || 0);
            message.success('Ap dung ma giam gia thanh cong');
        } else {
            setAppliedVoucher(null);
            setDiscountAmount(0);
            message.error(res?.EM || 'Khong the ap dung ma giam gia');
        }
        setVoucherLoading(false);
    };

    const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const originalTotal = cart?.totalPrice || 0;
    const finalTotal = Math.max(originalTotal - discountAmount, 0);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Title level={2} className="mb-6">Thanh toán</Title>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Thông tin giao hàng" className="mb-6">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                label="Họ và tên"
                                name="fullName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                            >
                                <TextArea rows={3} placeholder="Nhập địa chỉ giao hàng" />
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú"
                                name="note"
                            >
                                <TextArea rows={2} placeholder="Ghi chú cho đơn hàng (tùy chọn)" />
                            </Form.Item>

                            <Card title="Phương thức thanh toán" className="mb-6">
                                <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <Space direction="vertical" className="w-full">
                                        <Radio value="COD">
                                            <div className="flex items-center gap-2">
                                                <CheckCircleOutlined />
                                                <span>Thanh toán khi nhận hàng (COD)</span>
                                            </div>
                                        </Radio>
                                        <Radio value="EWALLET">
                                            <div className="flex items-center gap-2">
                                                <CreditCardOutlined />
                                                <span>Thanh toán qua ví điện tử</span>
                                            </div>
                                        </Radio>
                                    </Space>
                                </Radio.Group>
                            </Card>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                >
                                    Đặt hàng
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>

                <div>
                    <Card title="Đơn hàng của bạn">
                        <List
                            dataSource={cart?.items || []}
                            renderItem={(item) => (
                                <List.Item>
                                    <div className="flex justify-between w-full">
                                        <div>
                                            <Text strong>{item.product.name}</Text>
                                            <br />
                                            <Text type="secondary">x {item.quantity}</Text>
                                        </div>
                                        <Text type="danger" strong>
                                            {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                        </Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                        
                        <Divider />

                        <div className="mb-4">
                            <Text strong>Ma giam gia</Text>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    placeholder="Nhap ma giam gia"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                />
                                <Button
                                    type="primary"
                                    onClick={handleApplyVoucher}
                                    loading={voucherLoading}
                                >
                                    Ap dung
                                </Button>
                            </div>
                            {appliedVoucher ? (
                                <Text type="success">Da ap dung: {appliedVoucher.code}</Text>
                            ) : null}
                        </div>
                        
                        <div className="flex justify-between mb-2">
                            <Text>Tổng số sản phẩm:</Text>
                            <Text>{totalItems} sản phẩm</Text>
                        </div>
                        
                        <div className="flex justify-between mb-2">
                            <Text>Giam gia:</Text>
                            <Text type="success">-{discountAmount.toLocaleString('vi-VN')} ₫</Text>
                        </div>

                        <div className="flex justify-between">
                            <Title level={4} className="mb-0">Tong tien:</Title>
                            <Title level={4} type="danger" className="mb-0">
                                {finalTotal.toLocaleString('vi-VN')} ₫
                            </Title>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
