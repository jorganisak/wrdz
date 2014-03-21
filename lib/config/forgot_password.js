
module.exports = function (app, express) {

var fs = require('fs');

    app.use(require('sesame'));

// example nodemailer config here
var forgot = require('../config/password-reset-module')({
    uri : 'http://localhost:9000/password_reset',
    from: 'password-robot@localhost',
    transportType: 'SMTP',
    transportOptions: {
      service: "Gmail",
      auth: {
        user: "jorganisak@gmail.com",
        pass: "dog1fish"
      }
    },
    sessions: express.cookieParser
});




app.post('/forgot', express.bodyParser(), function(req, res) {

  var email = req.body.email;

  var callback = {
    error: function(err) {
      return res.end('Error sending message: ' + err);
    },
    success: function(success) {
      return res.end('Check your inbox for a password reset message.');
    }
  };
  var reset = forgot(email, callback);

  res.send('200', reset.id);






  // reset.on('request', function(req_, res_) {
  //   console.log('REQUEST HEARD');
  //   req_.session.reset = {
  //     email: email,
  //     id: reset.id
  //   };
  //   fs.createReadStream(__dirname + '/forgot.html').pipe(res_);
  // });
});






// app.post('/reset', function(req, res) {
//   if (!req.session.reset) return res.end('reset token not set');

//   var password = req.body.password;
//   var confirm = req.body.confirm;
//   if (password !== confirm) return res.end('passwords do not match');

//   // update the user db here

//   forgot.expire(req.session.reset.id);
//   delete req.session.reset;
//   res.end('password reset');
// });




}