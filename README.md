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
# Prepare environment and start server of production
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