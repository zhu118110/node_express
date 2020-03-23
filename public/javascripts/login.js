// 连接数据库中login的集合,用于验证账号密码

var express=require("express");
var router=express.Router();
var model=require("./db.js");

var schema=new model.Schema({
	"act":String,
	"psw":String
});
var loginmodel=model.model("login",schema,"login");
module.exports=loginmodel;



