var express = require('express');
var router = express.Router();
var models = require("../db/index.js");
var utils = require("../utils");
var auth = require("../use/autoauth.js");
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
router.get('/reg',auth.checkLogin, function(req, res, next) {
  res.render('./user/reg.ejs', { title: 'zking博客' });
});
router.get('/login',auth.checkLogin, function(req, res, next) {
  res.render('./user/login.ejs', { title: 'zking博客' });
});

//  路径与上面访问注册页面的路径是一致的，只是动作是post
// 这种设计符合RESTful设计原则app.use(flash());
router.post('/reg',auth.checkLogin,upload.single('img'), function (req, res) {
   var user = req.body;
  if(req.file){
    user.img = path.join('/images',req.file.filename);
  }
  else{
    user.img = "https://s.gravatar.com/avatar/"+utils.md5(user.email)+"7s=40";
  }
  if(user.password==user.repassword){
    models.User.findOne({username:user.username},function(err,doc){
      if(doc){
        req.flash("error","用户名已存在，请重新注册");
        res.redirect("/users/reg");
      }else{
        models.User.create({username:user.username,
          password:utils.md5(user.password),
          email:user.email,
          avatar: user.img
        }, function (err,docs) {
          if(err){
            req.flash("error","注册失败请稍后再试");
            res.redirect("/users/reg");
          }
          else{
            req.flash("success","注册成功，请登录");
            res.redirect('/users/login');
          }
        })
      }
    });
  }
   else{
    req.flash("error","密码和确认密码不一致");
    res.redirect("/users/reg");
  }
});

router.post('/login', function (req, res) {
  var user = req.body;
  models.User.findOne({username:user.username,password:utils.md5(user.password)}, function (err,doc) {
    if(doc){
      //登录成功后，将用户的信息放入session保存
      req.session.user=doc;


      //放入成功的消息
      req.flash("success","登录成功");
      res.redirect("/");
    }
    else{
      //  放入失败的消息
      req.flash("error","登录失败，用户名或者密码错误");
      res.redirect("/users/login");
    }
  })
});
router.get('/logout', function (req, res) {
   req.session.user=null;
  res.redirect("/");
});
module.exports = router;
