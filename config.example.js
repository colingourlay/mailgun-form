module.exports = {
  fromName: 'The Form',
  to: 'someone@somewhere.com',
  subject: 'New response',
  mailgun: {
    apiKey: 'key-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    domain: 'mailgun.domain.com'
  },
  redirectURL: 'http://somewhere.else.com/sent/',
  serverPort: 8000
};
