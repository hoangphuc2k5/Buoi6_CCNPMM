import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Modal, Table, message } from "antd";
import { createCategoryApi, deleteAdminCategoryApi, getCategoriesApi, updateAdminCategoryApi } from "../../util/api";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    const res = await getCategoriesApi();
    if (res?.data) {
      setCategories(res.data || res);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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
    const res = await deleteAdminCategoryApi(record._id);
    if (res?.data?.message || res?.message) {
      message.success("Xóa danh mục thành công");
      fetchData();
    }
  };

  const onFinish = async (values) => {
    let res;
    if (editing) {
      res = await updateAdminCategoryApi(editing._id, values);
    } else {
      res = await createCategoryApi(values);
    }

    if (res?.data?.message || res?.message) {
      message.success("Lưu danh mục thành công");
      setModalOpen(false);
      fetchData();
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "name" },
    { title: "Đường dẫn", dataIndex: "slug" },
    { title: "Mô tả", dataIndex: "description" },
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
      title="Quản lý danh mục"
      extra={<Button onClick={openCreate}>Thêm danh mục</Button>}
    >
      <Table rowKey="_id" loading={loading} dataSource={categories} columns={columns} />

      <Modal
        title={editing ? "Cập nhật danh mục" : "Thêm danh mục"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Đường dẫn (slug)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminCategoriesPage;
