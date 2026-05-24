import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { getProductsApi, getCategoriesApi } from "../util/api";

const formatPrice = (value) =>
    new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";

const getPriceInfo = (product) => {
    const price = Number(product?.price) || 0;
    const discount = Number(product?.discountPercent) || 0;

    if (product?.isPromo && discount > 0) {
        const discounted = Math.round(price * (1 - discount / 100));
        return { current: discounted, original: price };
    }

    return { current: price, original: null };
};

const CategoryProductsPage = () => {
    const { categorySlug } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState("");
    const observer = useRef();

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoriesApi();
            if (res?.data) {
                setCategories(res.data.data || res.data);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categorySlug) {
            const cat = categories.find(c => c.slug === categorySlug);
            setCurrentCategory(cat);
        }
        setProducts([]);
        setPage(1);
        setHasMore(true);
        setError("");
    }, [categorySlug, categories]);

    const fetchProducts = useCallback(async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        setError("");
        
        try {
            const params = {
                categorySlug: categorySlug,
                page: page,
                limit: 12
            };
            
            const res = await getProductsApi(params);
            
            let newProducts = [];
            let total = 0;
            
            if (res?.data) {
                if (res.data.data) {
                    newProducts = res.data.data;
                    total = res.data.meta?.total || 0;
                } else if (Array.isArray(res.data)) {
                    newProducts = res.data;
                    total = newProducts.length;
                }
            }
            
            if (newProducts.length > 0) {
                setProducts(prev => [...prev, ...newProducts]);
                setHasMore(newProducts.length > 0 && total > products.length + newProducts.length);
            } else {
                setError(res?.data?.message || "Không thể tải sản phẩm.");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải sản phẩm.");
        } finally {
            setLoading(false);
        }
    }, [categorySlug, page, loading, hasMore, products.length]);

    useEffect(() => {
        if (currentCategory) {
            fetchProducts();
        }
    }, [currentCategory, fetchProducts]);

    const lastProductRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="mb-10">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Link to="/">
                        <Button variant="ghost">← Về trang chủ</Button>
                    </Link>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                    <Link to="/">
                        <Button variant={!categorySlug ? "default" : "ghost"}>
                            Tất cả
                        </Button>
                    </Link>
                    {categories.map(cat => (
                        <Link key={cat._id} to={`/category/${cat.slug}`}>
                            <Button variant={cat.slug === categorySlug ? "default" : "ghost"}>
                                {cat.name}
                            </Button>
                        </Link>
                    ))}
                </div>

                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-reef">
                        {currentCategory?.name || "Tất cả sản phẩm"}
                    </p>
                    <h1 className="mt-3 font-display text-3xl text-ink">
                        {currentCategory?.description || "Khám phá tất cả sản phẩm của chúng tôi"}
                    </h1>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
                    <div
                        key={product._id}
                        ref={index === products.length - 1 ? lastProductRef : null}
                        className="group rounded-[28px] border border-black/10 bg-white/80 p-5 transition hover:-translate-y-1"
                    >
                        <div className="relative overflow-hidden rounded-2xl">
                            <img
                                src={product.images?.[0] || "https://via.placeholder.com/400x300?text=Ch%C6%B0a+c%C3%B3+%E1%BA%A3nh"}
                                alt={product.name}
                                className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            {product.isPromo ? (
                                <span className="absolute left-3 top-3 rounded-full bg-ember px-3 py-1 text-xs font-semibold text-white">
                                    Giảm {product.discountPercent}%
                                </span>
                            ) : null}
                        </div>
                        <div className="mt-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                                {product.category?.name || "Danh mục"}
                            </p>
                            <h3 className="mt-2 font-display text-2xl text-ink">
                                {product.name}
                            </h3>
                            <p className="mt-2 text-sm text-black/70">
                                {product.description}
                            </p>
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-lg font-semibold text-ink">
                                        {formatPrice(getPriceInfo(product).current)}
                                    </p>
                                    {getPriceInfo(product).original ? (
                                        <p className="text-sm text-black/40 line-through">
                                            {formatPrice(getPriceInfo(product).original)}
                                        </p>
                                    ) : null}
                                </div>
                                <p
                                    className={`text-xs font-semibold ${
                                        product.stock > 0 ? "text-reef" : "text-ember"
                                    }`}
                                >
                                    {product.stock > 0
                                        ? `Còn ${product.stock} gói`
                                        : "Tạm hết hàng"}
                                </p>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Link to={`/product/${product._id}`}>
                                    <Button>Xem chi tiết</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="mt-8 text-center py-8">
                    <p className="text-sm text-black/70">Đang tải thêm sản phẩm...</p>
                </div>
            )}

            {error && (
                <div className="mt-8 rounded-[28px] border border-ember/30 bg-ember/10 p-8 text-center">
                    <p className="text-sm text-ember">{error}</p>
                    <Button variant="ghost" onClick={fetchProducts} className="mt-4">
                        Thử lại
                    </Button>
                </div>
            )}

            {!loading && !hasMore && products.length > 0 && (
                <div className="mt-8 text-center py-8">
                    <p className="text-sm text-black/60">Đã tải hết tất cả sản phẩm</p>
                </div>
            )}
        </div>
    );
};

export default CategoryProductsPage;
