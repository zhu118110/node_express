var express=require("express");
var fs=require("fs");
var router=express.Router();
var model=require("../public/javascripts/comment");   //评论的model
var detailMod=require("../public/javascripts/addArtcle");  //引入文章详情的model
var cmdModel=require("../public/javascripts/comment");  //发表评论的model

var pandectModel=require('../public/javascripts/pandect.js');   //后台总览的model
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 客户端页面点击标题查看文章详情    
// 通过前端传来的文章id进行查找
router.get("/details",function(req,res,next){
  
    var getId=req.query.id;    //获取前端发送的文章id
    var readDate=req.query.readDate?req.query.readDate.split(" ")[0]:"";   //获取进去详情页面的日期,只要年月日
    var kind="";
    let readNum=0;
   // 通过文章id获取数据
   
	detailMod.findById({"_id":getId},function(err,data){
        if(err){
            throw err;
        }else{
            if(!data){
                res.send("0");
                return false;
            }
              //更新文章的阅读数量
            readNum+=data.reading;
            kind=data.kind;
            detailMod.findByIdAndUpdate(getId,{"reading":readNum+=1},function(err,doc){
                if(err){
                    return;
                }else{
                    // 将阅读的日期存入
                    if(readDate!==""){
                        let pandect=new pandectModel({
                            "readDate":readDate,
                            "articleId":getId,
                            "readSum":1,
                            "kind":kind
                        })
                        pandect.save(function(err){
                            if(err) throw err;
                            res.send(data);
                        })
                    }else{
                        res.send(data);
                    }
                   
                }
            })
        }
    })
})

//   刚进入详情页时获取到关于此文章的评论
router.get('/comments/:titleId/:page/:totle',function(req,res){
    let titleId=req.params.titleId;
    let page=req.params.page;   //前端传递的当前显示的第几页
	let totle=req.params.totle;  //每页显示多少条数据
    let pageData;
	// @row :一共有多少条文章
	// @totlePages：总共有几页      总页数=所有文章数量/每页显示的数据
	// @data:要显示的数据
    model.find({"titleId":titleId},function(err,doc){
        if(err){
            res.json({
                data:"0"
            })
        }else{
            pageData=doc.slice( (page-1)*totle,page*totle );
            res.json({
                data:pageData,
                row:doc.length,
                totlePages:Math.ceil(doc.length/totle)
            });
        }
        
    })
})


module.exports=router;
