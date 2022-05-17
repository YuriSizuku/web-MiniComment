# MiniComment
![GitHub package.json version](https://img.shields.io/github/package-json/v/Yurisizuku/MiniComment?color=green)
❄️ A Mini Comment web application, using `Nodejs`, `Vue.js`, `Mongodb`.  
You can use the raw format or markdown format.  

![minicomment_v0.8](screenshot/minicomment_v0.8_markdown.png)

❄️ This project support for deploying in any node server, as well as vercel.  
The demo is here [Yurisizuku](https://blog.schnee.moe/comments/).  

![minicomment_v0.7](screenshot/minicomment_v0.7.png)

## 🍀 MiniComment component

### MiniComment Server

- `minicomment_server.js`,  main server of this app, the command line is as below
- `minicomment_api.js`, parse the api for get/submit the comment.
- `minicomment_model.js`  the defination of the comments model and some functions to manipulate the database
- `minicomment_db.js`, some configs for connet database

## MiniComment Client

In  `/public`, use  `minicomment.xhtml`, `minicomment.js`, `minicomment.css` to import minicoment client. The comment web UI can

- fetch the comments by ajax and render the comments in several pages
- go forward, backward, and jump to arbitary page
- show the reference (if has) of each comment, and jump to reference
- submit the comments , with the captcha support

❄️ It has some configs as bellow:

```html
<meta article_title="Comments" api_host="http://localhost:3003"/>
<meta comment_view_limit="10" page_limit="10"/>
```

## 🍀 MiniComment Client Deploy

### deploy in any html page

1. input the `jquery.js`, `vue.js`, `marked.js`, `highlight.js`, `highlightjs-line-numbers.js` libraries by `<script src=""></scrpt>`

2. use jquery load `minicomment.xhtml` into where you want to add comment view, see `/public/minicomment.html` in detail. 

```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta article_title="Comments" api_host="http://localhost:3003"/>
<meta comment_view_limit="10" page_limit="10"/>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12"></script>
<script src="https://cdn.jsdelivr.net/npm/marked@1.2.3/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/highlight.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/styles/vs.min.css"/>
<script src="https://cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@2.8.0/dist/highlightjs-line-numbers.min.js"></script>
<div id="mini_comment"></div>
<script>$("#mini_comment").load("./minicomment.xhtml");</script>
```

### deploy in hexo(butterfly theme)

1. In `hook_style.js`, use  jQuery  `load` to import the html into the comment page, something like:

```javascript
// hook_style.js
function add_mini_comment(){
  $($('meta')[0]).after('<meta api_host="">');
  var article_title = $('meta[property="og:title"]').attr('content');
  if ($('meta[article_title]').length <= 0 ){
    $($('meta')[0]).after('<meta article_title="">');
  }
  switch(article_title.toLowerCase()){
    case "home":
    case "archives":
    case "tags":
    case "catagories":
    case "about": break;
    case "comments":
      $('meta[article_title]').attr('article_title', "Comments");
      $('#page').append('<div id="mini_comment"></div>');
      $('div#mini_comment').load("/hook/minicomment.xhtml");
      break;
    default:
      $('meta[article_title]').attr('article_title',  article_title);
      $('#post').append('<div id="mini_comment"></div>');
      $('div#mini_comment').load("/hook/minicomment.xhtml");
      break;
  }
}
```

2. In `_config.butterfly.yml`,   import the `Vue` and `hook_style.js`

```yml
# _config.butterfly.yml 
inject:
  head:
  - <link rel="stylesheet" href="/hook/hook_style.css">
  bottom:
  - <script src="https://cdn.jsdelivr.net/npm/vue@2.6.12"></script>
  - <script src="https://cdn.jsdelivr.net/npm/marked@1.2.3/marked.min.js"></script>
  - <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/highlight.js"></script>
  - <script src="https://cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@2.8.0/dist/highlightjs-line-numbers.min.js"></script>
```  

3. put the `minicomment.xhtml`, `minicomment.js`, `minicomment.css` into `<hexo>/source/hook/` directly (hexo generate html in wrong format, so rename it to xhtml). Maybe need to edit `<meta api_host="YourHostName or empty"/>` and delete `<meta article_title="xxx">`, because it is set by the `hook_style.js`. Also change the path of js and css.
**Finally, do not forget to purge the cdn caches to see the changes**

```html
<meta api_host="YourHostName or empty"/>
<link rel="stylesheet" type="text/css" href="/hook/minicomment.css" />
<script src="/hook/minicomment.js"></script>
```

## 🍀 MiniComment Server Deploy

### deploy on any node server  

1. in this project dir, use `npm install`
2. create a file `./secret/SECRET_DB.TXT` and put a  string like `mongodb://username:password@host:port/database?authSource=admin` for connecting to your mongodb database.
3. `npm run start` or `pm2 start server.js` to run it, have fun ~

Also you can simple run the commad as below, to deploy in any node server.

``` shell
node minicomment_server.js [options]
--port=3003, or $port # you can use either secret_file or secret_url
--secret_url, or $secret_url # mongodb://username:password@host:port/database?authSource=admin
--secret_file=./secret/SECRET_DB.TXT
```

### deploy on vercel  

1. create a project in vercel and fork [this](https://github.com/YuriSizuku/MiniComment) repository.
2. in vercel config `settings/environment-variables` page, set enviroment, `secret_url=mongodb://username:password@host:port/database?authSource=admin` as yours.
3. deploy and have fun ~  

## 🍀 history  

- v0.9, refract the code structure, support for vecel, serverless
- v0.8, add support for markdown  
- v0.7, initial version, with comment view and submit function  
