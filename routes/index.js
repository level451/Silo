
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.jade', { title: 'Express' });
};
exports.led = function(req, res){
    res.render('led.ejs', { title: 'LED' });
};