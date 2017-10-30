#!/usr/bin/env bash
cd
cd Downloads
wget http://download.redis.io/redis-stable.tar.gz
mv redis-stable.tar.gz ../Programs
cd ../Programs
tar xvzf redis-stable.tar.gz
cd redis-stable
make
make test
cp src/redis-server /usr/local/bin/
cp src/redis-cli /usr/local/bin/
mkdir /etc/redis
mkdir /var/redis
cp utils/redis_init_script /etc/init.d/redis_6379
cp redis.conf /etc/redis/6379.conf
mkdir /var/redis/6379

echo 'Call this command line: sudo vim /etc/redis/6379.conf'
echo 'Edit the configuration file, making sure to perform the following changes'
echo 'Set "daemonize" to yes (by default it is set to no).'
echo 'Set the "pidfile" to /var/run/redis_6379.pid'
echo 'Set your "preferred" loglevel'
echo 'Set the "logfile" to /var/log/redis_6379.log'
echo 'Set the "dir" to /var/redis/6379 (very important step!)'
echo 'Save file configuration'
echo 'Call this command line: sudo update-rc.d redis_6379 defaults'