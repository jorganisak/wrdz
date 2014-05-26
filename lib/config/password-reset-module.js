var url = require('url');
var EventEmitter = require('events').EventEmitter;
var mailer = require('nodemailer');
var ent = require('ent');

module.exports = function (opts) {
    if (typeof opts === 'string') {
        opts = { uri : opts };
    }

    var transport;
    if (opts.transportType && opts.transportOptions) {
        transport = mailer.createTransport(opts.transportType, opts.transportOptions);
    } else {
        console.log("No transport type specified!");
    }

    var reset = new Forgot(opts);

    var self = function (email, cb) {
        var session = reset.generate();
        if (!session) return;

        var uri = session.uri = opts.uri + '?key=' + session.id;

        transport.sendMail({
            sender  : opts.from || 'nodepasswordreset@localhost',
            to      : email,
            subject : opts.subject || 'Wrdz: Reset Your Password',
            text : opts.text || "",
            html :  opts.html || [
                'Click this link to reset your password:\r\n',
                '<br>',
                '<a href="' + encodeURI(uri) + '">',
                ent.encode(uri),
                '</a>',
                ''
            ].join('\r\n')
        }, function (error, success) {
            if (error) {
                if (cb.error) cb.error(error);
                delete reset.sessions[session.id];

            } else {
                if(cb.success) cb.success(success)
            }
        });

        console.log(session);

        return session;
    };

    // self.middleware = reset.middleware.bind(reset);

    // self.expire = function (id) {
    //     delete reset.sessions[id];
    // };

    return self;
};

function Forgot (opts) {
    this.sessions = opts.sessions || {};

    this.mount = url.parse(opts.uri);
    this.mount.port = this.mount.port || 80;
}

Forgot.prototype.generate = function () {
    var buf = new Buffer(16);
    for (var i = 0; i < buf.length; i++) {
        buf[i] = Math.floor(Math.random() * 256);
    }
    var id = buf.toString('base64');

    var session = this.sessions[id] = new EventEmitter;
    session.id = id;
    return session;
};

