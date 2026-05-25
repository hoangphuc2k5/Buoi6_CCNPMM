import React, { useEffect, useState } from "react";
import { Badge, Card, Descriptions, Modal, Select, Table, Tag, message } from "antd";
import {
  getAdminOrderDetailApi,
  getAdminOrdersApi,
  updateAdminOrderPaymentStatusApi,
  updateAdminOrderStatusApi
} from "../../util/api";

const STATUS_OPTIONS = [
  { value: 1, label: "Đơn mới" },
  { value: 2, label: "Đã xác nhận" },
  { value: 3, label: "Đang xử lý" },
  { value: 4, label: "Đang giao" },
  { value: 5, label: "Hoàn thành" },
  { value: 6, label: "Đã hủy" },
  { value: 7, label: "Yêu cầu hủy" }
];

const PAYMENT_STATUS_OPTIONS = [
  { value: true, label: "Đã thanh toán" },
  { value: false, label: "Chưa thanh toán" }
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAdminOrdersApi();
    if (res?.EC === 0) {
      setOrders(res.DT || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    const res = await updateAdminOrderStatusApi(orderId, { status });
    if (res?.EC === 0) {
      message.success("Cập nhật trạng thái thành công");
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(res.DT || selectedOrder);
      }
    } else {
      message.error(res?.EM || "Không thể cập nhật");
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentStatus) => {
    const res = await updateAdminOrderPaymentStatusApi(orderId, { paymentStatus });
    if (res?.EC === 0) {
      message.success("Cập nhật trạng thái thanh toán thành công");
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(res.DT || selectedOrder);
      }
    } else {
      message.error(res?.EM || "Không thể cập nhật");
    }
  };

  const openDetail = async (orderId) => {
    setDetailOpen(true);
    setDetailLoading(true);
    const res = await getAdminOrderDetailApi(orderId);
    if (res?.EC === 0) {
      setSelectedOrder(res.DT || null);
    } else {
      message.error(res?.EM || "Không thể tải chi tiết đơn hàng");
      setSelectedOrder(null);
    }
    setDetailLoading(false);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedOrder(null);
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "_id" },
    { title: "Khách hàng", render: (record) => record.user?.email || "" },
    { title: "Tổng tiền", dataIndex: "totalPrice" },
    {
      title: "Trạng thái",
      render: (record) => (
        <Select
          value={record.status}
          options={STATUS_OPTIONS}
          onChange={(value) => handleStatusChange(record._id, value)}
        />
      )
    }
  ];

  const itemColumns = [
    { title: "Sản phẩm", dataIndex: "name" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "right"
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "right"
    }
  ];

  const selectedStatusLabel = STATUS_OPTIONS.find(
    (option) => option.value === selectedOrder?.status
  )?.label;

  const selectedPaymentStatusLabel = PAYMENT_STATUS_OPTIONS.find(
    (option) => option.value === selectedOrder?.paymentStatus
  )?.label;

  return (
    <Card title="Quản lý đơn hàng">
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={orders}
        columns={columns}
        onRow={(record) => ({
          onDoubleClick: () => openDetail(record._id)
        })}
      />

      <Modal
        title="Chi tiết đơn hàng"
        open={detailOpen}
        onCancel={closeDetail}
        footer={null}
        width={900}
      >
        {selectedOrder ? (
          <>
            <Descriptions
              bordered
              size="small"
              column={1}
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="Mã đơn">
                {selectedOrder._id}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedOrder.user?.name || selectedOrder.user?.email || ""}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.user?.email || ""}
              </Descriptions.Item>
              <Descriptions.Item label="Tong tien can thanh toan">
                {Number(selectedOrder.totalPrice || 0).toLocaleString("vi-VN")} ₫
              </Descriptions.Item>
              <Descriptions.Item label="Ma giam gia">
                {selectedOrder.voucherCode ? selectedOrder.voucherCode : "Khong ap dung"}
              </Descriptions.Item>
              <Descriptions.Item label="So tien giam">
                {selectedOrder.discountAmount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Phuong thuc thanh toan">
                {selectedOrder.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Trang thai thanh toan">
                <Tag color={selectedOrder.paymentStatus ? "green" : "red"}>
                  {selectedPaymentStatusLabel || ""}
                </Tag>
                <Select
                  value={selectedOrder.paymentStatus}
                  options={PAYMENT_STATUS_OPTIONS}
                  onChange={(value) => handlePaymentStatusChange(selectedOrder._id, value)}
                  style={{ width: 220, marginLeft: 12 }}
                />
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              bordered
              size="small"
              column={1}
              style={{ marginBottom: 16 }}
              title="Thong tin giao hang"
            >
              <Descriptions.Item label="Nguoi nhan">
                {selectedOrder.shippingAddress?.fullName || ""}
              </Descriptions.Item>
              <Descriptions.Item label="So dien thoai">
                {selectedOrder.shippingAddress?.phone || ""}
              </Descriptions.Item>
              <Descriptions.Item label="Dia chi">
                {selectedOrder.shippingAddress?.address || ""}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chu">
                {selectedOrder.shippingAddress?.note || ""}
              </Descriptions.Item>
            </Descriptions>

            <Table
              rowKey={(item) => item.product?._id || item.name}
              size="small"
              pagination={false}
              columns={itemColumns}
              dataSource={selectedOrder.items || []}
              style={{ marginBottom: 16 }}
              title={() => "Danh sach san pham"}
            />

            <Descriptions bordered size="small" column={1} title="Trang thai">
              <Descriptions.Item label="Hien tai">
                <Badge
                  color="#1677ff"
                  text={selectedStatusLabel || ""}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Cap nhat">
                <Select
                  value={selectedOrder.status}
                  options={STATUS_OPTIONS}
                  onChange={(value) => handleStatusChange(selectedOrder._id, value)}
                  style={{ width: 240 }}
                />
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          <div>{detailLoading ? "Dang tai chi tiet..." : "Khong co du lieu"}</div>
        )}
      </Modal>
    </Card>
  );
};

export default AdminOrdersPage;
