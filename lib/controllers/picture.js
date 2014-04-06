
var pdf = require('wkhtmltopdf');
var fs = require('fs');
var image = require('wkhtmltoimage');


exports.create = function (req, res) {

  var p = fs.createWriteStream('./out.png')

  image.generate("<h1> Hello World! </h1>").pipe(p);
};