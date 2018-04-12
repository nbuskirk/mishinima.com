var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var characterSchema = new Schema({
  name: String,
  description: String,
  portrait: String,
  moves: Object
});

module.exports = mongoose.model('Character', characterSchema);
