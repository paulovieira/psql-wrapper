# psql-wrapper

### Description

Simple wrapper around the `psql` command line using node's [`execSync`](https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options).

Useful to create your own sql runner, or if you need to make a simple query to a postgres database without the complexity of the [`pg`](https://github.com/brianc/node-postgres) module (the result can be saved to a .cvs file)

### Install

```sh
npm install --save psql-wrapper
```

### Example

```js

// the module exports a function
var Psql = require("psql-wrapper.js");

// options that won't change can be set once with the 'configure' method 
Psql.configure({
    dbname: "my_db"
});

// to execute psql (via child_process' execSync), call the exported function
var out = Psql({
    command: "select c1,c2,c3 from some_table",
    output: "test.csv",
    "no-align": true,
    "tuples-only": true
});
console.log(out);

// we can also save the results using the right combination of options from psql
var out = Psql({
    command: "select c1,c2,c3 from some_table",
    output: "out.csv",
    "no-align": true,
    "tuples-only": true
});

```

### Options for psql

Both `psql` (the exported function) and `psql.configure` accept a simple object with options to be used when `psql` is executed.

The object's keys are the names of the options accepted by `psql` (in long format). To see them use `psql --help`.

The object's values are the arguments for the respective options. If the option doesn't allow an argument, the value `true` should be used instead.

If the value is a falsy (such as an empty string), that option won't be used at all.

This module will simply construct the string to be used with `execSync`. It won't make any kind of validation or check. Note that if the option is not recognized by `psql`, it will throw an error.

### Extra options

The following extra options are available:

 - psqlPath: the path to the `psql` command line utility (default is simple 'psql'). Might be necessary if you have several versions of postgres available.
 
