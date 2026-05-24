import React, { useEffect, useState } from "react";
import { Button, Card, Select, Table, message } from "antd";
import { getAdminOrdersApi, updateAdminOrderStatusApi } from "../../util/api";

const STATUS_OPTIONS = [
  { value: 1, label: "Đơn mới" },
  { value: 2, label: "Đã xác nhận" },
  { value: 3, label: "Đang xử lý" },
  { value: 4, label: "Đang giao" },
  { value: 5, label: "Hoàn thành" },
  { value: 6, label: "Đã hủy" },
  { value: 7, label: "Yêu cầu hủy" }
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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
    } else {
      message.error(res?.EM || "Không thể cập nhật");
    }
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

  return (
    <Card title="Quản lý đơn hàng">
      <Table rowKey="_id" loading={loading} dataSource={orders} columns={columns} />
    </Card>
  );
};

export default AdminOrdersPage;
