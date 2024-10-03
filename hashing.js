const crypto = require("crypto");

function createSHA512Hash(data) {
  return crypto.createHash('sha512')
               .update(data, 'utf8')
               .digest('hex');
}

module.exports = createSHA512Hash