import { connect } from "react-redux";
import { fetchProducts } from "../../actions/product_actions";
import { fetchEmployees } from "../../actions/employee_actions";
import ProductIndex from "./product_index";

const mapStateToProps = (state) => ({
  products: Object.values(state.entities.products),
  employees: Object.values(state.entities.employees),
  entities: Object.values(state.entities),
});

const mapDispatchToProps = (dispatch) => ({
  fetchProducts: () => dispatch(fetchProducts()),
  fetchEmployees: () => dispatch(fetchEmployees())
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductIndex);
