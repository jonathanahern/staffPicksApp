import {
    RECEIVE_EMPLOYEES, RECEIVE_EMPLOYEE, REMOVE_EMPLOYEE
} from '../actions/employee_actions.js';

const EmployeesReducer = (oldState = {}, action) => {
    Object.freeze(oldState);
    switch (action.type) {
      case RECEIVE_EMPLOYEES:
        return Object.assign({}, oldState, action.employees);
      case RECEIVE_EMPLOYEE:
        return Object.assign({}, oldState, {
          [action.employee.id]: action.employee,
        });
      case REMOVE_EMPLOYEE:
        let nextState = Object.assign({}, oldState);
        delete nextState[action.employeeId];
        return nextState;
      default:
        return oldState;
    }
};

export default EmployeesReducer;