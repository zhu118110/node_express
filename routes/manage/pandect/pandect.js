const fs=require("fs");
var express=require("express");
var router=express.Router();
var model=require('../../../public/javascripts/addArtcle.js');  //引入关于文章集合的model
var pandectModel=require('../../../public/javascripts/pandect.js'); 


router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


// 获取阅读数量,
router.get("/getReadNum",function(req,res){
	let kind=["Vue","h5+css3","Node.js","Mongodb","PHP",]
	let dataObj=[];
	let totle=0;
	model.find({},function(err,data){
		if(err) throw err;
		res.send(data);
		// dataObj=dataObj.concat(data);
		// for(let i in kind){
		// 	for (let j in dataObj){
		// 		if(dataObj[j].kind==kind[i]){
		// 			console.log(dataObj[j])
		// 		}
		// 	}
		// }
	})
})


router.get("/getVisited",function(req,res){
	let today=req.query.today;
	pandectModel.find({},function(err,data){
		if(err) throw err;
		console.log(data);
		res.send(data)
	})
})

module.exports=router;