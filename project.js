var express=require('express')
var app = express()
app.use(express.static('public'))
var nodemailer = require('nodemailer');
app.set('view engine', 'ejs'); 
//var sourceFile = require('./sourceFile');
var bodyParser = require('body-parser');
var mongojs = require('mongojs')
var db = mongojs('mongodb://suma:suma01@ds245170.mlab.com:45170/suma', ['admin','requests'])
var ObjectId=require('mongojs').ObjectId;
app.set('port',process.env.PORT||5000)
var session = require('express-session')
app.use(session({secret: 'jjjjjjjjjjjjjj64656545'}))
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/mail',function(req,res){
var from = req.body.From;
var to = req.body.To;
var place = req.body.Place;
var reason = req.body.Reason;
	var doc={
	fromdate:from,
	todate:to,
	place:place,
	reason:reason,
	bool:false,
	name:req.session.name,
	regdno:req.session.regdno,
}
db.requests.insert(doc, function (err, newDoc) {
console.log(newDoc)


	   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
 // req.session.id=doc[_id].$oid;
//console.log(doc[_id].$oid)

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'svecw111@gmail.com',
    pass: 'bvrmsvecw1'
  }
});
console.log(newDoc._id)

var mailOptions = {
  from: 'svecw111@gmail.com',
  to: 'sumakrishna1999@gmail.com',
  subject: 'outing permission',
  html:'Hi,Sir'+'<br>'+'This is '+req.session.name+'of '+req.session.year+' '+
req.session.branch+' '+'requesting you to grant the permission for outing'+'from: '+from+'to:'+to+'<br>'+'Reason: '+reason+'<br>'
+'<a href="http://localhost:9999/accept/'+newDoc._id+'/true" role="button">Accept</a><br><a href="http://localhost:9999/reject/'+newDoc._id+'"role="button">Reject</a><br><a href="http://localhost:9999/profiles1/'+req.session.regdno+'">Profile</a> '
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
  })
});
})

app.get('/svecwgoeasy',function (req,res) {
console.log(req.session.user)
	if(req.session.user=="true"){
		res.redirect('/home')
	}
	else{
		res.sendFile(__dirname+'/public/project.html')
	}
	// body...
})
app.get('/home',function(req,res){
if(req.session.user=="true"){
  var regdno=req.session.regdno;
	db.admin.find({regdno:regdno},function(err,docs){
				
				res.render('project1',{result:docs,regdno:regdno})
			})
}
else{
res.redirect('/project')
}
})
app.get('/accept/:_id/:bool',function(req,res){
	var id=req.params._id;
	var bool=req.params.bool;
	console.log(id,bool)
	db.requests.update({"_id":ObjectId(id)}, {$set:{"bool":true}},function(err,docs){
		if(err){
			console.log('error updating Object: '+err)
			res.send({'error':'An error has occured'})
		}
		else{
			console.log(''+docs+'docs(id) updated')
			res.send('request accepted')
		}
	

	var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   user: 'svecw111@gmail.com',
    pass: 'bvrmsvecw1'
  }
});
  var mailOptions = {
  from: 'svecw111@gmail.com',
  to: 'chaturya273@gmail.com',
  cc:'alekhya8749@gmail.com',
  subject: 'outing permission',
  html:req.session.name+' '+'s outing permission is accepted',  
}

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});     
})
})
app.get('/reject/:_id',function(req,res){
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'svecw111@gmail.com',
    pass: 'bvrmsvecw1'

  }
});
  var mailOptions = {
  from: 'svecw111@gmail.com',
  to: 'chaturya273@gmail.com',
  cc:'alekhya8749@gmail.com',
  subject: 'outing permission',
  html:req.session.name+' '+'s outing permission is rejected', 
}

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});     
res.send("Request rejected");
})
app.post('/myprofile',function(req,res){
	var regdno = req.body.regdno;
    var password1=req.body.password;
var doc={"regdno":regdno,"password":password1}
	db.admin.find(doc,function (err,docs) {
		if(docs.length>0){
			req.session.user="true";
			req.session.name=docs[0].name;
			req.session.year=docs[0].year;
			req.session.branch=docs[0].branch;
			req.session.regdno=docs[0].regdno;
			console.log(req.session.regdno)
			if(req.session.user=="true"){
			res.redirect('/home')	 	
			 
			}
		}
		else{
			res.send("Invalid User......")
		}

	})
})
/*app.post('/profiles1/:regdno',function (req,res) {
console.log(req.session.user)
var regdno = req.body.regdno;
    var password1=req.body.password;
var doc={"regdno":regdno,"password":password1}
	db.admin.find(doc,function (err,docs) {
		if(docs.length>0){
			req.session.user="true";
			req.session.regdno=docs[0].regdno;
			console.log(req.session.regdno)
			if(req.session.user=="true"){
			res.redirect('/home')	 	
			 
			}
		}
		else{
			res.send("Invalid User......")
		}

	})
})*/
app.get('/profiles1/:regdno',function (req,res) {
console.log(req.session.user)

	var regdno = req.params.regdno;
	db.admin.find({regdno:regdno},function(err,docs){
if(docs.length>0){
		res.render('profiles1',{result:docs})
	}
	else{
		res.send('Not Found')
	}
	})
	// body...
})

app.get('/dashboard',function(req,res){
	db.requests.find({},function(err,docs){
				
				res.render('dashboard',{result:docs})
			})

})
app.get('/logout',function(req,res){

    req.session.destroy(function(err) {
  // cannot access session here
  res.sendFile(__dirname+'/public/project.html')	
})
})


app.listen(app.get('port'),function() {
	console.log("server is running")
})