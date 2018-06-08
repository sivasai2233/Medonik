var nodemailer = require('nodemailer');
 const notifier = require('mail-notifier');
 var multer = require('multer');
 var fs = require('fs');
// var contents = fs.readFileSync("./details.json");
 // Define to JSON type
// var jsonContent = JSON.parse(contents);   

 let transporter = nodemailer.createTransport({
     service: 'gmail',
     secure: false,
     port: 25,
     auth:{
         user: 'sivasaikiranreddy@gmail.com',
         pass: 'sarwqxqrxkombgkv'
     },
     tls:{
         rejectUnauthorized:false
     }
 });

 let HelperOptions = {
     from: 'sivasaikiranreddy@gmail.com',
     to:'deepak@shootup.in',
     subject: 'hiii Deepak',
     text : 'this is siva',
     // html: {
     //     path : 'mail.html'
     //   },
     //html:jsonContent.html,
      //attachments: [
       //  { //using a local file
         //  path: jsonContent.path
         //}]
 };

 transporter.sendMail(HelperOptions, (error, info) =>{
     if(error){
         return setTimeout(function(error){
	        console.log("message is not sent");
		 },1000);
        // console.log("message is not sent");
         // return console.log(error);  
	 }
     else{
         console.log(info);
         console.log('Your message has been sent');
       //  Readmail(info);
        
     }
   
 }); 



