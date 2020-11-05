# MiniComment
A Mini Comment web application, using Nodejs, Vue.js,  Mongodb

View  in my blog,  [Yurisizuku](https://blog.yuris.ml/comments/)

## client

in  `/public`,  `ui_comment.html `, `ui_comment.js`, `ui_comment.css`

The comment web UI can 

- fetch the comments by ajax and render the comments in several pages
- go forward, backward, and jump to arbitary page
- show the reference (if has) of each comment, and jump to reference
- submit the comments , with the captcha support

It has some configs as bellow:

<meta article_title="Comments" api_host="http://localhost:3003"/>
<meta comment_view_limit="10" page_limit="10"/>

## server

`server_comment.js`  parse the api for get/submit the comment.

`model_comment.js`  the defination of the comments model and some functions to manipulate the database

`connect_db.js` some configs for database

 