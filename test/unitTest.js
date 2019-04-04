var request = require("supertest");
var rewire = require("rewire");
var app = rewire("../app");

describe("App test", function() {
    describe("Users API test", function() {
      beforeEach(function() {
            this.path = {
                passwdPath: "file://" + require("../config.json").testing.userPath,
                groupPath: "file://" + require("../config.json").testing.groupPath,
            };
          app.__set__("path", this.path);
      }); 

       
       it("GETS all users", function(done) {
           request(app).get("/users").expect(200).end(done);
       });
       
       it("GETS user uid is 0 which in users", function(done) {
           request(app).get("/users/0").expect(200).end(done);
       });
       
       it("GETS user uid is 11 which not in users", function(done) {
           request(app).get("/users/11").expect(404).end(done);
       });
       
       it("GETS users/:uid/groups", function(done) {
           request(app).get("/users/0/groups").expect(200).end(done);
       });
       
       it("GETS users/:uid/groups not in users", function(done) {
           request(app).get("/users/1/groups").expect(404).end(done);
       });
       
    });
    describe("Users API search test", function() {
      beforeEach(function() {
            this.path = {
                passwdPath: "file://" + require("../config.json").testing.userPath,
                groupPath: "file://" + require("../config.json").testing.groupPath,
            };
          app.__set__("path", this.path);
      }); 

       
       it("GETS search user uid is 0", function(done) {
           request(app).get("/users?uid=0").expect(200).end(done);
       });
       
       it("GETS search user uid is 0, name is root", function(done) {
           request(app).get("/users?uid=0&name=root").expect(200).end(done);
       });
       
       it("GETS search user uid is 1 which not in users", function(done) {
           request(app).get("/users?uid=1").expect(200).end(done);
       });
       
    });
    describe("Groups API test", function() {
      beforeEach(function() {
            this.path = {
                passwdPath: "file://" + require("../config.json").testing.userPath,
                groupPath: "file://" + require("../config.json").testing.groupPath,
            };
          app.__set__("path", this.path);
      }); 
       
       it("GETS all groups", function(done) {
           request(app).get("/groups").expect(200).end(done);
       });
       
       it("GETS group gid is 250 which is in groups", function(done) {
           request(app).get("/groups/250").expect(200).end(done);
       });
       
       it("GETS group gid is 1 which is not in groups", function(done) {
           request(app).get("/groups/1").expect(404).end(done);
       });
       
    });
    describe("Groups API search test", function() {
      beforeEach(function() {
            this.path = {
                passwdPath: "file://" + require("../config.json").testing.userPath,
                groupPath: "file://" + require("../config.json").testing.groupPath,
            };
          app.__set__("path", this.path);
      }); 

       
       it("GETS search group gid is 250", function(done) {
           request(app).get("/groups?gid=250").expect(200).end(done);
       });
       
       it("GETS search group gid is 250, members has _timed", function(done) {
           request(app).get("/groups?gid=250&member=_timed").expect(200).end(done);
       });
       
       it("GETS search group gid is 1, which not in groups", function(done) {
           request(app).get("/groups?gid=1").expect(200).end(done);
       });
       
    });
});