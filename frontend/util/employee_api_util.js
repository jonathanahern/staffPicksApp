export const fetchEmployees = () => {
    return $.ajax({
        url: "api/employees",
        method: "GET"
    });
};

export const fetchEmployee = (employeeId) => {
  return $.ajax({
    url: `api/employees/${employeeId}`,
    method: "GET",
  });
};

export const updateEmployee = (employee) =>
         $.ajax({
           url: `/api/employees/${employee.id}`,
           headers: {
             "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
           },
           method: "patch",
           data: { employee },
         });

export const createEmployee = (employee) =>
         $.ajax({
           url: `api/employees/`,
           method: "POST",
           headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
           data: { employee },
         });

export const deleteEmployee = (employeeId) =>
         $.ajax({
           url: `/api/employees/${employeeId}/`,
           headers: {
             "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
           },
           method: "DELETE",
         });