var crypto = require('crypto');
var secret = require('./secret');

module.exports = {
  encrypt: function(text) {
    var cipher = crypto.createCipher(secret.algorithm, secret.cryptionKey);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },
  decrypt: function(encryptedString) {
    var decipher = crypto.createDecipher(secret.algorithm, secret.cryptionKey);
    var dec = decipher.update(encryptedString, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
};
