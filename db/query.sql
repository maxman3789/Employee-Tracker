SELECT department.id, department.department_name FROM department;

SELECT role_table.id, role_table.title, role_table.salary FROM role_table;

-- employee data, including employee ids, first names, last names, job titles, --
-- departments, salaries, and managers that the employees report to --
-- https://www.w3schools.com/sql/func_sqlserver_concat.asp --
SELECT employee.id, 
employee.first_name, employee.last_name, 
role_table.title, department.department_name, role_table.salary, 
CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
FROM employee
LEFT JOIN employee m ON m.id = employee.manager_id
LEFT JOIN role_table ON employee.role_id = role_table.id
LEFT JOIN department ON role_table.department_id = department.id;

-- INSERT INTO department SET ? --

-- DELETE FROM department WHERE ? --