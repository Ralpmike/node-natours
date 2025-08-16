const sanitizeHtml = require('sanitize-html');

function sanitizeInput(req, res, next) {
  ['body', 'query', 'params'].forEach((key) => {
    if (req[key]) {
      Object.keys(req[key]).forEach((field) => {
        if (typeof req[key][field] === 'string') {
          req[key][field] = sanitizeHtml(req[key][field], {
            allowedTags: [], // disallow all HTML tags
            allowedAttributes: {}, // disallow attributes
          });
        }
      });
    }
  });
  next();
}

module.exports = sanitizeInput;
