# psql-wrapper

### Description

Simple wrapper around the `psql` command line utility using node's [`execSync`](https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options).

Useful to make your own script runner or if you need to make a simple query to a postgres database without the complexity of the [`pg`](https://github.com/brianc/node-postgres) module (the result of the query can be saved to a .cvs file, for instance).

### Install

```sh
npm install --save psql-wrapper
```

### Example

```js

// the module exports a function
var Psql = require('psql-wrapper.js');

// options that won't change can be set once with "configure"
Psql.configure({
    "dbname": "my_db"
});

// to execute psql (via child_process' "execSync"), call the exported function;
// any option that was previously set in "configure" will be overriden
var output = Psql({
    "command": "select c1,c2,c3 from some_table"
});
console.log(output);

// we can also save the results to a csv file using the right combination of
// options from psql
var out = Psql({
    "command": "select c1,c2,c3 from some_table",
    "output": "data.csv",
    "no-align": true,
    "tuples-only": true
});

```

### Options for psql

Both `Psql` (the exported function) and `Psql.configure` accept an object with options to be given to the `psql` command line.

The object's keys should be the names of the options accepted by `psql` (in long format). To see them use `psql --help`.

The object's values are the arguments for the respective options. If the option doesn't allow an argument, the value `true` should be used instead.

If the value is falsy (such as an empty string), that option won't be used at all.

This module will only construct the string to be used with `execSync` (the shell command). It won't make any kind of validation or check to make sure the options are valid. However the `psql` command line is robust about these kinf of issues, so if an invalid option is given it will abort and the error message is explicit about the problem.

### Extra options

The following extra options are available:

 - `checkStderr`: verify if stderr contains the substring 'ERROR:' and throw an error if so. This is useful to abort the execution of a script runner when some script has SQL syntax errors. Default: `true`.
 - `psqlPath`: the path to the `psql` command line utility. Might be necessary if you have several versions of postgres available. Default: `psql`.
 - `displayShellCommand`: display the command to be passed to `execSync`. Default: `true`.
 
 