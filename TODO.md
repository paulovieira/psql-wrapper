- change the name of the repo to 'node-psql-wrapper'
- test: long-running queries (using the timeout option from execSync); use ctrl+c and sigterm
- use windowsHide (for windows only)
- document: case of having the usernamena and password stored in the pgpassfile: https://www.postgresql.org/docs/8.3/static/libpq-pgpass.html
- document: options must be given as string (except for the boolean case), but  can be given in more permissive form (camelCase, etc)
- document: the option abortOnError was removed
- document: the only default psql option is "--set=ON_ERROR_STOP=on" (this option can be oveeriden to use other psql variables, but it's advisable to keep this one)


