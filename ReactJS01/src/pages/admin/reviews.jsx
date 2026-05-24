import React, { useEffect, useState } from "react";
import { Button, Card, Select, Table, message } from "antd";
import { approveAdminReviewApi, deleteAdminReviewApi, getAdminReviewsApi } from "../../util/api";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending");

  const fetchReviews = async () => {
    setLoading(true);
    const res = await getAdminReviewsApi(status);
    if (res?.EC === 0) {
      setReviews(res.DT || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [status]);

  const approveReview = async (record) => {
    const res = await approveAdminReviewApi(record._id);
    if (res?.EC === 0) {
      message.success("Duyệt đánh giá thành công");
      fetchReviews();
    }
  };

  const deleteReview = async (record) => {
    const res = await deleteAdminReviewApi(record._id);
    if (res?.EC === 0) {
      message.success("Xóa đánh giá thành công");
      fetchReviews();
    }
  };

  const columns = [
    { title: "Sản phẩm", render: (record) => record.product?.name || "" },
    { title: "Người dùng", render: (record) => record.user?.email || "" },
    { title: "Nội dung", dataIndex: "comment" },
    { title: "Trạng thái", dataIndex: "status" },
    {
      title: "Thao tác",
      render: (record) => (
        <>
          <Button size="small" onClick={() => approveReview(record)}>
            Duyệt
          </Button>
          <Button size="small" danger onClick={() => deleteReview(record)} style={{ marginLeft: 8 }}>
            Xóa
          </Button>
        </>
      )
    }
  ];

  return (
    <Card
      title="Quản lý đánh giá"
      extra={
        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { value: "pending", label: "Chờ duyệt" },
            { value: "approved", label: "Đã duyệt" }
          ]}
        />
      }
    >
      <Table rowKey="_id" loading={loading} dataSource={reviews} columns={columns} />
    </Card>
  );
};

export default AdminReviewsPage;
