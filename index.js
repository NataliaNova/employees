
const express = require('express');
const app = express();
const employees = require('./employees.json');   

app.use(express.json());

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.get('/json', (req, res) => {
    res.json({ message: 'Hello, JSON!' });
  });

app.get('/employees', (req, res) => {
    res.json(employees);
  } );

app.get('/employees/first-two', (req, res) => {
    const firstTwoEmployees = employees.slice(0, 2);
    res.json(firstTwoEmployees);
});

app.get('/employees/second-two', (req, res) => {
    const secondTwoEmployees = employees.slice(2, 4);
    res.json(secondTwoEmployees);
});

app.get('/employees/range/:n', (req, res) => {
    const n = parseInt(req.params.n, 10);
    const startIndex = 2 * (n - 1);
    const endIndex = startIndex + 2;
    const rangeEmployees = employees.slice(startIndex, endIndex);
    res.json(rangeEmployees);
});

app.get('/employees/oldest', (req, res) => {
    if (employees.length === 0) {
        return res.status(404).json({ message: 'No employees found' });
    }

    let oldestEmployee = employees[0];

    for (let i = 1; i < employees.length; i++) {
        if (employees[i].age > oldestEmployee.age) {
            oldestEmployee = employees[i];
        }
    }

    res.json(oldestEmployee);
});

app.get('/employees/users', (req, res) => {
    const userEmployees = employees.filter(employee => employee.privileges === 'user');
    res.json(userEmployees);
});


app.post('/employees', (req, res) => {
  const newEmployee = req.body;
  if (!newEmployee.id || !newEmployee.name || !newEmployee.position || !newEmployee.age || !newEmployee.privileges) {
    return res.status(400).json({ code: 'bad_request' });
  }
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

app.get('/employees/black-badges', (req, res) => {
    const blackBadgeEmployees = employees.filter(employee => employee.badges && employee.badges.includes('black'));
    res.json(blackBadgeEmployees);
  });

app.get('/employees/name/:name', (req, res) => {
    const name = req.params.name;
    const employee = employees.find(employee => employee.name === name);
    if (!employee) {
        return res.status(404).json({ code: 'not_found' });
    }
    res.json(employee);
});

module.exports = app;