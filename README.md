# C++ with Node.js

connect c++ program to node.js program.
node.js is used as a web server.
A red 3D cylinder will appear by checking http://localhost:3000 with browser.
The position of the red 3D cylinder is controlled by c++ program.
If you execute c++ program after starting node server, the red 3D cylinder will move.
If you stop c++ program, the red 3D cylinder also stop moving.


## How to start

Start node server
```
cd node
npm start
````
Then, the node server will listen on port 3000 at localhost.

Connect c++ program
```
cd cpp
g++ -o cpp main.cc -I. -std=c++11
./cpp
```

## Finish
kill c++ program by typing ctrl+c.
Then, kill node server by typing ctrl+c.
