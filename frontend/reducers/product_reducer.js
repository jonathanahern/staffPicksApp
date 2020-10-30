import {
    RECEIVE_PRODUCTS, RECEIVE_PRODUCT, REMOVE_PRODUCT
} from '../actions/product_actions.js';

const ProductsReducer = (oldState = {}, action) => {
    Object.freeze(oldState);
    switch (action.type) {
      case RECEIVE_PRODUCTS:
        return Object.assign({}, action.products);
      case RECEIVE_PRODUCT:
        return Object.assign({}, oldState, {
          [action.product.id]: action.product,
        });
      case REMOVE_PRODUCT:
        let nextState = Object.assign({}, oldState);
        delete nextState[action.productId];
        return nextState;
      default:
        return oldState;
    }
};

export default ProductsReducer;