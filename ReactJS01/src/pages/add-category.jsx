import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { createCategoryApi } from "../util/api";
import { notification } from "antd";

const AddCategoryPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const autoGenerateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-");
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Sending category data:", formData);
            const res = await createCategoryApi(formData);
            console.log("Response from server:", res);
            
            if (res?.data) {
                notification.success({
                    message: "Thành công!",
                    description: res.message || "Tạo danh mục thành công!"
                });
                navigate("/add-product");
            } else {
                notification.error({
                    message: "Lỗi!",
                    description: res?.message || "Không thể tạo danh mục."
                });
            }
        } catch (error) {
            console.error("Error creating category:", error);
            notification.error({
                message: "Lỗi!",
                description: error?.response?.data?.message || error?.message || "Không thể tạo danh mục."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-6 py-12">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-reef">
                        Quản lý danh mục
                    </p>
                    <h1 className="mt-3 font-display text-3xl text-ink">
                        Thêm danh mục mới
                    </h1>
                </div>
                <Link to="/">
                    <Button variant="ghost">Về trang chủ</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-[32px] border border-black/10 bg-white/80 p-8">
                    <h2 className="font-display text-2xl text-ink mb-6">Thông tin danh mục</h2>
                    <div className="space-y-4">
                        <Input
                            label="Tên danh mục"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Cà phê rang xay"
                            required
                        />
                        <div className="flex gap-3 items-end">
                            <Input
                                label="Slug (URL)"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="ca-phe-rang-xay"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={autoGenerateSlug}
                                disabled={!formData.name}
                            >
                                Tự tạo
                            </Button>
                        </div>
                        <Input
                            label="Mô tả"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Mô tả về danh mục này"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button type="submit" loading={loading}>
                        Lưu danh mục
                    </Button>
                    <Link to="/add-product">
                        <Button variant="ghost">Quay lại thêm sản phẩm</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost">Hủy</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AddCategoryPage;
