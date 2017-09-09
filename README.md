Commands of server: 
------

```
# Install of dependencies
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
# Prepare environment of production
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
autostart enable -n "IronWar" -p "/var/www/galaxy" -c "npm run start"
```

```
# Auto Start server - production
pm2 start processes.json 
    # or
pm2 start app/server/index.js -i max
    # and for expected/unexpected server restart by typing this command
pm2 save
```