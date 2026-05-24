import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { message } from "antd";
import Button from "../components/ui/Button";
import { getProductDetailApi, getProductsApi, addToCartApi } from "../util/api";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../Redux/cartSlice";

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

const ProductDetailPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      const res = await getProductDetailApi(productId);
      if (res?.data) {
        setProduct(res.data.data || res.data);
      } else {
        setError(res?.data?.message || "Không tìm thấy sản phẩm.");
        setProduct(null);
      }
      setLoading(false);
    };

    fetchDetail();
  }, [productId]);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!product?.category?._id) return;
      const res = await getProductsApi({
        categoryId: product.category._id,
        limit: 3,
        sort: "best-seller"
      });
      
      let productsData = [];
      if (res?.data) {
        if (res.data.data) {
          productsData = res.data.data;
        } else if (Array.isArray(res.data)) {
          productsData = res.data;
        }
      }
      
      setSimilarProducts(
        productsData.filter((item) => item._id !== product._id)
      );
    };

    fetchSimilar();
  }, [product]);

  const images = useMemo(() => {
    if (!product?.images?.length) return [];
    return product.images;
  }, [product]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-black/70">
        Đang tải chi tiết sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[28px] border border-black/10 bg-white/80 p-8 text-center">
          <h2 className="font-display text-3xl text-ink">
            Không tìm thấy sản phẩm
          </h2>
          <p className="mt-3 text-sm text-black/70">
            {error || "Sản phẩm này không còn tồn tại hoặc đã được cập nhật."}
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button>Về trang chủ</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () =>
    setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const nextValue = prev + delta;
      if (nextValue < 1) return 1;
      if (product.stock === 0) return 1;
      if (nextValue > product.stock) return product.stock;
      return nextValue;
    });
  };

  const handleAddToCart = async () => {
    console.log('=== Add to Cart Debug ===');
    console.log('Product:', product);
    console.log('Product ID:', product?._id);
    console.log('Quantity:', quantity);
    
    if (!product) {
      message.error('Sản phẩm không tồn tại');
      return;
    }
    
    if (!product._id) {
      message.error('ID sản phẩm không hợp lệ');
      return;
    }
    
    setAddingToCart(true);
    try {
      const result = await dispatch(addItemToCart({ productId: product._id, quantity }));
      console.log('Dispatch result:', result);
      
      if (result.payload?.EC === 0) {
        message.success('Thêm vào giỏ hàng thành công!');
      } else if (result.payload) {
        message.error(result.payload.EM || 'Có lỗi xảy ra');
      } else if (result.error) {
        message.error('Có lỗi xảy ra: ' + (result.error.message || 'Lỗi không xác định'));
      } else {
        message.error('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      message.error('Có lỗi xảy ra: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-black/10 bg-white/80 p-6">
          <div className="relative overflow-hidden rounded-3xl">
            {images.length > 0 ? (
              <img
                src={images[activeIndex]}
                alt={product.name}
                className="h-80 w-full object-cover md:h-[420px]"
              />
            ) : (
              <div className="flex h-80 items-center justify-center bg-paper/70 text-sm text-black/60 md:h-[420px]">
                Chưa có hình ảnh
              </div>
            )}
            {images.length > 1 ? (
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4">
                <Button variant="ghost" onClick={prevImage}>
                  Trước
                </Button>
                <Button variant="ghost" onClick={nextImage}>
                  Sau
                </Button>
              </div>
            ) : null}
          </div>
          {images.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveIndex(index)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border transition ${
                    index === activeIndex
                      ? "border-reef"
                      : "border-black/10"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-black/10 bg-white/80 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-reef">
              {product.category?.name || "Danh mục"}
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink">
              {product.name}
            </h1>
            <p className="mt-3 text-sm text-black/70">{product.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-2xl font-semibold text-ink">
                  {formatPrice(getPriceInfo(product).current)}
                </p>
                {getPriceInfo(product).original ? (
                  <p className="text-base text-black/40 line-through">
                    {formatPrice(getPriceInfo(product).original)}
                  </p>
                ) : null}
              </div>
              {product.isPromo ? (
                <span className="rounded-full bg-ember px-3 py-1 text-xs font-semibold text-white">
                  Giảm {product.discountPercent}%
                </span>
              ) : null}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  product.stock > 0
                    ? "bg-reef/10 text-reef"
                    : "bg-ember/10 text-ember"
                }`}
              >
                {product.stock > 0
                  ? `Còn ${product.stock} gói`
                  : "Tạm hết hàng"}
              </span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-black/70 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-paper/70 px-4 py-3">
                Đã bán: <span className="font-semibold">{product.sold}</span>
              </div>
              <div className="rounded-2xl border border-black/10 bg-paper/70 px-4 py-3">
                Danh mục: <span className="font-semibold">{product.category?.name}</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                Số lượng
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Button variant="ghost" onClick={() => handleQuantityChange(-1)}>
                  -
                </Button>
                <span className="text-lg font-semibold text-ink">
                  {quantity}
                </span>
                <Button variant="ghost" onClick={() => handleQuantityChange(1)}>
                  +
                </Button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button disabled={product.stock === 0} loading={addingToCart} onClick={handleAddToCart}>
                Thêm vào giỏ
              </Button>
              <Link to="/">
                <Button variant="ghost">Về trang chủ</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-ink p-6 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Gợi ý pha chế
            </p>
            <p className="mt-3 text-sm">
              Rang vừa, phù hợp pour over 15g / 250ml, thời gian chiết 2:30.
            </p>
            <p className="mt-3 text-sm text-white/70">
              Bảo quản nơi khô, tránh ánh sáng, sử dụng tốt nhất trong 30 ngày.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-reef">
              Sản phẩm tương tự
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink">
              Trong cùng danh mục
            </h2>
          </div>
          <Link to="/" className="text-sm font-semibold text-reef">
            Quay lại danh sách
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {similarProducts.length === 0 ? (
            <div className="rounded-[24px] border border-black/10 bg-white/80 p-6 text-sm text-black/70">
              Hiện chưa có sản phẩm tương tự.
            </div>
          ) : (
            similarProducts.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="rounded-[24px] border border-black/10 bg-white/80 p-5 transition hover:-translate-y-1"
              >
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="h-40 w-full rounded-2xl object-cover"
                />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-black/50">
                  {item.category?.name || "Danh mục"}
                </p>
                <h3 className="mt-2 font-display text-2xl text-ink">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm text-black/70">
                  {formatPrice(item.price)}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
