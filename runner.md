use case:


file-1.sql:

========================
-- @patch-name first_patch


create table reference_table(id int, description text);
========================


file-2.sql:

========================
-- @patch-name second_patch
-- @dependencies first_patch

insert into reference_table(id, description) values 
	(1, 'a1'), 
	(2, 'a2');
========================


...

(some time later, after the database is in production, we have to add a new field to the ref table and insert some new values)


file-1.sql:

========================
-- @patch-name first_patch


create table reference_table(id int, description text);

-- @patch-name third_patch
-- no need to add a ependency to first_patch because patches in the same file are executed in order, and the patch above was already executed

alter table reference_table 
add column other_field jsonb default '{}';
========================


file-2.sql:

========================
-- @patch-name second_patch
-- @dependencies first_patch

insert into reference_table(id, description) values (1, 'a1'), (2, 'a2');


-- @patch-name fourth_patch
-- @dependencies third_patch

insert into reference_table(id, description) values (3, 'a3', '{"xyz": 999}');
========================


The fourth_path would have to be executed after third_patch, so we add the dependencies directive to make sure the order is correct (otherwise the default order would be used - first by filename, lexicographic, then, for each file, from top to bottom, which would be ok in this case)






file-10.sql:

========================
-- @patch-name xyz
-- @dependencies ...
-- @no-save

CREATE OR REPLACE FUNCTION  test()
RETURNS void 
AS $fn$

BEGIN


END;

$fn$
LANGUAGE plpgsql;
========================


the no-save directive is used to tell the script runner that this file is not to be saved as a patch, so it will always be executed everytime the runner is executed (as long as the file has actually changed since the last time it was executed - we still have compute and save a sha-1 hash of the contents)

ALTERNATIVE: it's not practical to have to always add a patch name to every patch; we could instead give a global file-level patch-name, and use indexes

@dependencies patch-x.1 (will execute first the second patch of the file referenced by patch-x)

@dependencies patch-x (will execute first all the patches of the file referenced by patch-x)

This makes sense because a patch if a sequence of "changes" that we want to be placed in the same file, for organization purposes. So all those changes should have the same path name (or a similar patch name).


NOTE: the sql filename can be changed without any problems. But the patch-name must never be changed, nor the order of the patches in the file.
NOTE: when a patch involves adding or removing columns to some table, the script should automatically add a note about it in the original patch? better do it manually