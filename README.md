Commands of server: 
------

```
# Install of dependencies
npm update
```

```
# Create configuration
npm run config-ini
# If file of configuration has already exist the program will ask confirm. Possible values are below
# Y - Yes. Rewrite and continue
# N - No. Not rewrite and continue
# S - Stop. Not rewrite and Stop
```

```
# Prepare environment of production
npm run build
```

```
# Start server production
npm run start
```

```
# Start server development
npm run start-dev
```

```
# Auto Start server - development
autostart enable -n "IronWar" -p "/var/www/galaxy" -c "npm run start-dev"
```