const http = require('http');
const MailgunJS = require('mailgun-js');
const querystring = require('querystring');
const config = require('./config');

const OK = 'OK';
const HEADERS = {'Content-Type': 'text/plain'};

function done(res, code, extraHeaders) {
  res.writeHead(code, OK, Object.assign((extraHeaders || {}), HEADERS));
  res.end();
}

const mailgun = MailgunJS(config.mailgun);

http.createServer((req, res) => {
  if (req.method !== 'POST') {
    return done(res, 405);
  }

  let queryData = '';

  req.on('data', data => {
    queryData += data;

    if (queryData.length > 1e6) {
      queryData = '';
      done(res, 413);
      return req.connection.destroy();
    }
  });

  req.on('end', () => {
    const query = querystring.parse(queryData)

    const text = Object.keys(query)
    .reduce((message, key) => message + `${key}: ${query[key]}\n`, '');

    console.log(`Message received...\n${text}`);

    mailgun.messages().send({
      from: `${config.fromName || 'Form'} <form@${config.mailgun.domain}>`,
      to: config.to,
      subject: config.subject,
      text: text
    }, err => {
      if (err) {
        return done(res, 500);
      }

      if (config.redirectURL) {
        return done(res, 302, {'Location': config.redirectURL});
      }

      done(res, 200);
    });
  });
}).listen(config.serverPort || 8000);
