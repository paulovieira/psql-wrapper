var Psql = require('../lib');

// options that won't change can be set once with 'configure'
Psql.configure({
    "dbname": "my_db"
});

// to execute psql (via child_process' execSync), call the exported function
var data = Psql({
    "command": "select c1, c2, c3 from some_table"
});
console.log(data);

// we can also save the results using the right combination of options from psql
// in this example the last line should be deleted
var out = Psql({
    "command": "select c1, c2, c3 from some_table",
    "output": "data.csv",
    "no-align": true
});
