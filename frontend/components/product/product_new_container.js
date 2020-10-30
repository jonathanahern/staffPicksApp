import { connect } from "react-redux";
import ProductNew from "./product_new";
import { createProduct, fetchProducts } from "../../actions/product_actions";
import { fetchEmployees } from "../../actions/employee_actions";

const mapStateToProps = (state) => ({
  data: document.getElementById("shopify-app-init"),
  product: {
    name: "",
    job_title: "",
    desciption: "",
    profile_url: "",
    shop_id: "",
  },
  employees: Object.values(state.entities.employees),
  products: Object.values(state.entities.products),
});

const mapDispatchToProps = (dispatch) => ({
  createProduct: (product) => dispatch(createProduct(product)),
  fetchEmployees: () => dispatch(fetchEmployees()),
  fetchProducts: () => dispatch(fetchProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductNew);
