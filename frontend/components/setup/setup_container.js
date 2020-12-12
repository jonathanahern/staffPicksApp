import { connect } from "react-redux";
import { fetchEmployees } from "../../actions/employee_actions";
import { fetchProducts } from "../../actions/product_actions";
import Setup from "./setup";

const mapStateToProps = (state) => ({
  employees: state.entities.employees,
  products: state.entities.products,
});

const mapDispatchToProps = (dispatch) => ({
  fetchEmployees: () => dispatch(fetchEmployees()),
  fetchProducts: () => dispatch(fetchProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Setup);
