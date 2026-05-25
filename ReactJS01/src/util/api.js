import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }

    return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    }

    return axios.post(URL_API, data)
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API)
}

const getAccountApi = () => {
    const URL_API = "/v1/api/account";
    return axios.get(URL_API)
}

const forgotPasswordApi = (email) => {
    const URL_API = "/v1/api/forgot-password";
    const data = { email };
    return axios.post(URL_API, data)
}

const verifyForgotPasswordOtpApi = (email, otp) => {
    const URL_API = "/v1/api/forgot-password/verify";
    return axios.post(URL_API, { email, otp })
}

const resetPasswordApi = (email, otp, newPassword) => {
    const URL_API = "/v1/api/forgot-password/reset";
    return axios.post(URL_API, { email, otp, newPassword })
}

const getProductsApi = (params) => {
    const URL_API = "/v1/api/products";
    return axios.get(URL_API, { params })
}

const getProductDetailApi = (id) => {
    const URL_API = `/v1/api/products/${id}`;
    return axios.get(URL_API)
}

const getCategoriesApi = () => {
    const URL_API = "/v1/api/categories";
    return axios.get(URL_API)
}

const createProductApi = (productData) => {
    const URL_API = "/v1/api/products";
    return axios.post(URL_API, productData)
}

const createCategoryApi = (categoryData) => {
    const URL_API = "/v1/api/categories";
    return axios.post(URL_API, categoryData)
}

const getCartApi = () => {
    const URL_API = "/v1/api/cart";
    return axios.get(URL_API)
}

const addToCartApi = (productId, quantity = 1) => {
    const URL_API = "/v1/api/cart";
    const data = { productId, quantity };
    return axios.post(URL_API, data)
}

const updateCartApi = (productId, quantity) => {
    const URL_API = "/v1/api/cart";
    const data = { productId, quantity };
    return axios.put(URL_API, data)
}

const removeFromCartApi = (productId) => {
    const URL_API = `/v1/api/cart/${productId}`;
    return axios.delete(URL_API)
}

const clearCartApi = () => {
    const URL_API = "/v1/api/cart";
    return axios.delete(URL_API)
}

const createOrderApi = (orderData) => {
    const URL_API = "/v1/api/orders";
    return axios.post(URL_API, orderData)
}

const getOrdersApi = () => {
    const URL_API = "/v1/api/orders";
    return axios.get(URL_API)
}

const getOrderDetailApi = (orderId) => {
    const URL_API = `/v1/api/orders/${orderId}`;
    return axios.get(URL_API)
}

const cancelOrderApi = (orderId, reason) => {
    const URL_API = `/v1/api/orders/${orderId}/cancel`;
    return axios.post(URL_API, { reason })
}

const validateVoucherApi = (code) => {
    const URL_API = "/v1/api/vouchers/validate";
    return axios.post(URL_API, { code })
}

// Admin APIs
const getAdminDashboardApi = () => {
    const URL_API = "/v1/api/admin/dashboard";
    return axios.get(URL_API)
}

const getAdminOrdersApi = () => {
    const URL_API = "/v1/api/admin/orders";
    return axios.get(URL_API)
}

const getAdminOrderDetailApi = (orderId) => {
    const URL_API = `/v1/api/admin/orders/${orderId}`;
    return axios.get(URL_API)
}

const updateAdminOrderStatusApi = (orderId, payload) => {
    const URL_API = `/v1/api/admin/orders/${orderId}/status`;
    return axios.put(URL_API, payload)
}

const updateAdminOrderPaymentStatusApi = (orderId, payload) => {
    const URL_API = `/v1/api/admin/orders/${orderId}/payment`;
    return axios.put(URL_API, payload)
}

const updateAdminProductApi = (productId, payload) => {
    const URL_API = `/v1/api/admin/products/${productId}`;
    return axios.put(URL_API, payload)
}

const deleteAdminProductApi = (productId) => {
    const URL_API = `/v1/api/admin/products/${productId}`;
    return axios.delete(URL_API)
}

const updateAdminCategoryApi = (categoryId, payload) => {
    const URL_API = `/v1/api/admin/categories/${categoryId}`;
    return axios.put(URL_API, payload)
}

const deleteAdminCategoryApi = (categoryId) => {
    const URL_API = `/v1/api/admin/categories/${categoryId}`;
    return axios.delete(URL_API)
}

const getAdminUsersApi = () => {
    const URL_API = "/v1/api/admin/users";
    return axios.get(URL_API)
}

const getAdminUserDetailApi = (userId) => {
    const URL_API = `/v1/api/admin/users/${userId}`;
    return axios.get(URL_API)
}

const updateAdminUserLockApi = (userId, isLocked) => {
    const URL_API = `/v1/api/admin/users/${userId}/lock`;
    return axios.put(URL_API, { isLocked })
}

const getAdminVouchersApi = () => {
    const URL_API = "/v1/api/admin/vouchers";
    return axios.get(URL_API)
}

const createAdminVoucherApi = (payload) => {
    const URL_API = "/v1/api/admin/vouchers";
    return axios.post(URL_API, payload)
}

const updateAdminVoucherApi = (id, payload) => {
    const URL_API = `/v1/api/admin/vouchers/${id}`;
    return axios.put(URL_API, payload)
}

const deleteAdminVoucherApi = (id) => {
    const URL_API = `/v1/api/admin/vouchers/${id}`;
    return axios.delete(URL_API)
}

const getAdminReviewsApi = (status) => {
    const URL_API = "/v1/api/admin/reviews";
    return axios.get(URL_API, { params: { status } })
}

const approveAdminReviewApi = (id) => {
    const URL_API = `/v1/api/admin/reviews/${id}/approve`;
    return axios.put(URL_API)
}

const deleteAdminReviewApi = (id) => {
    const URL_API = `/v1/api/admin/reviews/${id}`;
    return axios.delete(URL_API)
}

export {
    createUserApi,
    loginApi,
    getUserApi,
    getAccountApi,
    forgotPasswordApi,
    verifyForgotPasswordOtpApi,
    resetPasswordApi,
    getProductsApi,
    getProductDetailApi,
    getCategoriesApi,
    createProductApi,
    createCategoryApi,
    getCartApi,
    addToCartApi,
    updateCartApi,
    removeFromCartApi,
    clearCartApi,
    createOrderApi,
    getOrdersApi,
    getOrderDetailApi,
    cancelOrderApi,
    validateVoucherApi,
    getAdminDashboardApi,
    getAdminOrdersApi,
    getAdminOrderDetailApi,
    updateAdminOrderStatusApi,
    updateAdminOrderPaymentStatusApi,
    updateAdminProductApi,
    deleteAdminProductApi,
    updateAdminCategoryApi,
    deleteAdminCategoryApi,
    getAdminUsersApi,
    getAdminUserDetailApi,
    updateAdminUserLockApi,
    getAdminVouchersApi,
    createAdminVoucherApi,
    updateAdminVoucherApi,
    deleteAdminVoucherApi,
    getAdminReviewsApi,
    approveAdminReviewApi,
    deleteAdminReviewApi
}
