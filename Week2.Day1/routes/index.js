var express = require('express');
var router = express.Router();

//db part
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';



var crypto = require('crypto'),
algorithm = 'aes256',
password = 'asaadsaad';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


function encryptOrginal(text){
	  var cipher = crypto.createCipher(algorithm,password);
	  var crypted = cipher.update(text,'hex','utf8');
	  crypted += cipher.final('utf8');
	  return crypted;
	}

function decryptOrginal(text){
	  var decipher = crypto.createDecipher(algorithm,password);
	  var dec = decipher.update(text,'utf8','hex');
	  dec += decipher.final('hex');
	  return dec;
	}

function encrypt(text){
	  var cipher = crypto.createCipher(algorithm,password);
	  var crypted = cipher.update(text,'utf8','hex');
	  crypted += cipher.final('hex');
	  return crypted;
	}
function decrypt(text){
	  var decipher = crypto.createDecipher(algorithm,password);
	  var dec = decipher.update(text,'hex','utf8');
	  dec += decipher.final('utf8');
	  return dec;
	}


router.get('/decryptData', function(req, res, next) {
	  
		  mongoClient.connect(url, function(err,db){

			  db.collection('lab1').findOne({"_id": 2}, function(err, data){				
									 db.close();			
									 res.render('decryptData', {items: decrypt(data.message)});
			 
					   });
				   });
			
				});



router.get('/getData', function(req, res, next) {
	  
	mongoClient.connect(url, function(err,db){
		
		var resultArray =[];
		
		assert.equal(null,err);	
		var cursor = db.collection('userdata').find();
		
		cursor.forEach(function(doc, err){
			assert.equal(null,err);	
			resultArray.push(doc);
		 }, function(){
			 db.close();
			 res.render('getData', {items: resultArray});
		 });
	   });
	//i cant do here bs z excution is asynsronous
	//so will be executed before the callback of foreac
	//means before finishing iteration
    //db.close();
   //res.render('');
	});

router.post('/insertData', function(req, res, next) {
	
	var item = {
			fullName: req.body.fullname,
			type: req.body.type,
			message: req.body.message
	             };
	
	mongoClient.connect(url, function(err, db){
		
		assert.equal(null,err);		
		db.collection('userdata').insert(item, function(err, result){
			
			assert.equal(null,err);	
			console.log('Item inserted>>>>>');
			db.close();
		});
	});

	//redirect after post RGP
	res.redirect('/');
	
	});

module.exports = router;
