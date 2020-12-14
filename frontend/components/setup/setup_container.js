import { connect } from "react-redux";
import { fetchEmployees } from "../../actions/employee_actions";
import { fetchProducts } from "../../actions/product_actions";
import {fetchSetting } from "../../actions/setting_actions";
import Setup from "./setup";

const mapStateToProps = (state) => ({
  employees: state.entities.employees,
  products: state.entities.products,
  settings: state.entities.settings,
});

const mapDispatchToProps = (dispatch) => ({
  fetchEmployees: () => dispatch(fetchEmployees()),
  fetchProducts: () => dispatch(fetchProducts()),
  fetchSetting: (shopId) => dispatch(fetchSetting(shopId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Setup);
