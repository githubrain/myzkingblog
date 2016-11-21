/**
 * Created by 20150129 on 2016/11/17.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
    User:{ //设置User的数据模型
        username:{type:String,required:true},//用户名
        password:{type:String,required:true},//密码
        email:{type:String,required:true},//邮箱
        avatar:{type:String},
        createAt:{type: Date, default: Date.now}
//avatar:{type:String,required:true}//头像
},
Article: { //设置文章的数据模型
    //  user属性是User表的用户id 所以类型应该是ObjectId,为了表现之间的联系要用ref
    user:{type:ObjectId,ref:'User'}, //用户
    title: String, //标题
    content: String, //内容
    img:String,
    createAt:{type: Date, default: Date.now}// 创建时间
}
};