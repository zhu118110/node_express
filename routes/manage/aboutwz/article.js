
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


var imgNumber=0;

// 接收图片
router.post('/getImg',function(req,res){
	
	var newPath;
	var form = new formidable.IncomingForm();
	form.uploadDir = "public/temp"; //设置临时目录
	form.keepExtensions = true;   //保存图片后缀名，默认不保存
	// 每当有一对字段/文件已经接收到，便会触发该事件
	form.on('file', function(name, file) {
		imgNumber+=1;
		console.log("接收到文件"+imgNumber+"个")
	}); 
	
	// 该方法会转换请求中所包含的表单数据，回调包含所有字段域和文件信息。必须写此方法，否则不接收数据
	form.parse(req, function(error, fields, files) {
		var imgInfor="";
		imgInfor=files.img;
		// 将图片的临时文件路径返回给前端
		res.json({
			"errno ":0,
			"data":[
				imgInfor.path     // public\temp\图片名.jpg
			]
		})
	})
		
	// 	var name=parseInt( new Date()/100+Math.round( Math.random()*100));   //定义随机图片名称,防止粘贴上来的图片名称一样
	// 	// 判断图片后缀名
		
})

//增: 往数据库存储后台页面发布的文章信息
router.post('/getAdd',function(req,res){
		let temp="E:/vue+express/myapp/public/temp/";   //本地临时文件夹
		let imgArr=[];
		// 功能:
		// 		前端点击发表按钮，后端先去临时文件夹读取所有图片，并将图片读取到新的文件夹中，再将临时文件夹清空
		// 过程:
		// 		1.fs.readdir(路径，callback(err,files))   //先读取 临时文件夹 下的所有文件,参数files是一个数组，包括文件夹下的所有文件
		//      2.fs.createReadStream(路径名+文件名)   遍历临时文件夹的所有文件，创建读取流读取文件内容。
		//      3.创建新的文件夹用来保存读取的文件内容；
		//      4.fs.createWriteStream(路径)   写入到的新路径；
		//      5.创建管道流 开始执行上述步骤  fs.createReadStream.pipe(fs.createWriteStream)
		//      6.写入完成后用 fs.unlink(临时路径) 删除临时文件夹下的所有内容
		fs.readdir(temp,function(err,files){
			if(err){
				throw err;
			}else{
				// files:[]
				for(let i in files){
					imgArr.push(files[i])
					var read=fs.createReadStream(temp+files[i]);  //读取默认目录下的图片
					var newPath='/uploadImg/'+files[i];   //创建保存图片的新的文件路径
					var write=fs.createWriteStream("public/"+newPath);   //设置新的路径
					read.pipe(write); 
					// 写入完成后执行
					write.on('close',function (err) { 
						if(err){
							throw err;
						}else{
							// 清空临时文件夹
							fs.unlink(temp+files[i],function(err){
								if(err) throw err;
								console.log("删除成功")
							})
						}
					 })
				}
			}
		})
		
		// 功能:前端点击发表，将提交的标题、分类、内容、作者保存到数据库;
		// 过程:
		//     1.实例化数据库的实体new model()，用来对数据库进行增删改查
		//     2.将上传的内容中\temp\字段改为\uploadImg\；因为图片临时文件夹已清空,图片已被写入uploadImg文件夹下
		//     3.enity.save监听数据写入是否成功,失败返回0，成功返回1
		let enity=new model();  
		enity.title=req.body.title;
		var content=req.body.content;
		content=content.replace(/\\temp\\/g,"\\uploadImg\\");   //替换掉图片临时路径，改为数据库图片路径
		enity.content=content;
		enity.kind=req.body.kind;
		enity.date=req.body.date;
		if(req.body.writer!==""){ 	//  如果发布时没输入作者名称则使用数据库默认指定的值
			enity.writer=req.body.writer;
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
// 	// 删除文章
// 	model.remove({"_id":id},function(err){
// 		if(err) throw err;
// 		// 根据标题id查找到评论集合里的评论进行删除
// 		cmtModel.remove({"titleId":id},function(err,data){
// 			if(err){
// 				throw err
// 			}else{
// 				replyModel.remove({"titleId":id},function(err,data){
// 					if(err) throw err;
					
// 					res.send("1")
// 				})
// 			}
			
// 		})

// 	})
// })


router.get('/del',function(req,res){
	let id=req.query.id;
	// 删除文章
	function articleRemove(id){
	
		let selectId=new Promise((resolve,reject)=>{
			model.deleteOne({"_id":id},function(err){
				if(err){
					reject("删除文章失败")
				}else{
					resolve(id)
				}
			})
		})
		return selectId;
	}
	// 删除评论
	function cmtRemove(id){
		let cmtRemove=new Promise((resolve,reject)=>{
			cmtModel.deleteOne({"titleId":id},function(err,data){
				if(err){
					reject("删除评论失败")
				}else{
					resolve(id)
				}
			})
		})
		return cmtRemove;
	}
	// 删除回复
	function replyMove(id){
		let replyMove=new Promise((resolve,reject)=>{
			replyModel.deleteOne({"titleId":id},function(err,data){
				if(err){
					reject("删除回复失败")
				}else{
					res.send("1")
				}
			})
		})
		return replyMove;
	}

	articleRemove(id)
	.then((res)=>{
		return cmtRemove(res);
	})
	.then((res)=>{
		return replyMove(res);
	})
	.catch((err)=>{
		console.log(err)
		res.send("0")
	})
})



module.exports=router;