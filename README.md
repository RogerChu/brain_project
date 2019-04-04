# brain_project

## Install
```bash
# with npm
npm install express ejs xmlhttprequest mocha rewire supertest
``` 
 
## Run app
```bash
# use command line
node app.js
```

## HTTP Endpoint Test
```bash
# use command line
npm test
# or
mocha
```

#### GET /users
Example:
http://localhost/users

#### GET /users/query
Example:
http://localhost/users?name=root&uid=0&gid=0

#### GET /users/uid
Example: 
http://localhost/users/0
If can''t find the user uid is 0, return 404

#### GET /users/uid/groups
Example: 
http://localhost/users/0/groups
If can''t find the user uid is 0, return 404
  
#### GET /groups
Example: 
http://localhost/groups


#### GET /groups/query
Example: 
curl -v http://localhost/groups?member=_analyticsd&member=_networkd

#### GET /groups/gid
Example:
http://localhost/groups/0
If can''t find the group gid is 0, return 404

Every time If can''t find the passwd or groups files. Metheds will response message can''t find the file.
In each method I will update the data in case changes made to passwd and groups files while the service is running.

I used the express as the web application framework. I used mocha, supertest to test http end point.



