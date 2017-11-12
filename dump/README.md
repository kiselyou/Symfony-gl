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

# Remove User
DROP USER 'iron-war'@'localhost';

# List users
SELECT User FROM mysql.user;

# create user
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP ON iron_war.* TO 'iron-war'@'localhost';
~~~