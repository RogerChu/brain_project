var express = require("express"),
    app = express(),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    config = require("./config.json");

var path = {
    passwdPath: "file://" + config.development.userPath,
    groupPath: "file://" + config.development.groupPath,
};

function User(name, uid, gid, comment, home, shell) {
  this.name = name;
  this.uid = uid;
  this.gid = gid;
  this.comment = comment;
  this.home = home;
  this.shell = shell
}

function Group(name, gid, members) {
    this.name = name;
    this.gid = gid;
    this.members = members;
}

function readFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    var text = "";
    
    rawFile.onreadystatechange = function ()
    {   
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200)
            {
                text = rawFile.responseText;
            } else {
                text = "error";
            }
        }
    }
    rawFile.send(null);
    return text;
}

function prepareUserData(path) {
    var userText = readFile(path.passwdPath);
    if(userText === "error") return [0,0];
    
    var usersData = new Array();
    var uidToUserMap = new Map();
    
    var users = userText.split('\n');
    users.pop();
    users.forEach(function(each, index, arr){
      users[index] = each.split(':'); 
    });
    users.forEach(function(each, index, arr){
      usersData.push(new User(users[index][0], parseInt(users[index][2]),parseInt(users[index][3]),users[index][4],users[index][5],users[index][6]));
      uidToUserMap.set(users[index][2], users[index][0]);
    });
    return [usersData, uidToUserMap];
}



function prepareGroupData(path) {
    var groupsText = readFile(path.groupPath);
    if(groupsText === "error") return 0;
    
    var groupsData = new Array() ;
    
    var groups = groupsText.split('\n');
    groups.pop();
    groups.forEach(function(each, index, arr){
       groups[index] = each.split(':'); 
    });
    groups.forEach(function(each, index, arr){
        var members = groups[index][3].split(',');
       groupsData.push(new Group(groups[index][0], parseInt(groups[index][2]), members));
    });
    
    return groupsData;
}

function searchUserData(query, searchPool) {
    for(var prop in query) {
        var output = new Array();
        searchPool.forEach(function(element) {
            if(element[prop] == query[prop]) output.push(element);
        });
        searchPool = output;
    }
    return searchPool;
}

function searchGroupData(query, searchPool) {
    for(var prop in query) {
        var output = new Array();
        if(prop != "member") {
            searchPool.forEach(function(element) {
                if(element[prop] == query[prop]) output.push(element);
            });
        } else {
            
            searchPool.forEach(function(element) {
                if(typeof(query[prop]) === "string") {
                    if(element.members.indexOf(query[prop]) != -1) output.push(element);
                } else {
                    var isSubset = true;
                    for(var mem in query[prop]) {
                        if(element.members.indexOf(query[prop][mem]) == -1) isSubset = false;
                    }  
                    if(isSubset) output.push(element);
                }
            });
        }
        searchPool = output;
    }
    return searchPool;
}

app.get("/users", function(req, res){
    var data= prepareUserData(path);
    var usersData = data[0];
    if(usersData === 0) return res.send("I can't find passwd file.");
    
    var searchPool = usersData;
    if(! (Object.keys(req.query).length === 0)) {
         var output = searchUserData(req.query, searchPool);
         res.render("users.ejs", {users: output});
    } else {
        //var json_users = JSON.stringify(usersData);
        res.render("users.ejs", {users: usersData});
    }
});



app.get("/groups", function(req, res){
    var groupsData = prepareGroupData(path);
    if(groupsData === 0) return res.send("I can't find group file.");
    
    var searchPool = groupsData;
    if(! (Object.keys(req.query).length === 0)) {
        var output= searchGroupData(req.query, searchPool);
        res.render("groups.ejs", {groups: output});
    } else {
        res.render("groups.ejs", {groups: groupsData});
    }
});

app.get("/users/:uid", function(req, res){
    var data= prepareUserData(path);
    var usersData = data[0];
    if(usersData === 0) return res.send("I can't find passwd file.");
    
    var found = usersData.some(function(element) {
       if(element.uid == req.params.uid) {
           res.render("user.ejs", {user: element});
           return true;
       }
    });
    
    if(!found) return res.status(404).send('404_error');
});


app.get("/groups/:gid", function(req, res){
    var groupsData=prepareGroupData(path);
    if(groupsData === 0) return res.send("I can't find group file.");
    
    var found = groupsData.some(function(element) {
       if(element.gid == req.params.gid) {
           res.render("group.ejs", {group: element});
           return true;
       }
    });
    if(!found) return res.status(404).send('404_error');
});


app.get("/users/:uid/groups", function(req, res){
    var data= prepareUserData(path);
    var uidToUserMap = data[1];
    if(uidToUserMap === 0) return res.send("I can't find passwd file.");
    
    var groupsData = prepareGroupData(path);
    if(groupsData === 0) return res.send("I can't find group file.");
    
    if(!uidToUserMap.has(req.params.uid)) return res.status(404).send('404_error');
    var name = uidToUserMap.get(req.params.uid);
    var userGroups = new Array();
    
    groupsData.forEach(function(element, index, arr) {
        if(groupsData[index].members.indexOf(name) > -1) userGroups.push(element);
    });
 
    return res.render("userGroups.ejs", {userGroups: userGroups});
});


module.exports = app;

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The App has been started");
});

