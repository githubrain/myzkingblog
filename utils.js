/**
 * Created by 20150129 on 2016/11/17.
 */
function md5(val){
    return require('crypto').createHash('md5').update(val).digest('hex');
}
exports.md5 = md5;