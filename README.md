# Hometrack

## What it does?
Filter homes based on workflow and type

## Installation
Run insall.sh to install nodejs
Run `npm install` from project root
Run `node run` to start the web server

## Environment
* Ubuntu 14.04
* Node v7.10.0 - use `nvm` to switch to a desired version if you have multiple `node` installed

## Test
### With nodeunit to test
Run `./q.sh rest_hometrack_test.js`, which will read testfiles/request.json as json data sent to server and get response of filtered homes.

To test REST API in different URL, simply change host to your one in rest_hometrack_test.js.

### With curl to test
curl -vX POST http://xxxx:8888/hometrack -d @testfiles/request.json --header "Content-Type: application/json"

curl -vX POST http://xxxx:8888/hometrack -d "{dd:sdfsd}"  --header "Content-Type: application/json"

Note:
In this design, it allows user sending {"payload": [addresses]} and {[addresses]}, means, it will try to see if there is `payload` in the data.

In this design, if no items with workflow completed and type htv, it returns empty array.



