
var express=require("express");
var router=express.Router();
var fs=require("fs");
var formidable = require('formidable');

var model=require('../../../public/javascripts/addArtcle.js');  //引入关于文章集合的model

var cmtModel=require('../../../public/javascripts/comment.js');  //引入关于评论集合的model

var replyModel=require('../../../public/javascripts/reply.js');  //引入关于回复集合的model
// 跨域
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


//增: 往数据库存储后台页面发布的文章信息
router.post('/getAdd',function(req,res){
	let enity=new model();  
	enity.title=req.body.title;
	enity.content=req.body.content;
	enity.kind=req.body.kind;
	enity.date=req.body.date;
	if(req.body.writer!==""){ 	//  如果发布时没输入作者名称则使用数据库默认指定的值
		enity.writer=req.body.writer
	}
	enity.save(function(err){
		if(err){
			res.send("0")
		}else{
			res.send("1");
		}
	});
})


//查: 后台页面点击查看文章,后端返回所有的文章信息
//    前端侧边栏热门文章
router.get('/look',function(req,res){
	model.find({},function(err,data){
		if(err) throw err;
		res.send(data);
	})
})


// 匹配模式，点击导航获取对应值
router.get('/type/:id',function(req,res){
	let typeId=req.params.id;
	model.find({"kind":typeId},function(err,data){
		if(err) throw err;
		res.send(data);
	})
})


//改: 后台页面编辑文章提交的新的数据.
		// 根据前端传入的文章id进行对应的更新

router.get('/alter',function(req,res){
	//获取要更新的文章Id
	let id=req.query.id;   
	// 更新内容
	model.update({"_id":id},{
		"$set":{
			"title":req.query.title,
			"content":req.query.content,
			"writer":req.query.writer,
			"date":req.query.date
		}
	},function(err,data){
		if(err) throw err;
		res.send("1");
	})
})

// 删:后台页面删除文章
	// 根据提交的文章id查找到对应文章进行删除
	// 根据提交的文章id去评论表查找到对应评论进行删除
// router.get('/del',function(req,res){
// 	let id=req.query.id;
// 	model.remove({"_id":id},function(err){
// 		if(err) throw err;
// 		// 根据id查找到评论集合里的文章进行删除
// 		cmtModel.remove({"titleId":id},function(err,data){
// 			if(err) throw err;
// 			// res.send('1');
// 		})
		
// 	})
	
// })


router.get('/del',function(req,res){
	let id=req.query.id;
	// 删除文章
	model.remove({"_id":id},function(err){
		if(err) throw err;
		// 根据标题id查找到评论集合里的评论进行删除
		cmtModel.remove({"titleId":id},function(err,data){
			if(err){
				throw err
			}else{
				replyModel.remove({"titleId":id},function(err,data){
					if(err) throw err;
					
					res.send("1")
				})
			}
			
		})

		

	})
	
})


module.exports=router;