import * as APIUtil from "../util/employee_api_util";

export const RECEIVE_EMPLOYEES = "RECEIVE_EMPLOYEES";
export const RECEIVE_EMPLOYEE = "RECEIVE_EMPLOYEE";
export const REMOVE_EMPLOYEE = "REMOVE_EMPLOYEE";
export const RECEIVE_EMPLOYEE_ERRORS = 'RECEIVE_EMPLOYEE_ERRORS';

const receiveEmployees = employees => {
    return {
        type: RECEIVE_EMPLOYEES,
        employees
    }
};

const receiveEmployee = (employee) => ({
  type: RECEIVE_EMPLOYEE,
  employee,
});

const receiveEmployeeUpdate = (employee) => ({
  type: RECEIVE_EMPLOYEE,
  employee,
});

const removeEmployee = (employeeId) => ({
  type: REMOVE_EMPLOYEE,
  employeeId,
});

export const fetchEmployees = () => dispatch =>
    APIUtil.fetchEmployees().then(
        employees => dispatch(receiveEmployees(employees))
    );

export const fetchEmployee = (employeeId) => (dispatch) =>
         APIUtil.fetchEmployee(employeeId).then((employee) =>
           dispatch(receiveEmployee(employee))
         );

// export const updateEmployee = (employee) => (dispatch) =>
//          APIUtil.updateEmployee(employee).then((employee) =>
//            dispatch(receiveEmployeeUpdate(employee))
//          );

export const updateEmployee = employee => dispatch => (
  APIUtil.updateEmployee(employee).then(employee => {
    if (!('error' in employee)) {
      dispatch(receiveEmployeeUpdate(employee));
    }
    return employee;
  })
);

// export const createEmployee = (employee) => (dispatch) =>
//          APIUtil.createEmployee(employee).then((employee) =>
//            dispatch(receiveEmployee(employee))
//          ).fail

export const createEmployee = employee => dispatch => (
  APIUtil.createEmployee(employee).then(employee => {
    if (!('error' in employee)){
      dispatch(receiveEmployee(employee));
    }
    return employee;
  })
);

export const deleteEmployee = (employeeId) => (dispatch) =>
         APIUtil.deleteEmployee(employeeId).then(() =>
           dispatch(removeEmployee(employeeId))
         );

export const receiveEmployeeErrors = errors => ({
  type: RECEIVE_EMPLOYEE_ERRORS,
  errors
});