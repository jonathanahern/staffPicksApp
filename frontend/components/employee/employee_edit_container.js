import { connect } from 'react-redux';
import { fetchEmployee, deleteEmployee, updateEmployee } from '../../actions/employee_actions';
import EmployeeEdit from './employee_edit';

const mapStateToProps = (state, ownProps) => ({
    employee: state.entities.employees[ownProps.match.params.employeeId]
});

const mapDispatchToProps = (dispatch) => ({
  fetchEmployee: (employeeId) => dispatch(fetchEmployee(employeeId)),
  updateEmployee: (employee) => dispatch(updateEmployee(employee)),
  deleteEmployee: (employeeId) => dispatch(deleteEmployee(employeeId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeEdit);