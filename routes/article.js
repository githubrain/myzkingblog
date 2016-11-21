/**
 * Created by 20150129 on 2016/11/16.
 */
var express = require('express');
var router = express.Router();
var auth = require("../use/autoauth.js");
var models = require("../db/index.js");
var utils = require("../utils");
var markdown = require('markdown').markdown;
var multer = require("multer");
var path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }
});
var upload = multer({ storage:storage});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');

});
router.get('/add',auth.checkNotLogin, function(req, res, next) {
    res.render('article/add.ejs', { title: '发布文章'});
});
router.get('/view', function(req, res, next) {
    res.send();
});

//router.post('/add',auth.checkNotLogin,function (req, res) {
//   var article = req.body;
//    models.Article.create(
//        {title:article.title,content:article.content,user:req.session.user._id},
//        function (err,art) {
//        if(err){
//            req.flash("error","发布失败，请稍后再试");
//            res.redirect("article");
//        }else{
//            req.flash("success","发布成功");
//            res.redirect('/');
//        }
//    });
//
//});
//router.get('/detail/:_id', function (req,res) {
//    models.Article.findOne({_id:req.params._id},function(err,article){
//        article.content = markdown.toHTML(article.content);
//        res.render('article/detail',{title:'查看文章',article:article});
//    });
//});

router.post('/add',auth.checkNotLogin, upload.single('img'),function (req, res) {
    req.body.user = req.session.user._id;
    if(req.file){
        req.body.img = path.join('/images',req.file.filename);
    }
    var _id = req.body._id;
    if(_id){
        var set = {title:req.body.title,content:req.body.content};
        models.Article.update({_id:_id},{$set:set},function(err,result){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            req.flash('success', '更新文章成功!');
            res.redirect('/');//注册成功后返回主页
        });
    }else{
        req.body.user = req.session.user._id;
        new models.Article(req.body).save(function(err,article){
            if(err){
                req.flash('error',err);
                return res.redirect('/article/add');
            }
            req.flash('success', '发表文章成功!');
            res.redirect('/');//注册成功后返回主页
        });
    }
});


router.get('/detail/:_id', function (req, res) {
    models.Article.findOne({_id:req.params._id}).populate("user").exec(function(err,article){
        article.content = markdown.toHTML(article.content);
        res.render('article/detail',{title:'查看文章',article:article});
    });
});


router.get('/delete/:_id', function (req, res) {
    models.Article.remove({_id:req.params._id},function(err,result){
        if(err){
            req.flash('error',err);
            res.redirect('back');
        }
        req.flash('success', '删除文章成功!');
        res.redirect('/');//注册成功后返回主页
    });
});

router.get('/edit/:_id', function (req, res) {
   models.Article.findOne({_id:req.params._id},function(err,article){
        res.render('article/edit',{title:'编辑文章',article:article});
    });
});

// get      /article/list3/2 没有搜索关键字
// post    /article/list3/2 有搜索关键字
router.all("/list/:pageNum/:pageSize", function (req,res,next) {
    var pageNum = req.params.pageNum &&req.params.pageNum>0?parseInt(req.params.pageNum):1;
    var pageSize =req.params.pageSize &&req.params.pageSize>0?parseInt(req.params.pageSize):2;
    var query = {};
    var searchBtn = req.query.searchBtn;
    var keyword = req.query.keyword;
    //  如果点击的是搜索按钮，就会有搜索关键字，
    if(searchBtn)
    {
        //   那么就把关键字放到session中，这样换页时，搜索关键字不会消失
        req.session.keyword = keyword;
    }
    if(req.session.keyword){
      // 设置查询条件
      query['title'] = new RegExp(req.session.keyword,'ig');
     }
     console.log("==============="+req.session.keyword);
    //  查询这个关键字的结果一共有多少条
    models.Article.count(query, function (err,count) {
        // 查询符合关键字的当前页数据
        models.Article.find(query)
            .sort({createAt:-1})
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .populate('user').exec(function (err,articles) {
                //articles.forEach(function (article) {
                //    article.content = markdown.toHTML(article.content);
                //});
                res.render('search.ejs',{
                                        title:'主页',
                                        articles:articles,//  保存了页面要显示的数据
                                        count:count,// 查询到的数据一共有多少条
                                        pageNum:pageNum,//当前是第几页
                                        pageSize:pageSize,// 一共有多少页
                                        keyword:req.session.keyword
                                        });
            });
    });


});

router.get('/see', function (req, res) {

});
module.exports = router;