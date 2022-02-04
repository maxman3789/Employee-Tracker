const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require('mysql2');
//const mysql = require('mysql');

// https://www.tabnine.com/code/javascript/functions/mysql/createConnection

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      // port: 3001,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'Zaq1@wsx',
      database: 'employee_tracker'
});

db.connect(function (err) {
    if (err) {
        throw err
    };
    init();
  });  

function init() {
    inquirer.prompt(
      [
        {
          type: "rawlist",
          name: "employees",
          message: "What would you like to do?",
          choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Remove Department",
            "Add Role",
            "Remove Role",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Exit"
          ]
        }
      ]).then(function(res) {
        if (res.employees === "View All Departments") {
          viewAllDepartments();
        } else if (res.employees === "View All Roles") {
          viewAllRoles();
        } else if (res.employees === "View All Employees") {
          viewAllEmployees();
        } else if (res.employees === "Add Department") {
          addDepartment();
        } else if (res.employees === "Remove Department") {
          removeDepartment();
        } else if (res.employees === "Add Role") {
          addRole();
        } else if (res.employees === "Remove Role") {
          removeRole()
        } else if (res.employees === "Add Employee") {
          addEmployee();
        } else if (res.employees === "Remove Employee") {
          removeEmployee();
        } else if (res.employees === "Update Employee Role") {
          updateEmployeeRole();
        } else if (res.employees === "Exit") {
            db.end();
        }
      });
}

function viewAllDepartments() {
    const query = db.query(`SELECT department.id, department.department_name FROM department`,
      function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        init();
      });
  }

  function viewAllRoles() {
    const query = db.query(`SELECT role_table.id, role_table.title, role_table.salary FROM role_table`,
      function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        init();
      });
  }

  function viewAllEmployees() {
    const query1 = db.query(`
    SELECT employee.id, 
employee.first_name, employee.last_name, 
role_table.title, department.department_name, role_table.salary, 
CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
FROM employee
LEFT JOIN employee m ON m.id = employee.manager_id
LEFT JOIN role_table ON employee.role_id = role_table.id
LEFT JOIN department ON role_table.department_id = department.id;`,
    function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        init();
      });
  }

  function addDepartment() {
    inquirer.prompt(
      [
        {
          type: "input",
          name: "department_name",
          message: "What department you like to add?"
        }
      ]
    ).then(function(answers){
      const query = db.query(`INSERT INTO department SET ?`,
        {
          department_name: answers.department_name,
        },
        function (err, res) {
          if (err) {
            throw err;
          }
          init();
        });
      });
  }
  
  function removeDepartment() {
    const query = db.query("SELECT * FROM department",
    function (err, res) {
      const allDepartments = res;
      let allDepartmentNames = [];
      let departmentIds = [];
      allDepartments.forEach(departmentData => {
        allDepartmentNames.push(departmentData.department_name);
        departmentIds.push(departmentData.id);
      });
      if (allDepartments.length > 0) {  
        inquirer.prompt(
          {
            type: "rawlist",
            name: "department",
            message: "Which department would you like to remove?",
            choices: allDepartmentNames
          }
        ).then(function(answers) {  
          const query = db.query("DELETE FROM department WHERE ?",
            {
              id: departmentIds[allDepartmentNames.indexOf(answers.department)]
            },
            function (err, res) {
              if (err) {
                throw err;
              }
              init();
          });
        });
      } else {
        init();
      }
    });
  }

  function addRole() {
    departmentArray = [];
    const query = db.query("SELECT * FROM department",
      function (err, res) {
        if (err) {
          throw err;
        }
        res.forEach(department => departmentArray.push(department.department_name));
      });
  
    inquirer.prompt(
      [
        {
          type: "input",
          name: "title",
          message: "What role are you adding?"
        },
        {
          type: "input",
          name: "salary",
          message: "What is this role's salary?"
        },
        {
          type: "rawlist",
          name: "department",
          message: "Which department is tied to this role?",
          choices: departmentArray
        }
      ]
    ).then(function(answers){
      const query = db.query(`INSERT INTO role_table SET ?`,
        {
          title: answers.title,
          salary: answers.salary,
          department_id: departmentArray.indexOf(answers.department) + 1
        },
        function (err, res) {
          if (err) {
            throw err;
          }
          init();
        });
      });
  }
  
  function removeRole() {
    const query = db.query("SELECT * FROM role_table",
    function (err, res) {
      const allRoles = res;
      let allRoleTitles = [];
      let roleIds = [];
      allRoles.forEach(roleData => {
        allRoleTitles.push(roleData.title);
        roleIds.push(roleData.id);
      });
      if (allRoles.length > 0) {  
        inquirer.prompt(
          {
            type: "rawlist",
            name: "role",
            message: "Which role would you like to remove?",
            choices: allRoleTitles
          }
        ).then(function(answers){  
          const query = db.query("DELETE FROM role_table WHERE ?",
            {
              id: roleIds[allRoleTitles.indexOf(answers.role)]
            },
            function (err, res) {
              if (err) {
                throw err;
              }
              init();
          });
        });
      } else {
        init();
      }
    });
  }

  function addEmployee() {
    const query = db.query(`SELECT employee.first_name, employee.last_name, role_table.title 
    FROM employee INNER JOIN role_table ON employee.role_id = role_table.id;`,
      function (err, res) {
        if (err) {
          throw err;
        }
  
        let roleArray = [];
        let employeeArray = [];
        employeeArray = ["NONE"];
        let employeeIDs = [];
  
        const query1 = db.query("SELECT * FROM role_table",
          function (err, res) {
            if (err) {
              throw err;
            }
            res.forEach(role => roleArray.push(role.title));
          });
  
        const query2 = db.query("SELECT * FROM employee",
        function (err, res) {
          if (err) {
            throw err;
          }
          res.forEach(employeeId => employeeIDs.push(employeeId.id));
          res.forEach(employee => employeeArray.push(`${employee.first_name} ${employee.last_name}`));
        });
        
        inquirer.prompt(
          [
            {
              type: "input",
              name: "firstName",
              message: "What is the employee's first name?"
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the employee's last name?"
            },
            {
              type: "rawlist",
              name: "role",
              message: "What is the employee's role?",
              choices: roleArray
            },
            {
              type: "rawlist",
              name: "manager",
              message: "Who is the employee's manager?",
              choices: employeeArray
            }
          ]
        ).then(function(answers) {
          let employeeIDIndex = employeeArray.indexOf(answers.manager) - 1;
          db.query("INSERT INTO employee SET ?",
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: roleArray.indexOf(answers.role) + 1,
            manager_id: employeeIDs[employeeIDIndex]
          },
          function (err, res) {
            if (err) {
              throw err;
            }
            init();
          }
        );
      });
    });
  }
  
  function removeEmployee() {
    const query = db.query("SELECT * FROM employee",
      function (err, res) {
        const allEmployees = res;
        let allEmployeeNames = [];
        let employeeIds = [];
        allEmployees.forEach(employeeData => {
          allEmployeeNames.push(`${employeeData.first_name} ${employeeData.last_name}`);
          employeeIds.push(employeeData.id);
        });
        if (allEmployees.length > 0) {  
          inquirer.prompt(
            {
              type: "rawlist",
              name: "employee",
              message: "Which employee would you like to remove?",
              choices: allEmployeeNames
            }
          ).then(function(answers){  
  
            const query = db.query("DELETE FROM employee WHERE ?",
              {
                id: employeeIds[allEmployeeNames.indexOf(answers.employee)]
              },
              function (err, res) {
                if (err) {
                  throw err;
                }
                init();
            });
          });
        } else {
          init();
        }
    });
  }

  function updateEmployeeRole() {
    const query = db.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role_table.title, employee.role_id
      FROM employee
      INNER JOIN role_table ON employee.role_id = role_table.id;`,
      function (err, res) {
        if (err) {
          throw err;
        }
        let allEmployees = res;
        let allEmployeeNames = [];
        let allRoleTitles = [];
        let employeeIds = [];
        let roleIds = [];
  
        const query2 = db.query("SELECT * FROM role_table",
        function (err, res) {
          if (err) {
            throw err;
          }
          res.forEach(role => {
            roleIds.push(role.id);
            allRoleTitles.push(role.title)
          });
        });
  
        allEmployees.forEach(employeeData => {
          allEmployeeNames.push(`${employeeData.first_name} ${employeeData.last_name}`);
          employeeIds.push(employeeData.id);
        });
  
        if (allEmployees.length > 0) {
          inquirer.prompt(
            [
              {
                type: "rawlist",
                name: "employee",
                message: "Which employee would you like to change the role of?",
                choices: allEmployeeNames
              },
              {
                type: "rawlist",
                name: "newRole",
                message: "Which role would you like to assign to this employee?",
                choices: allRoleTitles
              }
            ]
          ).then(function(answers) {
            const query = db.query(`UPDATE employee SET ? WHERE ?`,
            [
              {
                role_id: roleIds[allRoleTitles.indexOf(answers.newRole)]
              },
              {
                id: employeeIds[allEmployeeNames.indexOf(answers.employee)]
              }
            ],
            function (err, res) {
              if (err) {
                throw err;
              }
              init();
          });
        });
      } else {
        init();
      }
    });
  }

