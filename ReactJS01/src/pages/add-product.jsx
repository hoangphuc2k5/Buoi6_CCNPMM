import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { getCategoriesApi, createProductApi } from "../util/api";
import { notification } from "antd";

const AddProductPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        images: [""],
        isNewProduct: false,
        isBestSeller: false,
        isPromo: false,
        discountPercent: 0,
        rating: 0,
        sold: 0
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoriesApi();
            if (res?.data) {
                setCategories(res.data);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
    };

    const removeImageField = (index) => {
        if (formData.images.length > 1) {
            const newImages = formData.images.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                discountPercent: Number(formData.discountPercent),
                rating: Number(formData.rating),
                sold: Number(formData.sold),
                images: formData.images.filter(img => img.trim() !== "")
            };

            console.log("Sending product data:", productData);
            
            const res = await createProductApi(productData);
            console.log("Response from server:", res);
            
            if (res?.data) {
                notification.success({
                    message: "Thành công!",
                    description: res.message || "Tạo sản phẩm thành công!"
                });
                navigate("/");
            } else {
                notification.error({
                    message: "Lỗi!",
                    description: res?.message || "Không thể tạo sản phẩm."
                });
            }
        } catch (error) {
            console.error("Error creating product:", error);
            notification.error({
                message: "Lỗi!",
                description: error?.response?.data?.message || error?.message || "Không thể tạo sản phẩm."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-reef">
                        Quản lý sản phẩm
                    </p>
                    <h1 className="mt-3 font-display text-3xl text-ink">
                        Thêm sản phẩm mới
                    </h1>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to="/add-category">
                        <Button variant="ghost">+ Thêm danh mục</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost">Về trang chủ</Button>
                    </Link>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-[32px] border border-black/10 bg-white/80 p-8">
                    <h2 className="font-display text-2xl text-ink mb-6">Thông tin cơ bản</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="Tên sản phẩm"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên sản phẩm"
                            required
                        />
                        <Input
                            label="Giá (VNĐ)"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="100000"
                            required
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Mô tả"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả chi tiết về sản phẩm"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-ink">
                                <span className="font-medium">Danh mục</span>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-reef focus:ring-2 focus:ring-reef/20"
                                    required
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <Input
                            label="Tồn kho"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="50"
                        />
                    </div>
                </div>

                <div className="rounded-[32px] border border-black/10 bg-white/80 p-8">
                    <h2 className="font-display text-2xl text-ink mb-6">Hình ảnh</h2>
                    <div className="space-y-3">
                        {formData.images.map((img, index) => (
                            <div key={index} className="flex gap-3 items-end">
                                <Input
                                    label={`Hình ảnh ${index + 1}`}
                                    value={img}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.images.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeImageField(index)}
                                    >
                                        Xóa
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={addImageField}
                        className="mt-4"
                    >
                        + Thêm hình ảnh
                    </Button>
                </div>

                <div className="rounded-[32px] border border-black/10 bg-white/80 p-8">
                    <h2 className="font-display text-2xl text-ink mb-6">Trạng thái</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex items-center gap-3 text-sm text-ink">
                            <input
                                type="checkbox"
                                name="isNewProduct"
                                checked={formData.isNewProduct}
                                onChange={handleChange}
                                className="h-4 w-4 accent-reef"
                            />
                            Sản phẩm mới
                        </label>
                        <label className="flex items-center gap-3 text-sm text-ink">
                            <input
                                type="checkbox"
                                name="isBestSeller"
                                checked={formData.isBestSeller}
                                onChange={handleChange}
                                className="h-4 w-4 accent-reef"
                            />
                            Bán chạy
                        </label>
                        <label className="flex items-center gap-3 text-sm text-ink">
                            <input
                                type="checkbox"
                                name="isPromo"
                                checked={formData.isPromo}
                                onChange={handleChange}
                                className="h-4 w-4 accent-reef"
                            />
                            Khuyến mãi
                        </label>
                        {formData.isPromo && (
                            <Input
                                label="Phần trăm giảm giá (%)"
                                name="discountPercent"
                                type="number"
                                value={formData.discountPercent}
                                onChange={handleChange}
                                placeholder="10"
                                min="0"
                                max="100"
                            />
                        )}
                    </div>
                </div>

                <div className="rounded-[32px] border border-black/10 bg-white/80 p-8">
                    <h2 className="font-display text-2xl text-ink mb-6">Thông tin thêm</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="Đánh giá (0-5)"
                            name="rating"
                            type="number"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="4.5"
                            min="0"
                            max="5"
                            step="0.1"
                        />
                        <Input
                            label="Đã bán"
                            name="sold"
                            type="number"
                            value={formData.sold}
                            onChange={handleChange}
                            placeholder="100"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button type="submit" loading={loading}>
                        Lưu sản phẩm
                    </Button>
                    <Link to="/">
                        <Button variant="ghost">Hủy</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;
