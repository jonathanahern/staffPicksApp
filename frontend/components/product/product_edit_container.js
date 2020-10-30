import { connect } from 'react-redux';
import {
  fetchProduct,
  deleteProduct,
  updateProduct,
  fetchProducts,
} from "../../actions/product_actions";
import { fetchEmployees } from '../../actions/employee_actions';

import ProductEdit from './product_edit';

const mapStateToProps = (state, ownProps) => ({
  data: document.getElementById("shopify-app-init"),
  product: state.entities.products[ownProps.match.params.productId],
  employees: Object.values(state.entities.employees),
  products: Object.values(state.entities.products),
});

const mapDispatchToProps = (dispatch) => ({
  fetchEmployees: () => dispatch(fetchEmployees()),
  fetchProduct: (productId) => dispatch(fetchProduct(productId)),
  updateProduct: (product) => dispatch(updateProduct(product)),
  deleteProduct: (productId) => dispatch(deleteProduct(productId)),
  fetchProducts: () => dispatch(fetchProducts()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductEdit);