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

export {
    createUserApi,
    loginApi,
    getUserApi,
    getAccountApi,
    forgotPasswordApi,
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
    cancelOrderApi
}
