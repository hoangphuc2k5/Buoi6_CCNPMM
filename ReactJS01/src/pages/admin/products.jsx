import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Form, Input, InputNumber, Modal, Select, Switch, Table, message } from "antd";
import { createProductApi, getCategoriesApi, getProductsApi, updateAdminProductApi, deleteAdminProductApi } from "../../util/api";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    const [productRes, categoryRes] = await Promise.all([
      getProductsApi({ limit: 100 }),
      getCategoriesApi()
    ]);

    if (productRes?.data) {
      setProducts(productRes.data.data || productRes.data || []);
    } else if (Array.isArray(productRes)) {
      setProducts(productRes);
    }
    if (categoryRes?.data) {
      setCategories(categoryRes.data || categoryRes);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c._id })),
    [categories]
  );

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      category: record.category?._id || record.category,
      images: record.images?.join(", ") || ""
    });
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    const res = await deleteAdminProductApi(record._id);
    if (res?.data?.message || res?.message) {
      message.success("Xóa sản phẩm thành công");
      fetchData();
    }
  };

  const onFinish = async (values) => {
    const payload = {
      ...values,
      images: values.images ? values.images.split(",").map((item) => item.trim()) : []
    };

    let res;
    if (editing) {
      res = await updateAdminProductApi(editing._id, payload);
    } else {
      res = await createProductApi(payload);
    }

    if (res?.data?.message || res?.message || res?.EC === 0) {
      message.success("Lưu sản phẩm thành công");
      setModalOpen(false);
      fetchData();
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "name" },
    { title: "Giá", dataIndex: "price" },
    { title: "Tồn kho", dataIndex: "stock" },
    {
      title: "Danh mục",
      render: (record) => record.category?.name || ""
    },
    {
      title: "Khuyến mãi",
      render: (record) => (record.isPromo ? "Có" : "Không")
    },
    {
      title: "Thao tác",
      render: (record) => (
        <>
          <Button size="small" onClick={() => openEdit(record)}>
            Sửa
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record)} style={{ marginLeft: 8 }}>
            Xóa
          </Button>
        </>
      )
    }
  ];

  return (
    <Card
      title="Quản lý sản phẩm"
      extra={<Button onClick={openCreate}>Thêm sản phẩm</Button>}
    >
      <Table rowKey="_id" loading={loading} dataSource={products} columns={columns} />

      <Modal
        title={editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="stock" label="Số lượng">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
            <Select options={categoryOptions} />
          </Form.Item>
          <Form.Item name="images" label="Hình ảnh (cách nhau bởi dấu phẩy)">
            <Input />
          </Form.Item>
          <Form.Item name="discountPercent" label="Giảm giá (%)">
            <InputNumber className="w-full" min={0} max={100} />
          </Form.Item>
          <Form.Item name="isPromo" label="Khuyến mãi" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isNewProduct" label="Sản phẩm mới" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isBestSeller" label="Bán chạy" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminProductsPage;
