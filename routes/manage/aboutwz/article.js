
var express=require("express");
var router=express.Router();
var multiparty=require('multiparty');
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
	res.header("X-Powered-By",' 3.2.1');
	// res.header("Content-Type","text/plain");
    res.header("Content-Type","application/json;charset=utf-8");
    next();
});

// 接收图片
router.post('/getImg',function(req,res){
	
	var newPath;
	var form = new formidable.IncomingForm();
	form.uploadDir = "public/temp"; //设置临时目录
	form.keepExtensions = true;   //保存图片后缀名，默认不保存

	var myPath=null;
	// 在post流中检测到任意一个新的文件便会触发该事件
	// 参数file数组，包含文件名，后缀，存放的临时文件夹
	// 参数name字符串，文件名称
	form.on('fileBegin', function(name, file) {
		// console.log("检测到字符串")
	}); 
	// 每当有一对字段/文件已经接收到，便会触发该事件
	form.on('file', function(name, file) {
		// console.log(file.path)
		// myPath=file.path
	}); 
	form.on('end', function() {
		
	});

	// 该方法会转换请求中所包含的表单数据，回调包含所有字段域和文件信息，必须写此方法，否则不接收数据
	form.parse(req, function(error, fields, files) {
			var imgInfor="";
		imgInfor=files.img;
		console.log(imgInfor.path)
		res.json({
				"errno ":0,
				"data":[
					imgInfor.path
				]
			})
	})
		
	// 	var imgInfor="";
	// 	imgInfor=files.img;
		
	// 	var name=parseInt( new Date()/100+Math.round( Math.random()*100));   //定义随机图片名称,防止粘贴上来的图片名称一样
	// 	// 判断图片后缀名
		
	// 	switch(imgInfor.type){
	// 		case "image/jpeg":
	// 			name+=".jpg"
	// 		break;
	// 		case "image/jpg":
	// 			name+=".jpg"
	// 		break;
	// 		case "image/png":
	// 			name+=".png"
	// 		break;
	// 	}
	// 	console.log(name);
	// 	var read=fs.createReadStream(imgInfor.path);  //读取默认目录下的图片
	// 	newPath='/uploadImg/'+name;   //创建保存图片的新的文件
	// 	var write=fs.createWriteStream("public/"+newPath);   //写入路径
	// 	read.pipe(write); 
	// 	// 写入完成
	// 	write.on('close',function (err) { 
	// 		if(err){
	// 			throw err;
	// 		}else{
	// 			res.json({
	// 				"errno ":0,
	// 				"data":[
	// 					newPath
	// 				]
	// 			})
	// 		}
	// 	 })
	// })
	
})
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

// 获取要进行编辑的数据
router.get("/editData",function(req,res,next){
    var getId=req.query.id;    //获取前端发送的文章id
   // 通过文章id获取数据
   model.findById({"_id":getId},function(err,data){
        if(err){
            throw err;
        }else{
			res.send(data);
			
		}
    })
})

// 匹配模式，点击每个导航获取对应值
router.post('/type/:id',function(req,res){
	let typeId=req.params.id;
	console.log(typeId);
	let jsonData={};
	model.find({"kind":typeId},function(err,data){
		if(err) throw err;
		res.send(data);
	   
		// res.json(data);
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