#!/bin/sh

export http_proxy="http://znaproxy.na.pg.com:9400"
export https_proxy="http://znaproxy.na.pg.com:9400"
export ftp_proxy="http://znaproxy.na.pg.com:9400"
export no_proxy="localhost,127.0.0.1,155.118.39.95,resourcescheduler.pg.com"
export HTTP_PROXY="http://znaproxy.na.pg.com:9400"
export HTTPS_PROXY="http://znaproxy.na.pg.com:9400"
export FTP_PROXY="http://znaproxy.na.pg.com:9400"
export NO_PROXY="localhost,127.0.0.1,155.118.39.95,resourcescheduler.pg.com"
echo "Proxy environment variable set."

http_proxy="http://znaproxy.na.pg.com:9400/"
https_proxy="https://znaproxy.na.pg.com:9400/"
no_proxy="localhost,127.0.0.1,*.pg.com"
HTTP_PROXY="http://znaproxy.na.pg.com:9400/"
HTTPS_PROXY="https://znaproxy.na.pg.com:9400/"
NO_PROXY="localhost,127.0.0.1,*.pg.com"

export http_proxy="http://znaproxy.na.pg.com:9400/"
export https_proxy="https://znaproxy.na.pg.com:9400/"
export HTTP_PROXY="http://znaproxy.na.pg.com:9400/"
export HTTPS_PROXY="https://znaproxy.na.pg.com:9400/"

export http_proxy="http://137.183.234.10:8080/"
export https_proxy="http://137.183.234.10:8080/"
export HTTP_PROXY="http://137.183.234.10:8080/"
export HTTPS_PROXY="http://137.183.234.10:8080/"
echo "Proxy environment variable set."

npm config set proxy http://znaproxy.na.pg.com:9400
npm config set https-proxy https://znaproxy.na.pg.com:9400