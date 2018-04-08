/*

select pg_sleep(1); 
insert into test_table(id, name) values(1, 'a1');
select pg_sleep(1); 
insert into test_table(id, namex) values(1, 'a2');
*/


CREATE OR REPLACE FUNCTION  raise_exception_invalid_or_missing_args(function_name txext, arg_name text)
RETURNS void 
AS $fn$

BEGIN

RAISE EXCEPTION USING 
    ERRCODE = 'plpgsql_error',
    MESSAGE = format('function %s was called with missing or invalid arguments (%s)', function_name, arg_name);

END;

$fn$
LANGUAGE plpgsql;
