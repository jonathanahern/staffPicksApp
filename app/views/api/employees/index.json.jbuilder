@employees.each do |employee|
  json.set! employee.id do
    json.partial! 'employee', employee: employee
  end
end