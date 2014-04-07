
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.jade', { title: 'Express' });
};
exports.led = function(req, res){
    res.render('led.ejs', { title: 'LED' });
};
exports.info = function(req, res){
    cSettings.findOne({"type":"gatherer"},{"_id":0},function(err,result){
        if (!result){ gathererSettings={};}else{gathererSettings=result;}

        res.render('info.ejs', { title: 'INFO' });

    });

};
exports.graph = function(req, res){
    console.log("here");
    cSettings.findOne({"type":"gatherer"},{"_id":0},function(err,result){
        if (!result){ gathererSettings={};}else{gathererSettings=result;}
        console.log("req",req.param("graph"));
        res.render('graph.ejs', { title: 'Graph', graph: req.params.graph   });

    });

};


