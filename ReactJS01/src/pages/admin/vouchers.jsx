import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, InputNumber, Modal, Select, Switch, Table, message } from "antd";
import { createAdminVoucherApi, deleteAdminVoucherApi, getAdminVouchersApi, updateAdminVoucherApi } from "../../util/api";

const AdminVouchersPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchVouchers = async () => {
    setLoading(true);
    const res = await getAdminVouchersApi();
    if (res?.EC === 0) {
      setVouchers(res.DT || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    const res = await deleteAdminVoucherApi(record._id);
    if (res?.EC === 0) {
      message.success("Xóa voucher thành công");
      fetchVouchers();
    }
  };

  const onFinish = async (values) => {
    let res;
    if (editing) {
      res = await updateAdminVoucherApi(editing._id, values);
    } else {
      res = await createAdminVoucherApi(values);
    }

    if (res?.EC === 0) {
      message.success("Lưu voucher thành công");
      setModalOpen(false);
      fetchVouchers();
    }
  };

  const columns = [
    { title: "Mã", dataIndex: "code" },
    { title: "Loại", dataIndex: "type" },
    { title: "Giá trị", dataIndex: "value" },
    { title: "Trạng thái", render: (record) => (record.isActive ? "Đang bật" : "Tắt") },
    {
      title: "Thao tác",
      render: (record) => (
        <>
          <Button size="small" onClick={() => openEdit(record)}>Sửa</Button>
          <Button size="small" danger onClick={() => handleDelete(record)} style={{ marginLeft: 8 }}>
            Xóa
          </Button>
        </>
      )
    }
  ];

  return (
    <Card title="Quản lý khuyến mãi" extra={<Button onClick={openCreate}>Thêm mã giảm giá</Button>}>
      <Table rowKey="_id" loading={loading} dataSource={vouchers} columns={columns} />

      <Modal
        title={editing ? "Cập nhật voucher" : "Thêm voucher"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="code" label="Mã" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select options={[{ value: "percent", label: "Phần trăm" }, { value: "fixed", label: "Cố định" }]} />
          </Form.Item>
          <Form.Item name="value" label="Giá trị" rules={[{ required: true }]}>
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="minOrder" label="Đơn tối thiểu">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="maxDiscount" label="Giảm tối đa">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="usageLimit" label="Giới hạn lượt dùng">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminVouchersPage;
