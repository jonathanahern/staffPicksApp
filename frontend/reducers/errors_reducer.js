import {
    RECEIVE_EMPLOYEE_ERRORS
} from '../actions/employee_actions';

const errorsReducer = (state = [], action) => {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_EMPLOYEE_ERRORS:
            return [...action.errors];
        default:
            return state;
    }
};

export default errorsReducer;