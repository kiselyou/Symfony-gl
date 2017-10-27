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