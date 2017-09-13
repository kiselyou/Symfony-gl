SQL COMMANDS:
------

~~~
# connect
mysql --host=localhost --user=root --password=admin

# connect and select specific database
mysql --host=localhost --user=root -p db_name

# create database
CREATE DATABASE db_name;

# select database
use db_name;

# import
mysql --host=localhost --user=root -p db_name < ./dump/dump.sql

# export
mysqldump --host=localhost --user=root -p db_name > ./dump/dump.sql
~~~
