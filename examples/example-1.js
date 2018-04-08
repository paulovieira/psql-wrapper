let Path = require('path');
let Psql = require('../lib');

// execute psql (via child_process' execSync)
/*
console.log('first query...');

let output = Psql({
    'command': 'SELECT now();'
});
console.log(output);


// the output can also be saved to a file using the right combination of options from psql;
// in this example the last line should be deleted
let outputFile = Path.resolve(`data_${ Date.now() }.csv`);

console.log('second query...');

Psql({
    'command': 'SELECT version()',
    'output': outputFile,
    'no-align': true,
    displayShellCommand: false
});

console.log('output was saved to ' + outputFile)
*/


/*
let output = Psql({
    "command": "select pg_sleep(1); insert into test_table(id, namex) values(1, 'xyz');",
    "dbname": "test_db"
}, { psqlPath: '/usr/bin/psql', abortOnError: false});
*/

let output = Psql({
    "file": Path.resolve('test_script.sql'),
    "dbname": "test_db",
});

//console.log(output);