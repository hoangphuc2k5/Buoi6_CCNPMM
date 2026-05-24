import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { getAdminDashboardApi } from "../../util/api";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await getAdminDashboardApi();
      if (response?.EC === 0) {
        setStats(response.DT);
      }
    };
    fetchStats();
  }, []);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic title="Tổng đơn hàng" value={stats?.totalOrders || 0} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Tổng doanh thu" value={stats?.totalRevenue || 0} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Số sản phẩm" value={stats?.totalProducts || 0} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Số khách hàng" value={stats?.totalUsers || 0} />
        </Card>
      </Col>
    </Row>
  );
};

export default AdminDashboardPage;
