
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  //res.redirect('/login');

  //// Another sort of optino here

  if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
    next();


};

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
  }
};


//  *  Article authorization routing middleware
 
 

exports.doc = {
  hasAuthorization: function (req, res, next) {
    if (req.doc._owner!= req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
  }
};
