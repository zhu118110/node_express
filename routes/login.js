// 登录页面，验证账号密码
const fs=require("fs");
var express=require("express");
var router=express.Router();
var login=require('../public/javascripts/login.js')
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});



// 验证账号密码
router.post('/login',function(req,res){
	var post=req.body;    //获取前端通过post方式传过来的账号、密码
	login.find({},function(err,data){
		if(err){
			router.direct("/")
		};
		if(data[0].act==post.act&&data[0].psw==post.psw){
			res.send("1")
		}else{
			res.send("0")
		}
	});
})

module.exports=router;