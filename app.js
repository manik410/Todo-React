require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const Todoobject=require("./models/todo");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req,res,next)=>
{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});
mongoose.connect(process.env.DB_URL).then(()=>
{
  console.log("Connected To Database");
}).catch(()=>
{
  console.log("Connection Failed");
});
app.get('/getTodos',(req,res)=>{
  Todoobject.find({}).then(docs=>{
    if(docs.length>0)
    {
      res.status(200).json(
        {
          data:docs[0].todos
        }
      )
    }
    else
    {
      res.status(404).json(
        {
          data:"Sorry no data found"
        }
      )
    }
  })
})
app.post("/addTodo",(req,res)=>{
  const body2={todos:[req.body]}
  Todoobject.updateOne({},{$push:body2},{upsert:true},function(err,data){
    if(data)
    { 
      res.status(201).json({msg:"Todo Added Successfully"})
    }
    else
    {
      res.status(500).json({msg:"Internal Server Error"})
    }
  })
})
app.delete("/deleteTodo",(req,res)=>{
  Todoobject.update({},{'$pull':{ 'todos':{'taskName': req.body.task }}},{multi:true},function(err,data)
  {
    if(data)
    {
      console.log("Successfully Deleted");
      res.status(202).json({msg:"Todo Deleted Successfully"})
    }
    else
    {
      console.log("Error in Deleting");
      res.status(500).json({msg:"Internal Server Error"})
    }
  })
});
app.put("/updateTodo",(req,res)=>{
  Todoobject.update( {"todos.taskName":req.body.oldName},{ $set: 
        {
            "todos.$.taskName" : req.body.newName
        } 
     },function(err,data)
     {
       if(data)
       {
         console.log("Successfully Updated");
        res.status(204).json({msg:"Todo Updated Successfully"})
       }
       else
       {
         console.log("Error in Updating");
        res.status(500).json({msg:"Internal Server Error"})
       }
     });
  
})
module.exports=app;