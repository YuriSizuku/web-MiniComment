/*
  A Mini Comment web application api server part with nodejs,
  made by devseed (https://github.com/YuriSizuku/MiniComment)

  GET /api/captcha/
     return {data, hash};
  GET /api/comment/
      article_title: str
      return {count}
  GET /api/comment/count
      return {comment_count:}
  GET /api/comment/get
    article_title : str
    [skip : int]
    [limit : int]
    return: [{_id, article_title, data, ref, idx, name, content}...]
  GET /api/comment/refidx
    ref: ObjectId
    return {refidx}
  POST /api/comment/submit
    article_title : str
    [ref : ObjectId]
    name : str
    [email : str]
    content : str
    capcha_code: str
    capcha_hash: str
*/

const express = require('express');

const crypto = require('crypto');
const svgCaptcha = require('svg-captcha');
const {Comment, getComment, submitComment, getCommentCount} = require('./model_comment'); //datebase

const router = express.Router();
var SALT = svgCaptcha.randomText(4);

(function loop(interval){
  //console.log("SALT changed!");
  SALT = svgCaptcha.randomText(4);
  setTimeout( ()=>{loop(interval)}, interval)
})(600000);

const corsMid = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Expose-Headers', '*'); //use all headers
  next();
}

const authCaptchaMid = async(req, res, next) => {
  let text = req.body.captcha_code;
  let hash = req.body.captcha_hash;
  if(text!=undefined && hash!=undefined ){
    let hash2 = crypto.createHash('sha1').update(text.toLowerCase() + SALT).digest('hex');
    //console.log(text, hash, hash2);
    if(hash2==hash) {
      next();
      return;
    }
  }
  res.writeHead(400, {message:"Captcha wrong, Please input again!"});
  res.end();
}

const logMid = async(req, res, next) =>{
  console.log(req.ip, req.header('x-forwarded-for'),
    req.path, req.query, req.body);
  next();
}

router.get('/api/captcha', logMid, corsMid, async (req, res) => {
  let cap = svgCaptcha.create({height:30, width:90, fontSize:30});
  let hash = crypto.createHash('sha1').update(cap.text.toLowerCase() + SALT).digest('hex');
  res.json({data:cap.data, hash:hash});
 })

router.get('/api/comment/count', logMid, corsMid, async (req, res) => {
  count = await getCommentCount(req.query.article_title);
  res.json({count:count});
 })

router.get('/api/comment/get', logMid, corsMid, async (req, res) => {
  var {article_title, limit, skip} = req.query;
  if (article_title==undefined)
  {
      console.log("invalid argument")
      res.writeHead(400, {message:"Invalid argument!"})
      res.end()
      return;
  }
  skip = parseInt(skip);
  limit =  parseInt(limit);
  if(limit==undefined || limit == NaN) limit = 10;
  if(skip==undefined || skip == NaN) skip = 0;  
  comments = await getComment(article_title, skip, limit);
  res.json(comments);
 })

router.get("/api/comment/refidx", logMid, corsMid, async (req, res) => {
  var {ref} = req.query;
  var comment = await Comment.findById(ref);
  res.json({refidx: comment.idx});
  return;
})

router.post('/api/comment/submit', logMid, corsMid, authCaptchaMid, async (req, res) => {
  var {article_title, ref, name, email, content} = req.body;
  if(article_title==undefined || name==undefined || content==undefined){
    res.writeHead(400, {message:"Invalid argument"})
    res.end()
    return;
  }
  if(name.length > 128){
    res.writeHead(400, {message:"Invalid argument, Name too long!"})
    res.end()
    return;
  }
  if(content.length  >= 1024){
    res.writeHead(400, {message:"Invalid argument, content too long!"})
    res.end()
    return;
  }
  if(ref!=undefined && parseInt(ref)==NaN) {
    res.writeHead(400, {message:"Invalid argument, ref must be integer!"})
    res.end()
    return;
  }
  if(email!=undefined){
    if(email.length >= 128) {
      res.writeHead(400, {message:"Invalid argument, Email too long!"})
      res.end()
      return;
    }
    var email_reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
		if(!email_reg.test(email)){
      res.writeHead(400, {message:"Invalid argument, Email invalid!"})
      res.end()
      return;
    }
  }
  if(await submitComment(article_title, ref, name, email, content)){
    res.writeHead(200, {message:"Submit comment successfully!"});
    res.end();
  }
  else{
    res.writeHead(400, {message:"Unable to submit comment!"});
    res.end();
  }
})

module.exports = {api_comment_router: router};