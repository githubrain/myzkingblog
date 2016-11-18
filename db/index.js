/**
 * Created by 20150129 on 2016/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    models = require('./models');
var settings = require('../settings');
mongoose.connect(settings.url);
var user = mongoose.model('User', new Schema(models.User));
var articles = mongoose.model('Article', new Schema(models.Article));
global.Model = function (type) {
    return mongoose.model(type);
};
module.exports = {User:user,Article:articles };