import React from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "./header";

const { Header: AntHeader, Sider, Content } = Layout;

const menuItems = [
  { key: "/admin", label: <Link to="/admin">Bảng điều khiển</Link> },
  { key: "/admin/products", label: <Link to="/admin/products">Sản phẩm</Link> },
  { key: "/admin/categories", label: <Link to="/admin/categories">Danh mục</Link> },
  { key: "/admin/orders", label: <Link to="/admin/orders">Đơn hàng</Link> },
  { key: "/admin/users", label: <Link to="/admin/users">Khách hàng</Link> },
  { key: "/admin/vouchers", label: <Link to="/admin/vouchers">Khuyến mãi</Link> },
  { key: "/admin/inventory", label: <Link to="/admin/inventory">Tồn kho</Link> },
  { key: "/admin/reviews", label: <Link to="/admin/reviews">Đánh giá</Link> }
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} theme="light">
        <div style={{ padding: "16px", fontWeight: 700 }}>Bảng quản trị</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <AntHeader style={{ background: "#fff", padding: 0 }}>
          <Header />
        </AntHeader>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
