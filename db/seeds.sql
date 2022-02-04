-- Department Values --
INSERT INTO department (department_name)
VALUES ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("None");

-- Role Values --
INSERT INTO role_table (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 3),
        ("Accountant", 125000, 3),
        ("Legal Team Lead", 250000, 4),
        ("Lawyer", 190000, 4),
        ("No role", 0, 5);

-- Employee Values --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Clark", "Kent", 1, 8),
        ("Bruce", "Wayne", 2, 7),
        ("Marc", "Spector", 3, 6),
        ("Jen", "Walters", 4, 5),
        ("Hell", "Boy", 5, 4),
        ("Al", "Simmons", 6, 3),
        ("Trover", "Universe", 7, 2),
        ("Nick", "Valentine", 8, 1);
        