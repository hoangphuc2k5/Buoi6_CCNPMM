import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { fetchAccountThunk, logout, updateProfileThunk } from "../Redux/authSlice";
import { message } from "antd";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, appLoading, loading, error } = useSelector(
    (state) => state.auth
  );
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountThunk());
    }
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfileThunk(formData)).unwrap();
      message.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
    } catch (err) {
      message.error(err || "Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
    setIsEditing(false);
  };

  if (appLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-black/60">
        Đang tải hồ sơ...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[28px] border border-black/10 bg-white/80 p-8 shadow-glow">
          <h2 className="font-display text-3xl text-ink">Bạn chưa đăng nhập</h2>
          <p className="mt-3 text-sm text-black/70">
            Hãy đăng nhập để xem thông tin hồ sơ.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/login">
              <Button>Đăng nhập</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost">Về trang chủ</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="grid gap-8 rounded-[32px] border border-black/10 bg-white/80 p-8 shadow-glow md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-reef">Hồ sơ</p>
          <h2 className="mt-4 font-display text-3xl text-ink">
            Xin chào, {user?.name || "bạn"}
          </h2>
          <p className="mt-3 text-sm text-black/70">
            Đây là không gian quản lý cá nhân, cập nhật thông tin và theo dõi phiên đăng nhập.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Chỉnh sửa hồ sơ
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Hủy
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-paper/70 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-black/60">Email</p>
            {isEditing ? (
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-2"
                placeholder="Nhập email"
                required
              />
            ) : (
              <p className="mt-2 text-base font-semibold text-ink">{user?.email}</p>
            )}
          </div>
          
          <div className="rounded-2xl border border-black/10 bg-paper/70 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-black/60">Tên hiển thị</p>
            {isEditing ? (
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2"
                placeholder="Nhập tên"
                required
              />
            ) : (
              <p className="mt-2 text-base font-semibold text-ink">{user?.name}</p>
            )}
          </div>
          
          <div className="rounded-2xl border border-black/10 bg-paper/70 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-black/60">Nguồn tạo</p>
            <p className="mt-2 text-base font-semibold text-ink">
              {user?.createdBy || "HCMUTE"}
            </p>
          </div>
          
          {isEditing && (
            <Button type="submit" className="w-full" loading={loading}>
              {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
            </Button>
          )}
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
