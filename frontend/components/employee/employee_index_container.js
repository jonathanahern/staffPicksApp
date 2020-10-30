import { connect } from 'react-redux';
import { fetchEmployees } from '../../actions/employee_actions';
import EmployeeIndex from './employee_index';

const mapStateToProps = state => ({
    employees: Object.values(state.entities.employees)
});

const mapDispatchToProps = dispatch => ({
    fetchEmployees: () => dispatch(fetchEmployees())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeIndex);