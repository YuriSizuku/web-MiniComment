/*
  A Mini Comment web application ui part rendered by Vue,
  made by devseed (https://github.com/YuriSizuku/MiniComment)
*/

// the API_HOST and article_title is in html meta
const API_HOST= $("meta[API_HOST]").attr('API_HOST');
var article_title = $("meta[article_title]").attr('article_title');

async function get_comment_count() {
  return new Promise(resolve =>{
    $.ajax(API_HOST + "/api/comment/count", {dataType:'json'})
    .done(function (data){return resolve(data.count);})})
}

async function get_comments(article_title, skip, limit){
  return new Promise(resolve =>{
    $.ajax(API_HOST + "/api/comment/get", {
      dataType:'json', 
      method: 'GET', 
      data: {
        article_title: article_title,
        skip: skip, 
        limit: limit
      }})
    .done(function (data){return resolve(data);})})
}

async function submit_comment(article_title, ref, name, email, content, captcha_code, captcha_hash){
  return new Promise(resolve =>{
  $.ajax(API_HOST + "/api/comment/submit", {
    method: 'POST', 
    data: {
      article_title: article_title,
      ref: ref,
      name: name,
      email: email, 
      content: content,
      captcha_code: captcha_code,
      captcha_hash: captcha_hash
    }
  })
  .done(function (data){
    //console.log(data);
    return resolve(true);
    })
  .fail(function (xhr, status) {
    //console.log(xhr.getResponseHeader('message'));
    alert("submit error! " + xhr.status +", " + xhr.getResponseHeader('message'));
    return resolve(false);
  }) 
})}

var app_comment_block = new Vue({
  el: '#comment_view', 
  data: {
    comment_view_limit: parseInt($("meta[comment_view_limit]").attr('comment_view_limit')),
    comments_count : 0,
    comments: [],
    comments_view: null,
    page_limit: parseInt($("meta[page_limit]").attr('page_limit')),
    page_count : 0,
    page_view : [], // ['«', 1, 2, 3, '»'],
    cur_page : 1,
    refmap: {}
  },
  mounted: async function(){
      this.init_comment();
  },
  methods: {
    init_comment: async function(){
      this.page_view = [];
      this.comments = [];
      this.comments_count = await get_comment_count();
      this.page_count = Math.ceil(this.comments_count / this.comment_view_limit);
      this.page_view.push('«');
      for(i=1;i<=this.page_count;i++) {
        if(i>this.page_limit) break;
        this.page_view.push(i);
      }
      this.page_view.push('»');
      this.comments = new Array(this.comments_count);
      this.update_comment(0, this.comment_view_limit)
    }, 
    fetch_comments: async function(skip, limit){ // check and fetch the comment
      for(i=skip;i<skip+limit;i++){
        if (this.comments[i]==undefined){  
          if (skip+limit > this.comments_count) limit=this.comments_count-skip;
          var _comments = await get_comments(article_title, i, i-skip + limit);
          for(j=i;j<skip+limit;j++) {
            this.comments[j] = _comments[j-i];
            this.refmap[this.comments[j]._id] =  this.comments[j].idx;
          }
          break;
        }
      }
      return this.comments.slice(skip, skip+limit);
    },
    update_comment: async function(skip, limit){ // update the comment view
      if (skip+limit > this.comments_count) limit=this.comments_count-skip;
      this.comments_view = await this.fetch_comments(skip, limit);
      //console.log(skip, limit, this.comments_view);
      for(i=0;i<this.comments_view.length;i++){ // when some comment ref not in this page
        let ref = this.comments_view[i].ref
        if(ref==null) continue;
        if(this.refmap[ref] == undefined){
          let res = await $.get(API_HOST + "/api/comment/refidx", {ref:ref});
          if(res.refidx != undefined)
            this.refmap[ref] = res.refidx;
        }
      }
      this.$forceUpdate();
    }, 
    show_page_button: function(i){
      if(this.page_view[i] != '«' && this.page_view[i] != '»') return true;
      else if(this.page_view[i] == '«') {
        if(this.page_count <= this.page_limit) return false;
        if(this.page_view[1] == 1) return false;
        return true;
      }
      else if(this.page_view[i] == '»'){
        if(this.page_count <= this.page_limit) return false;
        if(this.page_view[i-1] == this.page_count) return false
        return true;
      }
    },
    select_page: function(i) {
      //console.log(i, this.page_view[i]);
      if(this.page_view[i] == '«') {
        var d =  this.page_view[1] > this.page_limit ? this.page_limit :this.page_view[1] - 1;
        this.cur_page  =  this.page_view[1]-1 
        for(j=1;j<this.page_view.length-1;j++) this.page_view[j] -= d;
        if (this.cur_page < 1) this.cur_page=1;
      }
      else if (this.page_view[i] == '»') {
        var d = this.page_view[i-1] + this.page_limit <= this.page_count ? this.page_limit : this.page_count - this.page_view[i-1]
        this.cur_page = this.page_view[this.page_view.length-2] + 1
        for(j=1;j<this.page_view.length-1;j++) this.page_view[j] += d;
        if(this.cur_page > this.page_count) this.cur_page = this.page_count; 
      }
      else{
        if (this.cur_page == this.page_view[i]) return;
        this.cur_page= this.page_view[i];
      }
      this.goto_page(this.cur_page);
    },
    goto_page: async function (page_idx){
      //console.log(page_idx);
      page_idx = parseInt(page_idx);
      page_idx < 1 ? 1 : page_idx;
      page_idx > this.page_count ? this.page_count : page_idx;
      //if (page_idx == this.selected_page) return;
      if(page_idx < this.page_view[1] || page_idx > this.page_view[this.page_view.length-2]){
        for(i=1;i<this.page_view.length-1;i++) 
          this.page_view[i] = i + page_idx - this.page_limit ;
      } 
      this.cur_page = page_idx;
      this.update_comment((this.cur_page -1) * this.comment_view_limit, this.comment_view_limit)
    },
    goto_ref: async function(refidx){
      $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
      refidxstr = "#idx" + refidx;
      refidx = parseInt(refidx);
      if($(refidxstr).length){ // ref in this page
        $body.animate({ scrollTop: $(refidxstr).offset().top }, 300);
        return;
      }
       
      let refpage = Math.floor((this.comments[0].idx - refidx) / this.comment_view_limit);
      while(true) {
        let comment_view = await this.fetch_comments(this.comment_view_limit*refpage, this.comment_view_limit);
        if(refidx > comment_view[0].idx){
          refpage ++;
          continue;
        }
        if(refidx < comment_view[comment_view.length-1].idx){
          refpage --;
          continue;
        }
        for(i=0;i<comment_view.length;i++){
          if(refidx == comment_view[i].idx){
            await this.goto_page(refpage+1);
            await this.$forceUpdate(); // await for update
            $body.animate({ scrollTop: $(refidxstr).offset().top }, 300);
            return;
          }
        }
        alert(refidxstr + "not exisit!")
        break;
      };
    },
    set_ref: function (ref, refidx){
      app_comment_submit.ref=ref;
      app_comment_submit.refstr = "#" + refidx;
      window.scrollTo(0, document.body.scrollHeight); //jump to the bottom
    }
  }
})

var app_comment_submit = new Vue({
  el:'#submit_view', 
  data: {
    name: "",
    email: "",
    content: "",
    ref: "",
    refstr: "",
    captcha_data: "",
    captcha_code: "",
    captcha_hash: ""
  },
  mounted: function(){
    this.get_captcha();
  },
  methods : {
    submit_comment: async function (e){
        //console.log(this.name, this.email, this.content)
        e.preventDefault(); // do not refresh when submit
        if(this.name == "" || this.content == ""){
          alert("Name and Comment can not be empty!");
          return;
        }
        if(this.content.length >= 1024){
          alert("Comment too long!");
          return;
        }
        if(await submit_comment(article_title, this.ref!="" ? this.ref: undefined, this.name, this.email!="" ? this.email:undefined, this.content, this.captcha_code, this.captcha_hash)){
          app_comment_block.init_comment();
          this.content = "";
          this.reset_ref();
        }
        else{
          this.captcha_code = "";
        }
        this.get_captcha();
    },   
    reset_ref: function (){
        this.ref = "";
        this.refstr = "";
    },
    get_captcha: function() {
      $.get(API_HOST + "/api/captcha")
      .done((data) => {
        //console.log(data);
        this.captcha_data = data.data;
        this.captcha_hash = data.hash;
      })
    }
  }
})