var express = require('express');
// 加载express的路由模块
var router = express.Router();
var models = require("../db/index.js");
var markdown = require('markdown').markdown;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/list/1/2');
  //models.Article.find({}).populate("user").exec(function (err,articles) {
  //  articles.forEach(function (art) {
  //    art.content = markdown.toHTML(art.content);
  //  });
  //  res.render('index', { title: 'zking博客',articles:articles});
  //});

});
router.all("/list/:pageNum/:pageSize", function (req,res,next) {
  var pageNum = req.params.pageNum &&req.params.pageNum>0?parseInt(req.params.pageNum):1;
  var pageSize =req.params.pageSize &&req.params.pageSize>0?parseInt(req.params.pageSize):2;
  //  查询这个关键字的结果一共有多少条
  models.Article.count(function (err,count) {
    // 查询符合关键字的当前页数据
    models.Article.find()
        .sort({createAt:-1})
        .skip((pageNum-1)*pageSize)
        .limit(pageSize)
        .populate('user').exec(function (err,articles) {
          //articles.forEach(function (article) {
          //    article.content = markdown.toHTML(article.content);
          //});
          res.render('index.ejs',{
            title:'主页',
            articles:articles,//  保存了页面要显示的数据
            count:count,// 查询到的数据一共有多少条
            pageNum:pageNum,//当前是第几页
            pageSize:pageSize// 一共有多少页
          });
        });
  });


});

module.exports = router;
