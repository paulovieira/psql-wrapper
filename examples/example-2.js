var Psql = require('../lib');

// options that won't change can be set once with 'configure'
Psql.configure({
    "dbname": "rede_convergir_dev"
});

// to execute psql (via child_process' execSync), call the exported function
var data = Psql({
    "command": "SELECT id, name, slug FROM initiatives LIMIT 3"
});
console.log(data);

// we can also save the results using the right combination of options from psql;
// in this example the last line should be deleted
Psql({
    "command": "SELECT id, name, slug FROM initiatives LIMIT 3",
    "output": "examples/data.csv",
    "no-align": true,
    displayShellCommand: false
});
