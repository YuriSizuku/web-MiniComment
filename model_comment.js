/*
  A Mini Comment web application db model part with mongoose,
  made by devseed(https://github.com/YuriSizuku/MiniComment)
*/

require('./connect_db');
const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  article_title: String,
  date: {type:Date, default:new Date()}, //this default is the server start time
  ref: {type:mongoose.ObjectId, default:null},
  idx: Number,
  name: String,
  content: String,
  _email: String,
  _hide:{type:Boolean, default:false},
})
const Comment = new mongoose.model("comments", commentSchema);

async function getCommentCount(article_title){
  return await Comment.find({"article_title":article_title}).countDocuments();
}

async function getComment(article_title, skip, limit){
  var comments = await Comment.find({article_title:article_title},
                        {_email:0, _hide:0, __v:0})
                        .skip(skip)
                        .limit(limit)
                        .sort({idx:-1});
  return comments;
}

async function submitComment(article_title, ref, name, email, content){
  idx = await Comment.find({article_title:article_title}).countDocuments();
  if(ref!=undefined){
    res = await Comment.find({id:ref, article_title:article_title})
    if(res==[]) return false;
  }
  comment = new Comment({
    article_title: article_title,
    date: new Date(), 
    ref: ref, 
    idx: idx,
    name: name,
    content: content,
    _email: email, })
  if (res=await comment.save()){
    console.log(res)
    return true;
  }
  return false;
}

module.exports = {Comment, getCommentCount, getComment, submitComment}