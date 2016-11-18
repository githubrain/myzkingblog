var express = require('express');
var router = express.Router();
var models = require("../db/index.js");
var utils = require("../utils");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/reg', function(req, res, next) {
  res.render('./user/reg.ejs', { title: 'zking博客' });
});
router.get('/login', function(req, res, next) {
  res.render('./user/login.ejs', { title: 'zking博客' });
});

//  路径与上面访问注册页面的路径是一致的，只是动作是post
// 这种设计符合RESTful设计原则app.use(flash());
router.post('/reg', function (req, res) {
   var user = req.body;
  if(user.password==user.repassword){
    models.User.findOne({username:user.username},function(err,doc){
      if(doc){
        console.log("此用户名已被注册");
      }else{
        models.User.create({username:user.username,
          password:utils.md5(user.password),
          email:user.email
        }, function (err,docs) {
          if(err){
            console.log("注册失败");
            console.log("err="+err);
          }
          else{
            console.log("注册成功");
            res.redirect('/users/login');
          }
        })
      }
    });
  }

});

router.post('/login', function (req, res) {
  var user = req.body;
  models.User.findOne({username:user.username,password:user.password}, function (err,doc) {
    if(doc){
      res.redirect("/");
    }
    else{
      res.redirect("/users/login");
    }
  })
});
router.get('/logout', function (req, res) {

});
module.exports = router;
