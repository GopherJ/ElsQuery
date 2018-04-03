#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

echo "Building umd version"
export NODE_ENV=development
../node_modules/.bin/webpack-cli --hide-modules --colors --progress --config webpack.config.js --env development --display-error-details

echo "Building umd minified version"
export NODE_ENV=production
../node_modules/.bin/webpack-cli --hide-modules --colors --progress --config webpack.config.js --env production --display-error-details

sleep 10
