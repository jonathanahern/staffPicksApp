import { combineReducers } from "redux";

import EmployeesReducer from "./employee_reducer.js";
import ProductsReducer from "./product_reducer";
import SettingsReducer from "./setting_reducer";
import ErrorsReducer from "./errors_reducer";

const entitiesReducer = combineReducers({
  employees: EmployeesReducer,
  products: ProductsReducer,
  settings: SettingsReducer,
  errors: ErrorsReducer,
});

export default entitiesReducer;