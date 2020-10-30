import React from "react";
import { Route } from "react-router-dom";
import NavBar from "./navbar";
import EmployeeIndexContainer from "./employee/employee_index_container";
import EmployeeNewContainer from "./employee/employee_new_container";
import EmployeeEditContainer from "./employee/employee_edit_container";
import ProductIndexContainer from "./product/product_index_container"
import ProductNewContainer from "./product/product_new_container"
import ProductEditContainer from "./product/product_edit_container";
import SettingsContainer from "./settings/settings_container";

const App = () => (
  <>
    <NavBar />
    <Route exact path="/" component={EmployeeIndexContainer} />
    <Route exact path="/staff" component={EmployeeIndexContainer} />
    <Route exact path="/picks" component={ProductIndexContainer} />
    <Route exact path="/settings" component={SettingsContainer} />
    <Route exact path="/employee/new" component={EmployeeNewContainer} />
    <Route path="/employees/:employeeId/edit" component={EmployeeEditContainer} />
    <Route exact path="/products/new" component={ProductNewContainer} />
    <Route path="/products/:productId/edit" component={ProductEditContainer} />

    {/* <AuthRoute exact path="/" component={Splash} /> */}
  </>
);

export default App;