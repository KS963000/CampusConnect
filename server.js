var express = require("express");
var mysql = require("mysql");
const fileUpload = require("express-fileupload");

var app = express();

app.listen(9000, function () {
    console.log("Server Started..");
});

var dbConfigurationObj = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "tech_titans"
}

var dbRef = mysql.createConnection(dbConfigurationObj);

dbRef.connect(function (err) {
    if (err == null)
        console.log("Connected Succesfuly.......");
    else
        console.log(err.toString());
})

app.use(express.static("public"));

app.get("/", function (req, resp) {
    var absPath = __dirname;
    var path = absPath + "/public/index.html";
    resp.sendFile(path);
});

app.get("/signup-process",function(req,resp){
    var dataAry=[req.query.emailForServer,req.query.pwdForServer];
    dbRef.query("insert into users(email,pwd) values(?,?)",dataAry,function(err){
        if(err==null)
        resp.send("SignedUp Successfully");
        else
        resp.send(err.toString());
    })
})

app.get("/login-process",function(req,resp){
    var dataAry=[req.query.emailForServer,req.query.pwdForServer];
    dbRef.query("select * from users where email=? and pwd=?",dataAry,function(err,table){
        if(err==null)
            if(table.length==1)
        resp.send("Login Successfully");
        // console.log("login successful.....");
        else
        resp.send("Invalid emailid or pwd");

        else
        resp.send(err);
    })
})
app.use(express.urlencoded({extended:true}));

app.post("/signup-form-post",function(req,resp){
    var dataAry=[req.body.uname,req.body.umobile,req.body.ubranch,req.body.uyear,req.body.uemail];
    dbRef.query("update users set name=?,mobile=?,branch=?,year=? where email=?",dataAry,function(err){
        if(err==null)
        {
            var absPath = __dirname;
            var path = absPath + "/public/dash.html";
            resp.sendFile(path);
        }
        else
        resp.send(err);
    })
})