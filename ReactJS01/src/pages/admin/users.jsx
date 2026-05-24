import React, { useEffect, useState } from "react";
import { Button, Card, Switch, Table, message } from "antd";
import { getAdminUsersApi, updateAdminUserLockApi } from "../../util/api";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAdminUsersApi();
    if (Array.isArray(res)) {
      setUsers(res);
    } else if (res?.data) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleLock = async (userId, isLocked) => {
    const res = await updateAdminUserLockApi(userId, isLocked);
    if (res?.data || res?._id) {
      message.success("Cập nhật trạng thái tài khoản");
      fetchUsers();
    }
  };

  const columns = [
    { title: "Email", dataIndex: "email" },
    { title: "Tên", dataIndex: "name" },
    {
      title: "Khóa",
      render: (record) => (
        <Switch
          checked={record.isLocked}
          onChange={(checked) => toggleLock(record._id, checked)}
        />
      )
    }
  ];

  return (
    <Card title="Quản lý khách hàng" extra={<Button onClick={fetchUsers}>Làm mới</Button>}>
      <Table rowKey="_id" loading={loading} dataSource={users} columns={columns} />
    </Card>
  );
};

export default AdminUsersPage;
