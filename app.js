const express=require('express');
const exphbs=require('express-handlebars');
const path=require('path');
const bodyParser=require('body-parser');
const methodOverride=require('method-override');
const redis=require('redis');

//create redis client
let client=redis.createClient();
client.on('connect',function(){
  console.log('Connectd to Redis.....');

  //전체 목록 조회 시작
  let id="10";

  client.hget('cart.user', function (err, reply) {

      console.log("card all List :"+ reply);
        if(!reply){
          console.log("card all dddddddddddddddddd :"+ reply);
        }else{
          console.log("card all Listfffffffffffffffffffff :"+ reply);

        }
  });
  //전체 목록 조회 끝
});

//set port
const port=3000;


//init app
const app=express();

//view engine
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

//body parser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:false}));

//methodOverride
app.use(methodOverride('_method'));

var user = [];
var cart = [];

app.get('/',function(req,res,next){
res.render('searchusers');

});

app.get('/shopping/search',function(req,res,next){
res.render('shopping/searchCart');

});

app.get('/shopping2/search',function(req,res,next){
//  res.render('shopping2/searchCart');
  //전체 목록 조회 시작
  let id="10";



    client.keys('cart.user*', function (err, keys) {
  //client.hget('cart.user:'+id, function (err, reply) {


        if(!keys){
          res.render('shopping2/searchCart',{
            error:'Cart key not exist'
          });
        }else{
          console.log("card all keys JSON.stringify:"+  JSON.stringify(keys));
          console.log("card all keys :"+  keys);
          res.render('shopping2/searchCart',{
          //  cartkey: keys
              cartkey:  JSON.stringify(keys),
              cartkey1:  keys
          });
        }
  });
  //전체 목록 조회 끝
});


app.post('/shopping/search',function(req,res,next){
  let id=req.body.id;

console.log("======ssssssss=id:"+id);
  client.get('cart:'+id, function (err, reply) {


        if(!reply){
          res.render('shopping/searchCart',{
            error:'Cart does not exist'
          });
        }else{

          res.render('shopping/detail',{
            cart: JSON.parse(reply)
          });
        }
  });
});

app.post('/shopping2/search',function(req,res,next){
  let id=req.body.id;

//@redis.hgetall('cart.user:1').each  do |
console.log("search idssss:"+id);
//  client.hkeys('cart.user', function (err, reply) {
//  client.get('cart.user', function (err, reply) {

//LRANGE mycolor1 0 -1
//client.lrange('frameworks', 0, -1, function(err, reply) ...

  client.lrange('cart.user:'+id,  0, -1,function (err, reply) {
  //client.get('cart.user:'+id, function (err, reply) {


        if(!reply){
          res.render('shopping2/searchCart',{
            error:'Cart does not exist'
          });
        }else{
          console.log("card reply2:"+ reply);
        //  console.log("card reply2 parse:"+ JSON.parse(reply));
            console.log("card reply2 parse22:"+ JSON.parse( JSON.stringify(reply)));
          console.log("card reply2 stringify:"+ JSON.stringify(reply));
            console.log("card reply2 cart:reply}:"+ {"cart":reply});

        //  data = {"products":data};
          res.render('shopping2/detail',{
            //cart: JSON.parse(reply),
            cart:  reply,
            cart1:  JSON.stringify(reply),
        //  cart2:  JSON.parse(reply),
            cartID:id
          });
        }
  });
});

app.post('/user/search',function(req,res,next){
  let id=req.body.id;



  client.hgetall(id,function(err,obj){
    if(!obj){
      res.render('searchusers',{
        error:'User does not exist'
      });
    }else{
      obj.id=id;
      res.render('detail',{
        user:obj
      });
    }

  })
});


app.get('/user/add',function(req,res,next){
res.render('adduser');

});

app.get('/contact',function(req,res,next){
res.render('contact');

});

///shopping/add
app.get('/shopping/add',function(req,res,next){
res.render('shopping/addcart');
//  res.render(path.join(__dirname, 'view.jade'));
});

///shopping/add
app.get('/shopping2/add',function(req,res,next){
res.render('shopping2/addcart');
//  res.render(path.join(__dirname, 'view.jade'));
});

app.post('/user/add',function(req,res,next){
let id=req.body.id;
let first_name=req.body.first_name;
let last_name=req.body.last_name;
let email=req.body.email;
let phone=req.body.phone;

client.hmset(id,[
  'first_name',first_name,
  'last_name', last_name,
  'email',email,
  'phone',phone
    ],function(err,reply){
    if(err){
      console.log(err);
    }
      console.log('reply');
      res.redirect('/');


  })


});

app.post('/shopping/add',function(req,res,next){
    let id=req.body.id;
    let productID=req.body.productID;
    let qty=req.body.Qty;



    cart.push({
        'id': id,
        'productID': productID,
        'qty': qty
    });
    client.set('cart', JSON.stringify(cart),function(err,reply){
    if(err){
      console.log(err);
    }
      console.log('reply cart');
      res.redirect('/shopping/search');


    })

});

app.post('/shopping2/add',function(req,res,next){
    let id=req.body.id;
    let productID=req.body.productID;
    let qty=req.body.Qty;

    var cartArray= new Array();


//  @redis.hset "cart.user:#{userid}", productId, qty
//  cartArray.push({
    // cartArray.push({
    //     'id': id,
    //     'productID': productID,
    //     'qty': qty
    // });

    cartArray.push({
        'id': id,
        'productID': productID,
        'qty': qty
    });
    //client.set('cart.user:'+id, JSON.stringify(cart),function(err,reply){

    // [
    //   'id': id,
    //   'productID': productID,
    //   'qty': qty
    //     ]
    let cc="";
    var value = { "id": "111", "productID": "222", "qty": "333" };
  //  client.lpush('cart.user:'+id, cartArray.toString,function(err,reply){
    client.lpush('cart.user:'+id, JSON.stringify(cartArray),function(err,reply){

    if(err){
      console.log(err);
    }
      console.log('reply cart2');
      res.redirect('/shopping2/search');


    })

});


app.delete('/user/delete/:id',function(req,res,next){
  client.del(req.params.id);
  res.redirect('/');
});


app.delete('/shopping/delete/:id',function(req,res,next){
  client.del(req.params.id);
  res.redirect('/shopping/search');
});

app.delete('/shopping2/delete/:id',function(req,res,next){
  let id=req.params.id;
    console.log('/shopping2/delete/:id->'+id);
  client.del('cart.user:'+id);
  res.redirect('/shopping2/search');
});

app.listen(port,function(){
  console.log('server started on port '+port);
});
