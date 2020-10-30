import { connect } from "react-redux";
import EmployeeNew from "./employee_new";
import { createEmployee } from "../../actions/employee_actions";

const mapStateToProps = (state) => ({
  employee: {
    name: "",
    job_title: "",
    desciption: "",
    profile_url: "",
    shop_id: ""
  },
  errors: state.entities.errors
});

const mapDispatchToProps = (dispatch) => ({
  createEmployee: (employee) => dispatch(createEmployee(employee))
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeNew);
