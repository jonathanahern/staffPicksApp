import * as APIUtil from "../util/product_api_util";

export const RECEIVE_PRODUCTS = "RECEIVE_PRODUCTS";
export const RECEIVE_PRODUCT = "RECEIVE_PRODUCT";
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";

const receiveProducts = products => {
    return {
        type: RECEIVE_PRODUCTS,
        products
    }
};

const receiveProduct = (product) => ({
  type: RECEIVE_PRODUCT,
  product,
});

const receiveProductUpdate = (product) => ({
  type: RECEIVE_PRODUCT,
  product,
});

const removeProduct = (productId) => ({
  type: REMOVE_PRODUCT,
  productId,
});

export const fetchProducts = () => dispatch =>
    APIUtil.fetchProducts().then(
        products => dispatch(receiveProducts(products))
    );

export const fetchProduct = (productId) => (dispatch) =>
         APIUtil.fetchProduct(productId).then((product) =>
           dispatch(receiveProduct(product))
         );

export const updateProduct = (product) => (dispatch) =>
         APIUtil.updateProduct(product).then((product) =>
           dispatch(receiveProductUpdate(product))
         );

export const createProduct = (product) => (dispatch) =>
         APIUtil.createProduct(product).then((product) =>
           dispatch(receiveProduct(product))
         );

export const deleteProduct = (productId) => (dispatch) =>
         APIUtil.deleteProduct(productId).then(() =>
           dispatch(removeProduct(productId))
         );