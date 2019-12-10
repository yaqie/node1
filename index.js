const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//use path module
const path = require('path');
//use hbs view engine
const hbs = require('hbs');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const DBUrl = "mongodb://127.0.0.1:27017/";
const DBName = 'testing';

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
//set folder public sebagai static folder untuk static file
app.use('/assets',express.static(__dirname + '/public'));

let dbo = null;
MongoClient.connect(DBUrl,(err,db)=>{
  if(err) throw err;
  dbo = db.db(DBName);
})

app.use(bodyParser.urlencoded({ express:false }))

//route untuk homepage
app.get('/',(req, response) => {
    dbo.collection("siswa").find().toArray((err,res)=>{
      if(err) throw err;
      response.render('index',{
        dataSiswa:res
      });
    })
    // response.render('index');
});

app.get('/api/siswa',(request,response)=>{
  dbo.collection("siswa").find().toArray((err,res)=>{
    if(err) throw err;
    response.json(res);
  })
});

app.get('/api/siswa/:id',(request,response)=>{
  let id = request.params.id;

  let id_object = new ObjectID(id);

  dbo.collection("siswa").findOne({_id:id_object},(error,result)=>{
    if (error) throw error;
    response.json(result);
  })
});

app.post("/api/siswa",(request,response)=>{
  let namaSiswa = request.body.nama;
  let alamatSiswa = request.body.alamat;

  dbo.collection("siswa").insertOne(
    {
      nama:namaSiswa,
      alamat:alamatSiswa
    },(error,result)=>{
    
      if (!error){
        response.json(result);
      } else {
        throw error;
      }
  })
})

app.put("/api/siswa/:id",(request,response)=>{
  let id = request.params.id;
  let id_object = new ObjectID(id);

  let namaSiswa = request.body.nama;
  let alamatSiswa = request.body.alamat;

  dbo.collection("siswa").updateOne(
    {
      _id:id_object
    },{$set:{
      nama:namaSiswa,
      alamat:alamatSiswa,
    }},(error,result)=>{
    
      if (!error){
        response.json(result);
      } else {
        throw error;
      }
  })
})

app.delete("/api/siswa/:id",(request,response)=>{
  let id = request.params.id;

  let id_object = new ObjectID(id);


  dbo.collection("siswa").deleteOne({_id:id_object,},(error,result)=>{
      if (!error){
        response.json(result);
      } else {
        throw error;
      }
  })
})

app.listen('8080',(e)=>{
  console.log(e);
});