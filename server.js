// ### Test message for bitbucket

//=========================================================
// KAI Bot server.js is the node.js server that contains all the
// features, logic, and functionalities that power the bot
// This file also containts all API endpoints to power a simple
// webapp that supports the bot
//=========================================================

//=========================================================
// Current Features:
//=========================================================

    // Insurance Coded: Stanford Cardinal Care

    // - Stanford Cardinal Care:
    //     - natural language processing of user input
    //     - collect minimum user profile information
    //     - copay/coinsurance cost information of various services and treatments
    //     - deductibles cost information
    //         - deductibles cost tracking
    //     - out of pocket max information
    //         - out of pocket max cost tracking
    //     - list of preventative care
    //         - emailed to user
    //     - answer coverage question using existing coverageCopay function
    //     - ending conversation scheme
    //         - delete user info if requested


//=========================================================
// Future Features:
//=========================================================

	// - Write Appeal Letter
	// - Scan Itemized Bill or EOB for doctor billing errors
  // - Plan Comparator based on user stories, situations, and contexts


"use strict";

//var restify = require('restify');
var builder = require('botbuilder');
var emailer = require('nodemailer');

// Global var holding the module that contains insurance policy information of current session/user
var insurance_module;
var tips_module = require("./insurances/general_tips.js");
var insurance_101_module = require("./insurances/insurance_101.js");
// Email agent for auto-emailing user information
var transporter = emailer.createTransport('smtps://ceohockey60%40gmail.com:crushit1986!@smtp.gmail.com');


//=========================================================
// Server APIs Setup
//=========================================================

// Express Server
var mongoose = require('mongoose');
var async = require('async');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var assert = require('assert');
var multer = require('multer');
var fs = require('fs');

//TODO: Need to Salt and Hash password!!!

var app = express();
var router = express.Router();

// Load Mongoose Data Schema
var TestSchema = require('./schema/testSchema.js');
var User = require('./schema/userSchema.js');

// Mongodb local host connection
//mongoose.connect('mongodb://localhost/kaiBotApp');

//TODO: MongoDB integration with Azure not working yet...Server APIs are working but slow...
// Mongodb Azure Cloud connection
//var mongoClient = require("mongodb").MongoClient;
//mongoClient.connect("mongodb://kaibotdb:gh2pnPOul3nzFNuOSMbxKncA4HYMlx3ldTLjx46GPYZOcrt9XuvmDmSxpwtsxDDBUsrPAuiKhXlDHIVVRXhUZQ==@kaibotdb.documents.azure.com:10250/?ssl=true", function (err, db) {
// db.close();
//});

app.use(express.static(__dirname));

// !!!NOTE: Each session state is current stored in Node memory, NOT OK for production.
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/*
 * URL /- Homepage, render index.html
 */
app.get('/', function (req, res) {
  //res.sendFile('index.html');
  res.send("exposing local public folder...");
});

/*
 * URL /test/info - To test MongoDB connectivity on local server
 */
//app.get('/test/info', function (req, res) {
//  var createTestSchema = function(){
//    return TestSchema.create({
//      version: '1.0'
//    }, function(err, test){
//      if (err){
//        console.log(err);
//        console.log("test creation didn't work...");
//      } else {
//        test.id = test._id;
//        console.log("test successfully created with id: " + test.id);
//      }
//    });
//  };
//  createTestSchema();
//
//  TestSchema.find({}, function (err, info) {
//    if (err) {
//      // Query returned an error.  We pass it back to the browser with an Internal Service
//      // Error (500) error code.
//      console.error('Doing /user/info error:', err);
//      res.status(500).send(JSON.stringify(err));
//      return;
//    }
//    if (info.length === 0) {
//      // Query didn't return an error but didn't find the SchemaInfo object - This
//      // is also an internal error return.
//      res.status(500).send('Missing TestSchema Info');
//      return;
//    }
//    // We got the object - return it in JSON format.
//    console.log('TestSchema', info[0]);
//    res.end(JSON.stringify(info[0]));
//  });
//});

/*
 * URL /user/:userId - Get a user's info by userId
 * It also ties user info to current chatbot session to provide immediate context to conversation
 */
//app.get('/user/:userId', function(req, res){
//  var user_id = req.params.userId;
//  if (req.session.loggedIn){
//    console.log("Access to user with id: " + user_id + " has been requested...");
//    User.findOne({_id: user_id}, function(err, user){
//      if (err){
//        res.status(400).send("This user id is not matched to a valid user...");
//        return;
//      }
//      var found_user = JSON.parse(JSON.stringify(user));
//      delete found_user.__v;
//      console.log(JSON.stringify(found_user));
//      // TODO: set up user info into chatbot session
//      res.end(JSON.stringify(found_user));
//    })
//  } else {
//    console.log("Unauthorized request to access user with id: " + user_id);
//    res.status(401).send("Unauthorized request to access user info with id: " + user_id);
//  }
//});

/*
 * URL /user-registration - Validate and Create new User object
 */
//app.post('/user-registration', function(req, res){
//  var first_name = req.body.first_name;
//  var last_name = req.body.last_name;
//  var email = req.body.email;
//  //TODO: Need to Salt and Hash password!!!
//  var password = req.body.password;
//  var state_of_res = req.body.state_of_res;
//  var insurance_plan_name = req.body.insurance_plan_name;
//
//  console.log("Testing state field: " + state_of_res);
//
//  User.findOne({email: email}, function (err, user){
//    if (err){
//      console.log("There'an error....");
//      res.status(400).send("There's an error while registering user. Error msg: " + err);
//      return;
//    }
//    if (user){
//      res.status(400).send("A user with this email already exists...");
//      console.log("Email already exist...");
//    } else {
//      console.log("Creating new user now...");
//      User.create({
//        id: '0',
//        first_name: first_name,
//        last_name: last_name,
//        email: email,
//        password: password,
//        state_of_res: state_of_res,
//        insurance_plan_name: insurance_plan_name,
//        insurance_group_number: '',
//        insurance_plan_object: undefined, // Insurance Object that's matched to the insurance plan User has
//        num_issues_resolved: 0,
//        common_questions: []
//      }, function (err, newUser){
//        if (err){
//          res.status(400).send("Error occurred while creating new user. Error msg: " + err);
//          console.log("Error occurred while creating new user...");
//        } else {
//          newUser.id = newUser._id;
//          console.log("Created new user with id: " + newUser.id);
//          res.status(200).send("Created new user with id: " + newUser.id);
//        }
//      })
//    }
//  });
//});

/*
 * URL /admin/login - Validate and Log In a User
 */
//app.post('/admin/login', function (req, res){
//  var email = req.body.email;
//  var password = req.body.password;
//  console.log("Trying to log in user with email: " + email + "...");
//  User.findOne({email: email, password: password}, function (err, user){
//    if (err){
//      res.status(400).send("There's an error while logging in...");
//      return;
//    }
//    if (!user){
//      res.status(400).send("No user with this email was found...");
//      return;
//    }
//    console.log("Current Session id: " + req.session.id);
//    req.session.user_id = user.id;
//    req.session.email = user.email;
//    req.session.first_name = user.first_name;
//    req.session.last_name = user.last_name;
//    req.session.loggedIn = true;
//
//    res.send(JSON.stringify(user));
//  });
//});

/*
 * URL /admin/logout - Log out a User and delete associated session
 */
//app.post('/admin/logout', function(req, res){
//  delete req.session.user_id;
//  delete req.session.email;
//  delete req.session.first_name;
//  delete req.session.last_name;
//  delete req.session.loggedIn;
//
//  req.session.destroy(function (err){
//    if (err) {
//      console.log(err + ": this user currently not logged in...");
//      res.status(400).send("User currently not logged in...");
//    } else {
//      res.status(200).send("Logging out successful...");
//    }
//  });
//});

/*
 * URL /dev-login - Log in a visitor to access chatbot for testing, using a pre-determined passcode
 */
app.post('/dev-login', function (req, res){
  var passcode = req.body.dev_cred;
  if (passcode === 'ilovekai'){
    console.log("access success!!");
    res.status(200).send("Access Granted");
  } else {
    console.log("access failed...");
    res.status(401).send("Access Denied");
  }
});

/*
 * Launch local server
 */
var server = app.listen(process.env.PORT || process.env.port || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('express server listening at http://%s:%s', host, port);
});



//=========================================================
// Bot Setup
//=========================================================

// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'f151af23-c361-42ea-a95a-866c7379ed1f',
    appPassword: '9LfaHPMdmc3LNo2Ox71qMBd'
});

var bot = new builder.UniversalBot(connector);
app.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

//MACRO TODO: comb every message to make sure it is <160 chars (limit for one SMS msg)

// -----------------------------------------------
// Root Dialog Thread
// -----------------------------------------------

// TODO: need userData.profile info integration with /user/:userId endpoint.
bot.dialog('/', [
    function (session) {
    	session.sendTyping();
    	if (session.userData.profile){ // Returning User
    		session.send("Hi %s, thanks for reaching out again.", session.userData.profile.name);
			session.sendTyping();
			// TOFIX: Re-binding insurance plan; would need a way to search through plan database based on
            // userData.profile.insurancePlanName
			insurance_module = require('./insurances/cardinal_care.js');
			session.sendTyping();
    		session.beginDialog('/home', { reprompt: true, name: session.userData.profile.name });
    	} else { // New user
			function msg1(){
				session.send("Hey, this is KAI!");
				session.sendTyping();
				session.send("I can help you with your health insurance questions and keep track of important expenses.");
    			session.sendTyping();
			}
			function msg2(){
	    		session.beginDialog('/buildProfile', session.userData.profile);
			}
			msg1();
			setTimeout(msg2, 2000);
    	}
    },
    function (session, results) {
    	if (results.response){
    		session.userData.profile = results.response;
    		// For testing user profile data fields:
    		console.log("Name: %s; State: %s; Insurance Plan: %s", session.userData.profile.name, session.userData.profile.state, session.userData.profile.insurancePlanName);
    		// TODO: binding globar var insurance_module dynamically to userData.profile.insurancePlanName
    		insurance_module = require('./insurances/cardinal_care.js');

	    	session.sendTyping();
	        session.beginDialog('/home', { reprompt: true, name: session.userData.profile.name });
    	}
    	//} else { //If buidling profile failed...relaunch building profile dialog.
	    // 	session.sendTyping();
    	// 	session.beginDialog('/buildProfile', session.userData.profile);
	    // }
    }
]);
// HOME option for Card, routing
// bot.beginDialogAction('', '/');


// -----------------------------------------------
// Build User Profile -- Dialog Thread
// -----------------------------------------------

// TODO: Need to incorporate EndConversation intent, so user can say "Goodbye" at all times
// TODO: Simplify intake of info--may not need zipcode, change to State of Residence?
bot.dialog('/buildProfile', [
    function (session, args, next) {  //TODO: This interaction need fixing!!
    	function msg1(){
	    	session.send("I don't think we've met before. First, let me ask you a few basic questions to get things started.");
    		session.sendTyping();
        	session.dialogData.profile = args || {};
    	}
    	function msg2(){
	        if (!session.dialogData.profile.name) {
    	        builder.Prompts.text(session, ["What's your first name?", "May I have your first name please?"]);
        	} else {
        		session.sendTyping();
            	next();
       		}
    	}
    	setTimeout(msg1, 2000);
    	setTimeout(msg2, 4000);
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.state) {
            //TODO: need input authentication
            session.sendTyping();
            builder.Prompts.text(session, "Which state do you live in?\n (e.g. CA, OH, etc.)");
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.state = results.response;
        }
        if (!session.dialogData.profile.insurancePlanName){
            //TODO: need input authentication
            //TODO: handle case if user doesn't have insurance!
            session.sendTyping();
        	builder.Prompts.text(session, "What's the name of your insurance plan? (e.g. Stanford Cardinal Care)");
        } else {
        	next();
        }
    },
    function (session, results) {
    	if (results.response){
    		session.sendTyping();
    		session.dialogData.profile.insurancePlanName = results.response;
            session.send("Thank you. Building your profile...");
        	session.sendTyping();
    	}
    	session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);

// -----------------------------------------------
// Home Menu Dialog
// -----------------------------------------------
bot.dialog('/home', [
	function(session, args, next){
		if (args.reprompt){
			session.sendTyping();
			var card_msg = new builder.Message(session)
	    		.attachments([
	    			new builder.HeroCard(session)
	    				.title("What would you like to do, %s?", args.name)
	    				.buttons([ //TODO: maybe add a "Feedback" button here...??
	    					//TODO: make second param string more user friendly, for SMS layout.
	    					//ISSUE: if button is clicked many times, they dialog will be triggered as many times....
	    					builder.CardAction.dialogAction(session, "Query", undefined, "About My Plan"),
	    					builder.CardAction.dialogAction(session, "Insurance 101", undefined, "Insurance 101"),
	    					builder.CardAction.dialogAction(session, "Appeal", undefined, "Appeal Process"),
	    					builder.CardAction.dialogAction(session, "Bill Analyzer", undefined, "Analyze My Bill"),
	    					//builder.CardAction.dialogAction(session, "Estimate Cost", undefined, "Estimate Cost"),
	    					builder.CardAction.dialogAction(session, "Tips", undefined, "Tips & Advice"),
	    					builder.CardAction.dialogAction(session, "Exit", undefined, "End Conversation")
	    					])
	    				]);
	    	session.send(card_msg);
		}
	}
]);

// -----------------------------------------------
// Guided Choices about User's Insurance Plan -- Dialog Thread
// -----------------------------------------------
// bot.dialog('/query', intents);
bot.dialog('/query', [
	function(session, args, next){
		// console.log("Query args: " + args.data.name);
		session.sendTyping();
		var query_card = new builder.Message(session)
			.attachments([
				new builder.HeroCard(session)
					.title("Select one of these topics about your plan.")
					.buttons([
						builder.CardAction.dialogAction(session, "Medical Coverage", undefined, "Medical Coverage"),
						builder.CardAction.dialogAction(session, "Mental Health Coverage", undefined, "Mental Health Coverage"),
						builder.CardAction.dialogAction(session, "Prescription Drug", undefined, "Prescription Drug"),
						builder.CardAction.dialogAction(session, "My Plan Basics", undefined, "My Plan Basics"),
						builder.CardAction.dialogAction(session, "Appeal", undefined, "Appeal Process"),
						builder.CardAction.dialogAction(session, "Go Back", undefined, "Go Back")
						])
					]);
		session.send(query_card);
		next();
	}
]);
bot.beginDialogAction('Query', '/query');

// TODO: -----------------------------------------------
// Ask Questions about User's Insurance Plan -- Dialog Thread
// -----------------------------------------------
// [TO-IMPROVE]: Unique NLP recognizer for Medical Coverage related natural language questions
var model_medical_coverage = 'https://api.projectoxford.ai/luis/v1/application?id=687b2a4b-d72f-4db0-aa82-c82ee3efaa22&subscription-key=a97f639bea8044f49d0aa1661f5b417b';
var recognizer_medical_coverage = new builder.LuisRecognizer(model_medical_coverage);
var medical_coverage_intents = new builder.IntentDialog({recognizers: [recognizer_medical_coverage]});

bot.dialog('/medical_coverage', medical_coverage_intents);
bot.beginDialogAction('Medical Coverage', '/medical_coverage');

medical_coverage_intents.onBegin(function (session, args, next){
	if (args.reprompt){
		session.sendTyping();
		session.send("What other question about your plan's medical coverage can I help you with?");
	} else {
		session.send("OK, I can help you out with figuring out medical coverage of your plan.");
		session.sendTyping();
		session.send("What's your question?");
	}
});

medical_coverage_intents.matches('AskQuestion', [
    function (session, args, next){
    	console.log("This is args: " + JSON.stringify(args));
        //var basic_info_entities = builder.EntityRecognizer.findEntity(args.entities, 'BasicInsuranceInfo');
        // console.log("Current entities: " + JSON.stringify(basic_info_entities));
        // if (!basic_info_entities){
        // 	session.sendTyping();
        //     session.send("Sorry, I didn't quite understand your question.");
        //     session.sendTyping();
        //     session.replaceDialog('/query', { reprompt: true, name: session.userData.profile.name, bad_phrasing:
        // true }); } else {
        next({ response: args.entities });
        //}
    },
    function (session, results, next){
        if (results.response[0] != null){
        	console.log("This is entity results: " + JSON.stringify(results.response));
        	console.log(typeof(results.response[0].type));
            if (results.response[0].type.includes('BasicInsuranceInfo::copay')){ // (Entity: copay) is found in recognizer
            	session.sendTyping();
                var reply = insurance_module.coverageCopay(session.message.text, false);
            	session.sendTyping();
                session.send(reply);
                session.replaceDialog('/query', { reprompt: true, name: session.userData.profile.name });
            } else if (results.response[0].type.includes('BasicInsuranceInfo::deductible')){ // (Entity: deductible)
				// NOTE: Deductibles works different depending on plan's terms and conditions
				session.sendTyping();
                var reply = insurance_module.deductible(session.message.text);
                session.sendTyping();
                session.send(reply);
                // TODO: if deductible is $0, then may need a different behavior re: tracking.
                if (session.userData.profile.hasOwnProperty("deductible")){ //Giving user update on current deductible spending
                	session.sendTyping();
                	session.send("Just FYI, you have spent $" + session.userData.profile.deductible + " on deductibles so far this year.");
                	session.sendTyping();
                	next({ checkif_deductible_update: true });
                } else { //Asking user if she likes bot to track her deductible spending
                	session.sendTyping();
                	next({ deductible_dialog: true });
                }
                //session.replaceDialog('/query', { reprompt: true, name: session.userData.profile.name });
            } else if (results.response[0].type.includes('BasicInsuranceInfo::out_of_pocket_max')){ // (Entity: out of pocket max)
            	// NOTE: OOPM works different depending on plan's terms and conditions
            	session.sendTyping();
            	var oopm = insurance_module.outOfPocketMax();
            	var reply = "Your out-of-pocket maximum for this year is $" + oopm + ". This applies to all covered services or supplies."
            	session.sendTyping();
            	session.send(reply);
            	if (session.userData.profile.hasOwnProperty("oopm")){ //Giving user update on current oopm spending
            		session.sendTyping();
            		session.send("You have so far spent $" + session.userData.profile.oopm + " of the $" + oopm + " out-of-pocket maximum you have for the year.");
            		next({ checkif_oopm_update: true });
            	} else { //Asking user if she likes bot to track her oopm spending
            		session.sendTyping();
            		next({ oopm_dialog: true });
            	}
            } else if (results.response[0].type.includes('BasicInsuranceInfo::preventative_care')){ // (Entity: preventative care)
                session.sendTyping();
                session.send("By law, preventative care are free and covered by all insurances. The list of care is quite long though...");
                session.sendTyping();
                session.send("I will email you the list of free preventative care, so you can take a look at it when you have time.");
                if (session.userData.profile.hasOwnProperty("email")){
	                next({ response: session.userData.profile.email} );
                } else {
	                builder.Prompts.text(session, "What's your email?");
                }
            } else if (results.response[0].type.includes('BasicInsuranceInfo::coverage_question')){ //[Entity: what is/is not covered]
                session.sendTyping();
                var reply = insurance_module.coverageCopay(session.message.text, true);
                session.sendTyping();
                session.send(reply);
                session.replaceDialog('/query', { reprompt: true, name: session.userData.profile.name });
            } else { //TODO: For non-matching entities
            	session.send("Sorry, I didn't quite understand your question.");
				session.sendTyping();
	            session.replaceDialog('/query', { reprompt: true, name: session.userData.profile.name });
            }
        } else { //TODO: for when no entity was discovered
        	session.send("Sorry, I didn't quite understand your question.");
			session.sendTyping();
            session.replaceDialog('/query', { reprompt: true, name: session.userData.profile.name });
        }
    },
    function(session, results, next){
    	if (results.checkif_deductible_update){
    		console.log("Updating deductible...");
    		session.sendTyping();
    		session.beginDialog('/trackDeductible', { checkif_deductible_update: true });
    	} else if (results.deductible_dialog){
    		console.log("Starting deductible tracking...");
			session.sendTyping();
			session.beginDialog('/trackDeductible');
    	} else if (results.checkif_oopm_update){
    		console.log("Updating OOPM....");
    		session.sendTyping();
    		session.beginDialog('/trackOOPM', { checkif_oopm_update: true });
    	} else if (results.oopm_dialog){
    		console.log("Starting oopm tracking...");
    		session.sendTyping();
    		session.beginDialog('/trackOOPM');
    	} else if (results.response){ //TODO: this defaults to email address entry, but needs validation scheme
    		// Emailer Code Snippet:
    		session.userData.profile.email = results.response;
        //TOFIX: on Slack, results.response is "<mailto:kevin.s.xu@gmail.com|kevin.s.xu@gmail.com>"
        //so current snippet won't work...
    		var email_addr = results.response;

    		session.send("Great! I'll send this list to " + email_addr + " right now...");
            transporter.verify(function(err, success){
            	if (err){
            		console.log("SMTP connect fail: " + err);
            	} else {
            		console.log("SMTP server is ready!");
            	}
            })
            var prev_care_file = require('./insurances/adult_prev_care.js');
            var email_body = prev_care_file.emailAdultPrevCare();

            var mailOptions = {
            	from: '"KAI" <ceohockey60@gmail.com>',
            	to: email_addr,
            	subject: 'Adult Preventative Care - Sent by KAI',
            	html: email_body
            };
            transporter.sendMail(mailOptions, function (err, info){
            	if (err){
            		console.log("Emailing didn't work...");
            		session.send("Something went wrong, and I couldn't send the email...");
            	} else {
	            	session.sendTyping();
	            	session.send("Just sent it over. Check it out when you have time, and feel free to message back with any other questions.");
	            	console.log("Success! Email sent: " + info.response);
	            	session.sendTyping();
	                session.replaceDialog('/query', { reprompt: true, name: session.userData.profile.name });
            	}
            });
    	}
	},
	function(session, results){
		//TODO: need friendly warning when getting close to limit...
    	if (results.tracking_deductible){
    		console.log("Doing deductible tracking...");
    		if (isNaN(session.userData.profile.deductible)){
	    		session.userData.profile.deductible = 0;
    		}
    		session.sendTyping();
    		session.userData.profile.deductible += results.response;
			session.send("Got it. Your most updated deductible spending is $" + session.userData.profile.deductible + ". We will continue to track from here.");
    	} else if (results.tracking_oopm){
    		console.log("Doing OOPM tracking...");
    		if (isNaN(session.userData.profile.oopm)){
    			session.userData.profile.oopm = 0;
    		}
    		session.sendTyping();
    		session.userData.profile.oopm += results.response;
    		session.send("Got it. Your most updated out-of-pocket maximum spending is $" + session.userData.profile.oopm + ". We will continue to track from here.");
    	} else {
    		console.log("Not tracking anything...");
    	}
    	session.sendTyping();
        session.replaceDialog('/query', { reprompt: true, name: session.userData.profile.name });
    }
]);

medical_coverage_intents.matches('UpdateProfile', [
    function (session, args, next){
        // TOFIX: INSURANCE has trouble persisting, this is a TEMP fix:
        // INSURANCE = require('./insurances/cardinal_care.js');
        // console.log("This is args: " + JSON.stringify(args));
		//console.log("Module is: " + typeof(session.userData.profile.insuranceModule));

        next({ response: args.entities });
    },
    function (session, results, next){
        console.log("Current entities: " + results.response);
        if (results.response[0] != null){
            if (results.response[0].type.includes('BasicInsuranceInfo::deductible')) {
                if (session.userData.profile.hasOwnProperty("deductible")){ //Giving user update on current deductible spending
                    session.sendTyping();
                    // session.send("So far, you've spent $" + session.userData.profile.deductible + " on deductibles
                    // so far this year."); session.sendTyping();
                    session.beginDialog('/trackDeductible', { trigger_deductible_update: true });
                } else { //Asking user if she likes bot to track her deductible spending
                    session.sendTyping();
                    session.send("So I haven't been asked to track your deductibles before...");
                    session.beginDialog('/trackDeductible');
                }
            } else if (results.response[0].type.includes('BasicInsuranceInfo::out_of_pocket_max')){
                if (session.userData.profile.hasOwnProperty("oopm")){ //Giving user update on current oopm spending
                    session.sendTyping();
                    //session.send("So far, you've spent $" + session.userData.profile.oopm + " of the $" + oopm + "
                    // out-of-pocket maximum you have for the year.");
                    session.beginDialog('/trackOOPM', { trigger_oopm_update: true });
                } else { //Asking user if she likes bot to track her oopm spending
                    session.sendTyping();
                    session.send("So I haven't been asked to track your out-of-pocket maximum before...");
                    session.beginDialog('/trackOOPM');
                }
            } else { // Catch all for other things Kai is not tracking yet...
                session.send("Sorry, I didn't quite understand your request.");
                session.sendTyping();
                session.replaceDialog('/medical_coverage', { reprompt: true, name: session.userData.profile.name });
            }
        } else { // When no UpateProfile intent entity is found...
            session.send("Sorry, I didn't quite understand your request.");
            session.sendTyping();
            session.replaceDialog('/medical_coverage', { reprompt: true, name: session.userData.profile.name });
        }
    },
    function(session, results){
        //TODO: need friendly warning when getting close to limit...
        if (results.tracking_deductible){
            console.log("Doing deductible tracking...");
            if (isNaN(session.userData.profile.deductible)){
                session.userData.profile.deductible = 0;
            }
            session.sendTyping();
            session.userData.profile.deductible += results.response;
            session.send("Got it. Your most updated deductible spending is now $" + session.userData.profile.deductible + ". We will continue to track from here.");
        } else if (results.tracking_oopm){
            console.log("Doing OOPM tracking...");
            if (isNaN(session.userData.profile.oopm)){
                session.userData.profile.oopm = 0;
            }
            session.sendTyping();
            session.userData.profile.oopm += results.response;
            session.send("Got it. Your most updated out-of-pocket maximum spending is now $" + session.userData.profile.oopm + ". We will continue to track from here.");
        } else {
            console.log("Not tracking anything...");
        }
        session.sendTyping();
        session.replaceDialog('/medical_coverage', { reprompt: true, name: session.userData.profile.name });
    }
]);

medical_coverage_intents.matches('Appeal', [
	function(session, args){
		session.beginDialog('/appeal');
	}
]);

medical_coverage_intents.matches('EndConversation', [
	function (session, args){
		//console.log("This is args: " + JSON.stringify(args));
		session.beginDialog('/exit');
		// TODO: may be change this to Prompts.choice to make better UI.
        // builder.Prompts.confirm(session, "Would you like me to delete all your user info as you leave? (e.g.
        // tracking of deductibles, zipcode, age, etc.) You will have to re-enter them again next time we chat...");
	}
]);

// TODO: change onDefault and other catch alls to routing to Human Agents
medical_coverage_intents.onDefault(function(session, args){
	session.send("Sorry, I didn't understand your question.");
	session.replaceDialog('/medical_coverage', { reprompt: true, name: session.userData.profile.name });
});

// TODO: ---------------------------------------------------------
// [TO-IMPROVE]: Unique NLP recognizer for Mental Health Coverage related natural language questions
// ---------------------------------------------------------
// TODO: Add extra message to communicate commitment to user privacy
var model_mental_health_coverage = 'https://api.projectoxford.ai/luis/v2.0/apps/a26d804b-8d51-45c4-909a-df497c3bb844?subscription-key=a97f639bea8044f49d0aa1661f5b417b';
var recognizer_mental_health = new builder.LuisRecognizer(model_mental_health_coverage);
var mental_health_intents = new builder.IntentDialog({recognizers: [recognizer_medical_coverage]});

bot.dialog("/mental_health_coverage", mental_health_intents);
bot.beginDialogAction('Mental Health Coverage', '/mental_health_coverage');

mental_health_intents.onBegin(function (session, args, next){
	if (args.reprompt){
		session.sendTyping();
		session.send("What other question about your plan's mental health coverage can I help you with?");
	} else {
		session.send("OK, I can help you out with figuring out medical coverage of your plan.");
		session.sendTyping();
		session.send("What's your question?");
	}
});

// Build out
// More
// Intents!!

mental_health_intents.onDefault(function(session, args){
	session.send("Sorry, I didn't understand your question.");
	session.replaceDialog('/mental_health_coverage', { reprompt: true, name: session.userData.profile.name });
});


// TODO: ---------------------------------------------------------
// [TO-IMPROVE]: Unique NLP recognizer for Prescription Drug related natural language questions
// ---------------------------------------------------------
var model_prescription_drug_coverage = 'https://api.projectoxford.ai/luis/v2.0/apps/ccb69690-3409-4b7f-9e45-dbdb2d09583c?subscription-key=a97f639bea8044f49d0aa1661f5b417b';
var recognizer_prescription_drug = new builder.LuisRecognizer(model_prescription_drug_coverage);
var prescription_drug_intents = new builder.IntentDialog({recognizers: [recognizer_prescription_drug]});

bot.dialog("/prescription_drug_coverage", prescription_drug_intents);
bot.beginDialogAction('Prescription Drug', '/prescription_drug_coverage');

prescription_drug_intents.onBegin(function (session, args, next){
	if (args.reprompt){
		session.sendTyping();
		session.send("What other question about your plan's prescription drug coverage can I help you with?");
	} else {
		session.send("OK, I can help you out with figuring out prescription drug coverage of your plan.");
		session.sendTyping();
		session.send("What's your question?");
	}
});

// Build out
// More
// Intents!!

prescription_drug_intents.onDefault(function(session, args){
	session.send("Sorry, I didn't understand your question.");
	session.replaceDialog('/prescription_drug_coverage', { reprompt: true, name: session.userData.profile.name });
});


// TODO: My Plan Basics Option
bot.dialog("/my_plan_basics", [
	function(session, args, next){
		session.sendTyping();
		session.send("Coming soon...");
		session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
		session.sendTyping();
	}
]);
bot.beginDialogAction('My Plan Basics', '/my_plan_basics');

// TODO: Go Back Option
bot.dialog("/go_back_home", [
	function(session, args, next){
		session.sendTyping();
		session.send("Ok, going back to home menu now...");
		session.sendTyping();
		session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
	}
]);
bot.beginDialogAction('Go Back', '/go_back_home');


// ****************************
// ASSESS: whether deductibles and oopm should be tracked together, since their purpose overlaps.
// ****************************

// QUERY Sub-Dialog: Handle user trackDeductible Dialog Thread
bot.dialog('/trackDeductible', [
	function(session, args, next){
		console.log("Current deductible args: " + JSON.stringify(args));
		session.dialogData.profile = {};
		if (args){
            if (args.checkif_deductible_update){ //Update deductible
                session.sendTyping();
                builder.Prompts.confirm(session, "Would you like to update your deductible tracker with any new spending?");
	       	} else if (args.trigger_deductible_update){
                next({ response: true });
            }
        } else { //Start new deductible tracking...
			session.sendTyping();
			builder.Prompts.confirm(session, "Would you like us to start tracking your deductible spending?");
		}
	},
	function(session, results){
		if (results.response){
			session.sendTyping();
			builder.Prompts.number(session, "Sounds good. Please enter the amount you've spent.");
		} else {
			session.sendTyping();
			session.endDialog("Got it. Not a problem.");
		}
	},
	function(session, results){
		if (results.response == 0){
			session.sendTyping();
			session.sendTyping();
			session.send("OK, you are starting fresh, at $" + results.response + ", and we will track from there.");
		} else {
			session.sendTyping();
		}
		session.dialogData.profile.deductible = results.response;
		session.sendTyping();
		session.endDialogWithResult( { response: session.dialogData.profile.deductible, tracking_deductible: true });
	}]
);

// QUERY Sub-Dialog: Handle user trackOOPM Dialog Thread
bot.dialog('/trackOOPM', [
	function(session, args, next){
		console.log("Current OOPM args: " + JSON.stringify(args));
		session.dialogData.profile = {};
		if (args){
            if (args.checkif_oopm_update){ //Update OOPM
                session.sendTyping();
                builder.Prompts.confirm(session, "Would you like to update your out-of-pocket maximum tracker with any new spending?");
            } else if (args.trigger_oopm_update){
                next({ response: true });
            }
        } else { //Start new OOPM tracking...
			session.sendTyping();
			builder.Prompts.confirm(session, "Would you like us to start tracking your out-of-pocket maximum spending? (This is especially helpful if you have chronic conditions or have regular treatment or prescription drugs needs.");
		}
	},
	function(session, results){
		if (results.response){
			session.sendTyping();
			console.log("Prompt confirm result: " + JSON.stringify(results.response));
			builder.Prompts.number(session, "Sounds good. Please enter the new amount you've spent. (This would typically include any copay or coinsurance payments you've made.");
		} else {
			session.sendTyping();
			session.endDialog("Got it. Not a problem.");
		}
	},
	function(session, results){
		if (results.response == 0){
			session.sendTyping();
			session.send("OK, you are starting fresh, at $" + results.response + ", and we will track from there.");
			session.sendTyping();
		} else {
			session.sendTyping();
		}
		session.dialogData.profile.deductible = results.response;
		session.sendTyping();
		session.endDialogWithResult( { response: session.dialogData.profile.deductible, tracking_oopm: true });
	}]
);

// -----------------------------------------------
// TODO: Insurance 101 -- Dialog Thread
// -----------------------------------------------
bot.dialog('/insurance101', [
	function(session, args, next){
        var insurance_101_card = new builder.Message(session)
            .attachments([
                new builder.HeroCard(session)
                    .title("Insurance 101")
                    .buttons([
                        builder.CardAction.dialogAction(session, "EOB", undefined, "Evidence of Benefits"),
						            builder.CardAction.dialogAction(session, "My Plan Basics", undefined, "My Plan Basics"),
                        builder.CardAction.dialogAction(session, "Copay/Coinsurance", undefined, "Copay vs Coinsurance"),
                        builder.CardAction.dialogAction(session, "Deductible/OOPM", undefined, "Deductible vs Out-of-Pocket Max"),
                        builder.CardAction.dialogAction(session, "In/OutOfNetwork", undefined, "In vs Out of Network"),
                        builder.CardAction.dialogAction(session, "Generic/Brand", undefined, "Generic vs Brand-Name Drug"),
                        builder.CardAction.dialogAction(session, "Go Back", undefined, "Go Back")
                        ])
                    ]);
        session.send(insurance_101_card);
	}
]);
bot.beginDialogAction('Insurance 101', '/insurance101');

//TODO: Change Content...
bot.dialog('/eob_info', [
]);
bot.beginDialogAction('EOB', '/eob_info');
// TODO: Change Content...
bot.dialog('/copay_coinsurance_info', [
    function(session, args, next){
        session.sendTyping();
        session.send(insurance_101_module.copayCoinsuranceInfo(0));
        session.sendTyping();
        builder.Prompts.confirm(session, "Would you like to know more about copay and coinsurance?");
    },
    function(session, results, next){
        if (results.response){
            session.sendTyping();
            session.send(insurance_101_module.copayCoinsuranceInfo(1));
            session.sendTyping();
            builder.Prompts.confirm(session, "Would you like to know more about copay and coinsurance?");
        } else {
            session.sendTyping();
            session.send("Sounds good, let's go back to Insurance 101.");
            session.replaceDialog('/insurance101');
        }
    },
    function(session, results, next){
        if (results.response){
            session.sendTyping();
            session.send(insurance_101_module.copayCoinsuranceInfo(2));
            next();
        } else {
            session.sendTyping();
            session.send("Sounds good, let's go back to Insurance 101.");
            session.replaceDialog('/insurance101');
        }
    },
    function(session, results, next){
        session.sendTyping();
        session.send("Hope that was some useful information on how copay/coinsurance works.");
        session.sendTyping();
        session.send("For more info specific to your health plan, definitely go back to Main Menu and use the 'Ask Question' tool.");
        builder.Prompts.choice(session, "Would you like to do more with Insurance 101 or go back to the main menu?", ["Insurance 101", "Main Menu"]);
    },
    function(session, results){
        if (results.response.entity == "Insurance 101"){
            session.sendTyping();
            session.send("Cool, sounds good!");
            session.replaceDialog('/insurance101');
        } else {
            session.sendTyping();
            session.send("Great! Let's go back to the main menu...");
            session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
        }
    }
]);
bot.beginDialogAction('Copay/Coinsurance', '/copay_coinsurance_info');
// TODO: Change Content...
bot.dialog('/deductible_oopm_info', [
    function(session, args, next){
        session.sendTyping();
        session.send(insurance_101_module.deductibleInfo(0));
        session.sendTyping();
        builder.Prompts.confirm(session, "Would you like to know more about deductible?");
    },
    function(session, results, next){
        if (results.response){
            session.sendTyping();
            session.send(insurance_101_module.deductibleInfo(1));
            session.sendTyping();
            builder.Prompts.confirm(session, "Would you like to know more about deductible?");
        } else {
            session.sendTyping();
            session.send("Sounds good, let's go back to Insurance 101.");
            session.replaceDialog('/insurance101');
        }
    },
    function(session, results, next){
        if (results.response){
            session.sendTyping();
            session.send(insurance_101_module.deductibleInfo(2));
            next();
        } else {
            session.sendTyping();
            session.send("Sounds good, let's go back to Insurance 101.");
            session.replaceDialog('/insurance101');
        }
    },
    function(session, results, next){
        session.sendTyping();
        session.send("Hope that was some useful information on how deductible works.");
        session.sendTyping();
        session.send("For more info specific to your health plan, definitely go back to Main Menu and use the 'Ask Question' tool.");
        builder.Prompts.choice(session, "Would you like to do more with Insurance 101 or go back to the main menu?", ["Insurance 101", "Main Menu"]);
    },
    function(session, results){
        if (results.response.entity == "Insurance 101"){
            session.sendTyping();
            session.send("Cool, sounds good!");
            session.replaceDialog('/insurance101');
        } else {
            session.sendTyping();
            session.send("Great! Let's go back to the main menu...");
            session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
        }
    }
]);
bot.beginDialogAction('Deductible/OOPM', '/deductible_oopm_info');
// TODO: Change Content...
bot.dialog('/in_out_network', [
]);
bot.beginDialogAction('In/OutOfNetwork', '/in_out_network');
// TODO: Change Content...
bot.dialog('/generic_brand_drug', [
]);
bot.beginDialogAction('Generic/Brand', '/generic_brand_drug');


// -----------------------------------------------
// TODO: Analyze a Bill or Statement Uploaded by User -- Dialog Thread
// -----------------------------------------------
bot.dialog("/bill_analyzer", [
	function(session, args, next){
		session.send("Great! Medical bill are pretty confusing...Let me help you!");
    session.sendTyping();
    session.send("We take your privacy very seriously, so your information will not be misused in any way, when I analyze your bills for you.");
    // TODO: need to give user proper instruction on which button to click to upload, varies by channel
    builder.Prompts.attachment(session, "Please upload your bill or Explanation of Benefits.");
  },
  function(session, results, next){
    console.log("Result: " + JSON.stringify(results));
    session.send("Cool, let me analyze this bill for you, hang on...");
    // NOTE: file path after upload is: results.response[0].contentUrl
    var PythonShell = require('python-shell');
    var pyshell = new PythonShell('./ocr_python/ocr_msft_comp_vision.py', { mode: 'text', pythonPath: 'python3'}); //specify to run script on python3
    console.log("sending file over to ocr script...");
    pyshell.send(results.response[0].contentUrl);
    console.log("ocr script now processing file...");
    pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
        session.send("Here's what I can find for now...");
        session.sendTyping();
        var json_formatted_msg = message.substring(2, message.length-1); //strip unnecessary chars to can be converted to JSON
        console.log("Current JSON: " + (JSON.parse(json_formatted_msg)));
        // send back entire JSON
        session.send(JSON.stringify(JSON.parse(json_formatted_msg)));
        // Prompt for more Bill related questions in the future, right now, just go back to home screen:
        session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
        console.log("Language is: " + JSON.parse(json_formatted_msg).language);
    });
    pyshell.end(function (err) {
        if (err) {
          session.send("Sorry, that didn't work...");
          session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
          throw err;
        }
        console.log('ocr finished');
    });

    // var options = {
    //   mode: 'text',
    //   args: [results.response[0].contentUrl]
    // };
    // PythonShell.run('./ocr_python/OCR_tesseract.py', options, function (err, results) {
    //   console.log("now talking to OCR py script...");
    //   if (err) throw err;
    //   session.sendTyping();
    //   session.send(results);
    //   console.log('OCR result: ', results);
    // });
  }
]);
bot.beginDialogAction('Bill Analyzer', '/bill_analyzer');

// -----------------------------------------------
// TODO: Send Tips and Advice to User -- Dialog Thread
// -----------------------------------------------
bot.dialog('/tips', [
    function(session, args, next){
        if (args.reprompt){
            session.sendTyping();
            builder.Prompts.choice(session, "What else about your insurance or medical cost would you like some tips on?", ["Before Care", "After Care", "Communication Tips", "Exit"]);
        } else {
            session.sendTyping();
            builder.Prompts.choice(session, "What aspect of your insurance or medical cost would you like some tips on?", ["Before Care", "After Care", "Communication Tips", "Exit"]);
        }
    },
    function(session, results, next){
        //var general_tips_module = require('./insurances/general_tips.js');
        if (results.response.entity == "Before Care"){
            session.sendTyping();
            session.send(tips_module.preServiceTips());
            session.sendTyping();
            session.replaceDialog('/tips', { reprompt: true });
        } else if (results.response.entity == "After Care"){
            session.sendTyping();
            session.send(tips_module.postServiceTips());
            session.sendTyping();
            session.replaceDialog('/tips', { reprompt: true });
        } else if (results.response.entity == "Communication Tips"){
            console.log("testing 1");
            session.sendTyping();
            session.send(tips_module.communicationTips());
            session.sendTyping();
            console.log("testing 2");
            session.replaceDialog('/tips', { reprompt: true });
        } else {
            session.sendTyping();
            session.send("Ok, sounds good. Back to the main menu...");
            session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
        }
    }

]);
// TODO: add default state for Bye -> exit conversation?
bot.beginDialogAction('Tips', '/tips');

// ---------------------------------------------------------
// TODO: Facilitate Dispute Resolution/ODR -- Dialog Thread
// ---------------------------------------------------------
bot.dialog('/appeal', [
	function(session, args, next){
		if (args.reprompt && args.ask_tip){
			session.sendTyping();
			builder.Prompts.choice(session, "What else would you like to learn about?", ["How to Appeal", "IMR/Arbitration", "Write Appeal Letter", "More Tips", "Exit"]);
		} else if (args.reprompt && !args.ask_tip){
			session.sendTyping();
			builder.Prompts.choice(session, "What else would you like to learn about?", ["How to Appeal", "IMR/Arbitration", "Write Appeal Letter", "Tips", "Exit"]);
		} else {
			session.send("Let me go look up info related to appeal filing specific to your insurance plan.");
			session.sendTyping();
			session.send("Hold on...");
			session.sendTyping();
			builder.Prompts.choice(session, "What part of the appeal process would you like to learn about?", ["How to Appeal", "IMR/Arbitration", "Write Appeal Letter", "Tips", "Exit"]);
		}
	},
	function(session, results, next){
		console.log("Reponse entity: " + results.response.entity);
		if (results.response.entity == "How to Appeal"){ //Choice: Standard Appeal
			session.sendTyping();
			session.send("Information related to the appeal process is a bit long...");
			builder.Prompts.choice(session, "Would you like me to email that to you, or would you prefer I just send a series messages here to explain it?", ['Email Me Appeal Info', 'Message Me Appeal Info']);
		} else if (results.response.entity == "IMR/Arbitration") { //Choice: IMR/Arbitration
			session.sendTyping();
			session.send("Ok...I have a lot to share on this, so bear with me...");
			session.sendTyping();
			var imr_info = insurance_module.imrInfo();
			var arbitration_info = insurance_module.arbitrationInfo();
			// IMR information:
			function msg1(){
				session.send("Another way to get your case heard is through the Independent Medical Review (IMR) with the " + imr_info.state + " government.");
				session.sendTyping();
				session.send("You can apply for an IMR, if " + insurance_module.carrierName() + " does not resolve your appeal satisfactorily within " + imr_info.imr_trigger_period_days + " days.");
				session.sendTyping();
			}
			function msg2(){
				session.send("To get the process started, fill out an IMR application form. You can find the form here: " + imr_info.application_form);
				session.sendTyping();
				session.send("Also remember to supply all the supporting documents mentioned in the application.");
				session.sendTyping();
			}
			function msg3(){
				session.send("If you need more info, give the " + imr_info.state + " Department of Insurance a call at " + imr_info.phone_number + " or go on their website: " + imr_info.website);
				session.sendTyping();
				session.send("For a routine, non-urgent appeal, IMR must respond within " + imr_info.non_urgent_response_days + " days.");
				session.sendTyping();
			}
			function msg4(){
				session.send("For really urgent matters, like serious health threat or potential loss of life or limbs, IMR must respond within " + imr_info.urgent_response_days + " business days.");
				session.sendTyping();
			}
			// Arbitration information:
			function msg5(){
				session.send("If both your appeal with " + insurance_module.carrierName() + " and the IMR failed, your last resort is to file for binding arbitration.");
				session.send("Arbitration basically means both you and the insurance company will appoint a mutually acceptable neutral arbitrator, usually a retired judge or a legal expert.");
				session.sendTyping();
			}
			function msg6(){
				session.send("So whatever this arbitrator decides, like who is at fault, who should pay whom and how much, will be the final decision of the dispute.");
				session.sendTyping();
				session.send("If you want to file for arbitration, send a written request to:\n " + arbitration_info.arb_demand_addr + ".");
				session.sendTyping();
			}
			// TODO: build feature to auto-generate written request for arbitration
			function msg7(){
				session.send("This written request should have a clear statement of what happened and what kind of damages you seek. (Make sure you include a specific dollar amount.)");
				session.sendTyping();
				session.send("I would recommend you find a lawyer to help you, if you want to pursue arbitration. The process can get tricky, and legal expertise here is worth it.");
				// TODO: may build in insurance arbitration lawyer recommendation features here...
				session.sendTyping();
			}
			function msg8(){
				session.replaceDialog('/appeal', { reprompt: true, ask_tip: false });
			}
			// Delay mechanism (5 sec increments) to design a more natural flow of messages
			msg1();
			setTimeout(msg2, 5000);
			setTimeout(msg3, 10000);
			setTimeout(msg4, 15000);
			setTimeout(msg5, 20000);
			setTimeout(msg6, 25000);
			setTimeout(msg7, 30000);
			setTimeout(msg8, 35000);
		} else if (results.response.entity == "Tips" || results.response.entity == "More Tips") { //Choice: Tips/More Tips
			// TODO: depending on which tip is shown, can prompt relevant functionalities (e.g. writing letter...)
            //var appeal_tips_module = require('./insurances/general_tips.js');
			session.sendTyping();
			session.send(["I'll share this tip with you...", "Here's a good tip!", "Let me share this tip with you..."]);
			session.sendTyping();
			session.send(tips_module.appealTips());
			session.sendTyping();
			session.replaceDialog('/appeal', { reprompt: true, ask_tip: true });
		} else if (results.response.entity == "Write Appeal Letter"){ // Choice: auto-write appeal letter
            session.sendTyping();
            //TODO: build document generation feature based on user input
            //TODO: prompt a form for user to fill information for letter
            session.send("Stay tuned...I'll be able to write your appeal letter for you soon...");
            session.replaceDialog('/appeal', { reprompt: true, ask_tip: false });
        } else { // Choice: Exit
			session.sendTyping();
			session.send("Ok, sounds good. Let's go back to the main menu...");
			session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
		}
	},
	function(session, results, next){
		if (results.response.entity == "Email Me Appeal Info"){ // Ask user for email address to send Appeal Process info
			session.sendTyping();
			if (session.userData.profile.email){
				next( { response: session.userData.profile.email } );
			} else {
				builder.Prompts.text(session, "Sounds good! What's your email?");
			}
		} else if (results.response.entity == "Message Me Appeal Info") { // Send Appeal Process info via texts
			session.sendTyping();
			session.send("Ok, then get ready for a series of texts coming your way!");
			var appeal_info = insurance_module.appealInfo(false);
			function msg1(){
				session.send("You can appeal any time where you thought the insurance company wrongly denied, reduced, terminated or failed to pay for services or claims.");
				session.sendTyping();
				session.send("There are 3 ways to begin your appeal...");
				session.sendTyping();
			}
			function msg2(){
				session.send("1. You call the insurance company at " + appeal_info.phone_number + " to explain your situation.");
				session.sendTyping();
			}
			function msg3(){
				session.send("2. You go on the " + insurance_module.carrierName() + " website at " + appeal_info.website + " and fill out the appeal form online.");
				session.send("You will probably need to register an online account with them.");
				session.sendTyping();
			}
			function msg4(){
				session.send("3. You can make an appeal in writing by mailing the appeal form to: \n" + appeal_info.mail_addr + ".");
				session.sendTyping();
				session.send("You can find and print out the form here: " + appeal_info.paper_form_link);
				session.sendTyping();
			}
			function msg5(){
				session.send("If your appeal is related to a claim denial, the insurance company must respond within " + appeal_info.claim_response_days + " calendar days.");
				session.sendTyping();
				session.send("If it's not related to a claim denial, they must respond within " + appeal_info.non_claim_response_days + " calendar days.");
				session.sendTyping();
			}
			function msg6(){
				session.send("You have " + appeal_info.appeal_filing_period + " days from the day the claim in dispute happened to file an appeal.");
				session.sendTyping();
			}
			function msg7(){
				session.replaceDialog('/appeal', { reprompt: true, ask_tip: false });
			}
			// Delay mechanism (5 sec increments) to design a more natural flow of messages
			msg1();
			setTimeout(msg2, 5000);
			setTimeout(msg3, 10000);
			setTimeout(msg4, 15000);
			setTimeout(msg5, 20000);
			setTimeout(msg6, 25000);
			setTimeout(msg7, 30000);
		} else {
			session.sendTyping();
			session.send("Ok, let's go back to the Appeal Process section...");
			session.replaceDialog('/appeal', { reprompt: true, name: session.userData.profile.name });
		}
	},
	function(session, results){
		if (results.response){ // Email User Appeal Process Information
			session.userData.profile.email = results.response;
        console.log("Email is: " + JSON.stringify(results.response));
        //TOFIX: on Slack, results.response is "<mailto:kevin.s.xu@gmail.com|kevin.s.xu@gmail.com>"
        //so current snippet won't work...
    		var email_addr = results.response;

    		session.send("Great! I'll send to " + email_addr + " right now...");
            transporter.verify(function(err, success){
            	if (err){
            		console.log("SMTP connect fail: " + err);
            	} else {
            		console.log("SMTP server is ready!");
            	}
            })
            var email_body = insurance_module.appealInfo(true);

            var mailOptions = {
            	from: '"KAI" <ceohockey60@gmail.com>',
            	to: email_addr,
            	subject: 'How to File an Appeal - Sent by KAI',
            	html: email_body
            };
            transporter.sendMail(mailOptions, function (err, info){
            	if (err){
            		console.log("Emailing didn't work...");
                console.log(err);
            		session.send("Something went wrong, and I couldn't send the email...");
            	} else {
	            	session.sendTyping();
	            	session.send("Just sent it over. Check it out when you have time, and feel free to message back with any other questions.");
	            	console.log("Success! Email sent: " + info.response);
	            	session.sendTyping();
	                session.replaceDialog('/appeal', { reprompt: true, name: session.userData.profile.name });
            	}
            });

        } else {
			session.sendTyping();
			session.send("Ok, sounds good.");
			session.replaceDialog('/appeal', { reprompt: true, name: session.userData.profile.name });
		}
	}
]);
bot.beginDialogAction('Appeal', '/appeal');

// -----------------------------------------------
// TODO: Help Estimate Cost for certain procedure -- Dialog Thread
// -----------------------------------------------
bot.dialog('/estimate_cost', [
	function(session, args, next){
		//FLOW:
		  // - Ask for procedure name, combine with state/zipcode
		  // - send email to admin to do cost estimation manually
		  // - take average of healthcarebluebook.com + newchoicehealth.com + clearhealthcost.com
		  // - also look up Medicare rate
		  // - send fair value average and medicare rate to user (NEED: async or Promise? check npm for tools!)
		session.send("Stay tuned...I'll be able to help you estimate cost soon!");
		// REASSESS: if query dialog needs to be reprompted here
        session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
	}
]);
bot.beginDialogAction('Estimate Cost', '/estimate_cost');

// // -----------------------------------------------
// // TODO: Drugs Related Questions -- Dialog Thread
// // -----------------------------------------------
// bot.dialog('/drugs', [
// 	function(session, args, next){
// 		session.send("Druuuuuugggsss....");
// 		// REASSESS: if query dialog needs to be reprompted here
//         session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
// 	}
// ]);
// bot.beginDialogAction('Drugs', '/drugs');


// -----------------------------------------------
// End Conversation Dialog Thread
// -----------------------------------------------
bot.dialog('/exit', [
	function(session, args, next){
		session.send("Sounds good.");
		session.sendTyping();
		builder.Prompts.confirm(session, "Would you like me to delete all your information? [yes/no] You will have to re-enter them again next time we chat...");
	},
	function(session, results){
		if (results.response){
			delete session.userData.profile;
            delete session.dialogData.profile;
            session.sendTyping();
            session.send("You got it! Deleting now...");
			session.sendTyping();
			session.send("Done!");
		} else { // May want to enter HIPAA compliance language here...
			session.send("Ok, we will keep your information safely stored, and we can pick up where we left off the next time we chat!");
			session.save();
			session.sendTyping();
		}
		session.endDialog();
        session.endConversation("Have a good day!");
	}
]);
bot.beginDialogAction('Exit', '/exit');




