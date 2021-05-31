const mongoose=require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const Todoschema=mongoose.Schema(
  {
    todos:[{taskName:{type:String,required:true}}],
  })
Todoschema.plugin(autoIncrement.plugin, 'todos');
module.exports=mongoose.model('todos',Todoschema);
