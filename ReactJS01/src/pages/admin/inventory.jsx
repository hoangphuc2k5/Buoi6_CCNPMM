import React, { useEffect, useState } from "react";
import { Button, Card, InputNumber, Table, message } from "antd";
import { getProductsApi, updateAdminProductApi } from "../../util/api";

const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getProductsApi({ limit: 200 });
    if (res?.data) {
      setProducts(res.data.data || res.data || []);
    } else if (Array.isArray(res)) {
      setProducts(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStock = async (record, value) => {
    const res = await updateAdminProductApi(record._id, { stock: value });
    if (res?.data?.message || res?.message) {
      message.success("Cập nhật tồn kho thành công");
      fetchProducts();
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "name" },
    { title: "Tồn kho", dataIndex: "stock" },
    {
      title: "Cập nhật",
      render: (record) => (
        <InputNumber
          min={0}
          defaultValue={record.stock}
          onBlur={(e) => updateStock(record, Number(e.target.value))}
        />
      )
    }
  ];

  return (
    <Card title="Quản lý tồn kho" extra={<Button onClick={fetchProducts}>Làm mới</Button>}>
      <Table rowKey="_id" loading={loading} dataSource={products} columns={columns} />
    </Card>
  );
};

export default AdminInventoryPage;
