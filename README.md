Commands of server: 
-------------------

```
# Install of dependencies
    cd /home/valery/
    sudo chown -R valery:valery galaxy/
    cd galaxy/
    npm update
```

```
# Create configuration
    npm run config:ini
        # If file of configuration has already exist the program will ask confirm. Possible values are below
        # Y - Yes. Rewrite and continue
        # N - No. Not rewrite and continue
        # S - Stop. Not rewrite and Stop
```

```
# Prepare environment and start production server
    npm run start:prod
```

```
# Start server development
    npm run start:dev
```

```
# Additional commands
    npm run build
    npm run build:js
    npm run build:css
    npm run build:ejs
    npm run prepare:prod
```

```
# Auto Start server - development
pm2 start --interpreter babel-node dev/server/index.js
pm2 save
```

```
# Auto Start server - production
pm2 start app/server/index.js
pm2 save
```

```
# Restart server
pm2 restart all
```

```
# Update each dependency in package.json
npm i -g npm-check-updates
npm-check-updates -u
npm install
```

MongoDB settings
-------

```
# create user
mongo
# take use database
use admin
# run command to create user
db.createUser(
  {
    user: "admin",
    pwd: "root",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
# open file
sudo vim /etc/mongod.conf
# uncomment
security:
  authorization: "enabled"
# restart db
sudo systemctl restart mongod
```

Commands of tmux:
-----------------

```
sudo apt install tmux
vim .bashrc
# paste setting to and
[ -z "$TMUX"  ] && { tmux attach || exec tmux new-session && exit;}
# restart console
# commands
# ctrl + b -> c
# ctrl + b -> %
# ctrl + b -> "
# ctrl + b -> p
# ctrl + b -> n
# ctrl + b -> arrows
```


		// db.collection('test_scheme').insert({a:1}, (err, res) => {
			// 	// console.log(err, res);
			// });
			//
			// db.collection('test_scheme').findOne({a:1}, (err, item) => {
			// 	console.log(err, item);
			// });

			// const details = { '_id': this.getObjectID('59f246b4ada98917af7121fc') };
			// db.collection('test_scheme').remove(details, (err, item) => {
			// 	console.log(err, item);
			// });


			// const details = { '_id': this.getObjectID('59f246d35ba2f817dee27abd') };
			// const note = { a: 23232 };
			// db.collection('test_scheme').update(details, note, (err, result) => {
			// 	console.log(err, result);
			// });
			
			
REDIS 4.0.2
===========

######https://redis.io/topics/quickstart

```
cd Downloads
wget http://download.redis.io/redis-stable.tar.gz
cd ../Programs
tar xvzf redis-stable.tar.gz
cd redis-stable
make
make test
sudo cp src/redis-server /usr/local/bin/
sudo cp src/redis-cli /usr/local/bin/
sudo mkdir /etc/redis
sudo mkdir /var/redis
sudo cp utils/redis_init_script /etc/init.d/redis_6379
sudo vim /etc/init.d/redis_6379
#   Make sure to modify REDISPORT accordingly to the port you are using. 
#   Both the pid file path and the configuration file name depend on the port number.
sudo cp redis.conf /etc/redis/6379.conf
sudo mkdir /var/redis/6379
sudo vim /etc/redis/6379.conf
#   Edit the configuration file, making sure to perform the following changes:
#       Set daemonize to yes (by default it is set to no).
#       Set the pidfile to /var/run/redis_6379.pid (modify the port if needed).
#       Change the port accordingly. In our example it is not needed as the default port is already 6379.
#       Set your preferred loglevel.
#       Set the logfile to /var/log/redis_6379.log
#       Set the dir to /var/redis/6379 (very important step!)
sudo update-rc.d redis_6379 defaults
```

Starting Redis
--------------

```
# custom start
redis-server
redis-server /etc/redis.conf
# auto start
sudo /etc/init.d/redis_6379 start
```