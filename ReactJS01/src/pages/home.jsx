import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/ui/Button";
import { logout } from "../Redux/authSlice";
import { getCategoriesApi, getProductsApi } from "../util/api";

const formatPrice = (value) =>
    new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";

const HomePage = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState("featured");
    const [products, setProducts] = useState([]);
    const [promos, setPromos] = useState([]);
    const [newest, setNewest] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [mostViewed, setMostViewed] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const bestSellersRef = useRef(null);
    const mostViewedRef = useRef(null);
    const newestRef = useRef(null);
    const promosRef = useRef(null);
    
    const sliderConfigs = [
        { title: "Bán chạy nhất", items: bestSellers, ref: bestSellersRef },
        { title: "Xem nhiều nhất", items: mostViewed, ref: mostViewedRef },
        { title: "Mới nhất", items: newest, ref: newestRef },
        { title: "Khuyến mãi", items: promos, ref: promosRef }
    ];
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const itemsPerPage = 12;
    const totalPages = Math.ceil(total / itemsPerPage);

    useEffect(() => {
        const fetchStaticData = async () => {
            const [categoryRes, promoRes, newRes, bestRes, viewedRes] = await Promise.all([
                getCategoriesApi(),
                getProductsApi({ isPromo: "true", limit: 10, sort: "price-desc" }),
                getProductsApi({ isNewProduct: "true", limit: 10, sort: "newest" }),
                getProductsApi({ isBestSeller: "true", limit: 10, sort: "best-seller" }),
                getProductsApi({ limit: 10, sort: "most-viewed" })
            ]);

            if (categoryRes?.data) {
                setCategories(categoryRes.data.data || categoryRes.data);
            }
            
            const getProductsData = (res) => {
                if (!res?.data) return [];
                if (res.data.data) return res.data.data;
                if (Array.isArray(res.data)) return res.data;
                return [];
            };
            
            setPromos(getProductsData(promoRes));
            setNewest(getProductsData(newRes));
            setBestSellers(getProductsData(bestRes));
            setMostViewed(getProductsData(viewedRes));
        };

        fetchStaticData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [query, category, minPrice, maxPrice, inStockOnly, sortBy]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError("");
            const params = {
                search: query || undefined,
                categoryId: category !== "all" ? category : undefined,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                inStock: inStockOnly ? "true" : undefined,
                sort: sortBy !== "featured" ? sortBy : undefined,
                limit: itemsPerPage,
                page: currentPage
            };

            const res = await getProductsApi(params);
            
            let productsData = [];
            let totalData = 0;
            
            if (res?.data) {
                if (res.data.data) {
                    productsData = res.data.data;
                    totalData = res.data.meta?.total || res.data.data.length;
                } else if (Array.isArray(res.data)) {
                    productsData = res.data;
                    totalData = res.data.length;
                }
            }
            
            if (productsData.length > 0) {
                setProducts(productsData);
                setTotal(totalData);
            } else {
                setError(res?.data?.message || "Khong the tai danh sach san pham.");
                setProducts([]);
                setTotal(0);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [query, category, minPrice, maxPrice, inStockOnly, sortBy, currentPage]);

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <section className="grid gap-8 rounded-[32px] border border-black/10 bg-white/80 p-8 shadow-glow lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-reef">
                        Cà phê đặc sản
                    </p>
                    <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
                        Trải nghiệm hương cà phê rang mới sáng
                    </h1>
                    <p className="mt-4 text-sm text-black/70">
                        Bộ sưu tập cà phê và phụ kiện pha chế được chọn lọc từ cao nguyên.
                        Cập nhật khuyến mãi, hàng mới, sản phẩm bán chạy và thông tin thành
                        viên trong một trang.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <a href="#shop">
                            <Button>Mua ngay</Button>
                        </a>
                        {isAuthenticated && (
                            <Link to="/add-product">
                                <Button variant="ghost">
                                    + Thêm sản phẩm
                                </Button>
                            </Link>
                        )}
                        <Link to={isAuthenticated ? "/profile" : "/login"}>
                            <Button variant="ghost">
                                {isAuthenticated ? "Xem hồ sơ" : "Đăng nhập"}
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-black/10 bg-paper/70 px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-black/60">
                                Khuyến mãi
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-ink">
                                {promos.length} sản phẩm
                            </p>
                        </div>
                        <div className="rounded-2xl border border-black/10 bg-paper/70 px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-black/60">
                                Mới nhất
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-ink">
                                {newest.length} sản phẩm
                            </p>
                        </div>
                        <div className="rounded-2xl border border-black/10 bg-paper/70 px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-black/60">
                                Bán chạy
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-ink">
                                {bestSellers.length} sản phẩm
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {isAuthenticated ? (
                        <div className="rounded-[28px] border border-black/10 bg-paper/80 p-6">
                            <p className="text-xs uppercase tracking-[0.3em] text-reef">
                                Thành viên
                            </p>
                            <h3 className="mt-3 font-display text-2xl text-ink">
                                {user?.name || "Bạn"}
                            </h3>
                            <p className="mt-2 text-sm text-black/70">{user?.email}</p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Link to="/profile">
                                    <Button>Thông tin cá nhân</Button>
                                </Link>
                                <Button variant="ghost" onClick={() => dispatch(logout())}>
                                    Đăng xuất
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[28px] border border-black/10 bg-paper/80 p-6">
                            <p className="text-xs uppercase tracking-[0.3em] text-reef">
                                Thành viên
                            </p>
                            <h3 className="mt-3 font-display text-2xl text-ink">
                                Bạn chưa đăng nhập
                            </h3>
                            <p className="mt-2 text-sm text-black/70">
                                Đăng nhập để lưu đơn hàng, nhận ưu đãi và xem lịch sử mua sắm.
                            </p>
                            <div className="mt-4">
                                <Link to="/login">
                                    <Button>Đăng nhập ngay</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                    <div className="rounded-[28px] border border-black/10 bg-ink p-6 text-white">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                            Cam kết rang mới
                        </p>
                        <p className="mt-3 text-lg">
                            Mỗi loại cà phê đều được rang theo ngày, giữ nguyên hương vị và độ
                            ngọt tự nhiên.
                        </p>
                        <p className="mt-4 text-sm text-white/60">
                            Giao hàng 2h tại TP.HCM - Đổi trả trong 7 ngày.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mt-12">
                {sliderConfigs.filter(config => config.items.length > 0).map((config) => (
                    <div key={config.title} className="mb-12">
                        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-reef">
                                    Đặc biệt
                                </p>
                                <h2 className="mt-2 font-display text-3xl text-ink">
                                    {config.title}
                                </h2>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (config.ref.current) {
                                            config.ref.current.scrollBy({ left: -350, behavior: 'smooth' });
                                        }
                                    }}
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white shadow-glow hover:bg-paper"
                                >
                                    <span className="text-lg">←</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (config.ref.current) {
                                            config.ref.current.scrollBy({ left: 350, behavior: 'smooth' });
                                        }
                                    }}
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white shadow-glow hover:bg-paper"
                                >
                                    <span className="text-lg">→</span>
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div
                                ref={config.ref}
                                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
                            >
                                {config.items.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={`/product/${product._id}`}
                                        className="flex-shrink-0 w-72 group rounded-[28px] border border-black/10 bg-white/80 p-5 transition hover:-translate-y-1"
                                    >
                                        <div className="relative overflow-hidden rounded-2xl">
                                            <img
                                                src={product.images?.[0] || "https://via.placeholder.com/300x250?text=No+Image"}
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
                                            <h3 className="mt-2 font-display text-xl text-ink">
                                                {product.name}
                                            </h3>
                                            <p className="mt-3 text-lg font-semibold text-ink">
                                                {formatPrice(product.price)}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between text-xs text-black/60">
                                                <span>Đã bán: {product.sold}</span>
                                                <span>Lượt xem: {product.views || 0}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <section className="mt-12">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-reef">
                            Danh mục sản phẩm
                        </p>
                        <h2 className="mt-2 font-display text-3xl text-ink">
                            Khám phá theo danh mục
                        </h2>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to="/category">
                        <Button variant="ghost">
                            Tất cả sản phẩm
                        </Button>
                    </Link>
                    {categories.map(cat => (
                        <Link key={cat._id} to={`/category/${cat.slug}`}>
                            <Button variant="ghost">
                                {cat.name}
                            </Button>
                        </Link>
                    ))}
                </div>
            </section>

            <section id="shop" className="mt-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-reef">
                            Bộ lọc sản phẩm
                        </p>
                        <h2 className="mt-3 font-display text-3xl text-ink">
                            Tìm kiếm và lọc theo nhiều điều kiện
                        </h2>
                    </div>
                        <p className="text-sm text-black/70">
                            {total} kết quả phù hợp
                        </p>
                </div>

                <div className="mt-6 grid gap-4 rounded-[28px] border border-black/10 bg-white/80 p-6 md:grid-cols-2 lg:grid-cols-4">
                    <label className="text-sm text-ink">
                        <span className="font-medium">Từ khóa</span>
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Tìm theo tên, mô tả"
                            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-reef focus:ring-2 focus:ring-reef/20"
                        />
                    </label>
                    <label className="text-sm text-ink">
                        <span className="font-medium">Danh mục</span>
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-reef focus:ring-2 focus:ring-reef/20"
                        >
                            <option value="all">Tất cả</option>
                            {categories.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="text-sm text-ink">
                        <span className="font-medium">Giá từ</span>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(event) => setMinPrice(event.target.value)}
                            placeholder="100000"
                            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-reef focus:ring-2 focus:ring-reef/20"
                        />
                    </label>
                    <label className="text-sm text-ink">
                        <span className="font-medium">Giá đến</span>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(event) => setMaxPrice(event.target.value)}
                            placeholder="300000"
                            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-reef focus:ring-2 focus:ring-reef/20"
                        />
                    </label>
                    <label className="flex items-center gap-3 text-sm text-ink">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(event) => setInStockOnly(event.target.checked)}
                            className="h-4 w-4 accent-reef"
                        />
                        Chỉ hiển thị hàng còn
                    </label>
                    <label className="text-sm text-ink">
                        <span className="font-medium">Sắp xếp</span>
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-reef focus:ring-2 focus:ring-reef/20"
                        >
                            <option value="featured">Nổi bật</option>
                            <option value="newest">Mới nhất</option>
                            <option value="best-seller">Bán chạy</option>
                            <option value="price-asc">Giá tăng dần</option>
                            <option value="price-desc">Giá giảm dần</option>
                        </select>
                    </label>
                    <div className="flex items-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setQuery("");
                                setCategory("all");
                                setMinPrice("");
                                setMaxPrice("");
                                setInStockOnly(false);
                                setSortBy("featured");
                            }}
                        >
                            Đặt lại bộ lọc
                        </Button>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <div className="rounded-[28px] border border-black/10 bg-white/80 p-6 text-sm text-black/70">
                            Đang tải sản phẩm...
                        </div>
                    ) : null}
                    {error ? (
                        <div className="rounded-[28px] border border-ember/30 bg-ember/10 p-6 text-sm text-ember">
                            {error}
                        </div>
                    ) : null}
                    {!loading && !error && products.length === 0 ? (
                        <div className="rounded-[28px] border border-black/10 bg-white/80 p-6 text-sm text-black/70">
                            Không tìm thấy sản phẩm phù hợp.
                        </div>
                    ) : null}
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="group rounded-[28px] border border-black/10 bg-white/80 p-5 transition hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden rounded-2xl">
                                <img
                                    src={product.images[0]}
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
                                    <p className="text-lg font-semibold text-ink">
                                        {formatPrice(product.price)}
                                    </p>
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
                                    <Button variant="ghost">Thêm vào giỏ</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white shadow-glow hover:bg-paper disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="text-lg">←</span>
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition ${
                                        pageNum === currentPage
                                            ? "bg-reef text-white border-reef"
                                            : "bg-white hover:bg-paper"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white shadow-glow hover:bg-paper disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="text-lg">→</span>
                        </button>

                        <div className="ml-4 text-sm text-black/60">
                            Trang {currentPage} / {totalPages} ({total} sản phẩm)
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
