var Psql = require('../lib');

// options that won't change can be set once with 'configure'
Psql.configure({
    "dbname": "rede_convergir_dev"
});

// to execute psql (via child_process' execSync), call the exported function
var data = Psql({
    "command": "SELECT id, name, slug FROM initiatives LIMIT 3"
});
console.log("data: ", data);

// we can also save the results using the right combination of options from psql;
// in this example the last line should be deleted
try {
	Psql({
	    "command": "SELECT id, name, slug FROM initiatives LIMIT 3",
	    "output": "examples/data.csv",
	    "no-align": true,
	    displayShellCommand: false
	});
}
catch(err){
}


try {
	var out = Psql({
	    "file": "examples/script.sql",
	    checkStderr: true
	});
	console.log(out)
}
catch(err){
}