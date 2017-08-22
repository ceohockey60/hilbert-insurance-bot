//=========================================================
// Hilbert Bot server.js is the node.js server that contains all the
// features, logic, and functionalities that power the bot
//=========================================================

//=========================================================
// Current Functionalities:
//=========================================================

    // Insurance Plan Modeled: Stanford Cardinal Care

    // Stanford Cardinal Care:
    //     - natural language processing of user input on questions related to medical 
    //       coverage contextulized in Stanford Cardinal Care insurance plan
    //     - OCR (using Microsoft computer vision API) to scrape raw information from
    //       an EOB that user uploads as an image
    //     - educational information on insurance terms:
    //           copay/coinsurance 
    //           deductibles/out-of-pocket maxiumum
    //           in and out-of-network providers 
    //     - educational cost information on appeal and claims process
    //     - tracking of deductibles and out-of-pocket maximum 
    //     - auto-email user a list of preventative care mandated by law

"use strict";

var builder = require('botbuilder');
var emailer = require('nodemailer');

// Global var holding the module that contains insurance policy information of current session/user
var insurance_module;
var tips_module = require("./insurances/general_tips.js");
var insurance_101_module = require("./insurances/insurance_101.js");

// Email agent for auto-emailing certain information to user from
// ceohockey60@gmail.com (Kevin Xu's other email)
// REPLACE: with your own email if you want to test out this feature
var transporter = emailer.createTransport('smtps://ceohockey60%40gmail.com:crushit1986!@smtp.gmail.com');


//=========================================================
// Server APIs Setup
//=========================================================

// Express Server
var async = require('async');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var assert = require('assert');
var multer = require('multer');
var fs = require('fs');
var app = express();
var router = express.Router();

app.use(express.static(__dirname));

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/*
 * URL /- Homepage, render index.html
 */
app.get('/', function (req, res) {
  res.send("exposing local public folder...");
});


/*
 * URL /dev-login - Log in a visitor to access chatbot for testing
 */
app.post('/dev-login', function (req, res){
  var passcode = req.body.dev_cred;
  if (passcode === 'gohilbert'){
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
// NOTE: please change to your own Microsoft Bot Framework credentials
var connector = new builder.ChatConnector({
    appId: 'f151af23-XXXXXXXXX',
    appPassword: '9LfaXXXXXXXXXXXXX'
});

var bot = new builder.UniversalBot(connector);
app.post('/api/messages', connector.listen());


//=========================================================
// Bots Dialogs
//=========================================================

// -----------------------------------------------
// Root Dialog Thread
// -----------------------------------------------

bot.dialog('/', [
    function (session) {
    	session.sendTyping();
    	if (session.userData.profile){ // Returning User
    		session.send("Hi %s, thanks for reaching out again.", session.userData.profile.name);
			session.sendTyping();
            // NOTE: current bot setup defaults to Stanford Cardinal Care plan information
			insurance_module = require('./insurances/cardinal_care.js');
			session.sendTyping();
    		session.beginDialog('/home', { reprompt: true, name: session.userData.profile.name });
    	} else { // New user
			function msg1(){
				session.send("Hey, this is Hilbert!");
				session.sendTyping();
				session.send("I can help you with your health insurance questions and keep track of important expenses.");
    			session.sendTyping();
			}
			function msg2(){
	    		session.beginDialog('/buildProfile', session.userData.profile);
			}
			msg1();
			setTimeout(msg2, 1000);
    	}
    },
    function (session, results) {
    	if (results.response){
    		session.userData.profile = results.response;
    		// For Debugging: shows user profile data fields
    		console.log("Name: %s; State: %s; Insurance Plan: %s", session.userData.profile.name, session.userData.profile.state, session.userData.profile.insurancePlanName);
    		insurance_module = require('./insurances/cardinal_care.js');
	    	session.sendTyping();
	        session.beginDialog('/home', { reprompt: true, name: session.userData.profile.name });
    	}
    }
]);


// -----------------------------------------------
// Build User Profile -- Dialog Thread
// -----------------------------------------------

// TODO: Need authentication of user input
bot.dialog('/buildProfile', [
    function (session, args, next) { 
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
    	setTimeout(msg1, 1000);
    	setTimeout(msg2, 2000);
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.state) {
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
            session.sendTyping();
        	builder.Prompts.text(session, "What's the name of your insurance plan? (Defaulted to: Stanford Cardinal Care)");
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
	    				.buttons([
	    					builder.CardAction.dialogAction(session, "Query", undefined, "About My Plan"),
	    					builder.CardAction.dialogAction(session, "EOB Analyzer", undefined, "Explanation of Benefits (EOB) Analysis"),
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
bot.dialog('/query', [
	function(session, args, next){
		// console.log("Query args: " + args.data.name);
		session.sendTyping();
		var query_card = new builder.Message(session)
			.attachments([
				new builder.HeroCard(session)
					.title("Select one of these topics about your plan.")
					.buttons([
						builder.CardAction.dialogAction(session, "Medical Coverage", undefined, "Questions About Medical Coverage"),
						builder.CardAction.dialogAction(session, "Insurance 101", undefined, "Insurance 101"),
                        builder.CardAction.dialogAction(session, "Appeal", undefined, "Learn About Appeal"),
                        builder.CardAction.dialogAction(session, "Go Back", undefined, "Go Back")
						])
					]);
		session.send(query_card);
		next();
	}
]);
bot.beginDialogAction('Query', '/query');

// -----------------------------------------------
// Ask Questions about User's Insurance Plan -- Dialog Thread
// -----------------------------------------------
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
		session.sendTyping();
		session.send("OK, I can help you out. What's your question?");
	}
});

// -----------------------------------------------
// Handles All User Intents that Ask Questions about Basic Medical Coverage related cost 
// -----------------------------------------------

medical_coverage_intents.matches('AskQuestion', [
    function (session, args, next){
    	console.log("This is args: " + JSON.stringify(args));
        next({ response: args.entities });
    },
    //Answer basic questions regarding the insurance plan's copays, deductibles, out-of-pocket max, and basic coverage questions.
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
				session.sendTyping();
                var reply = insurance_module.deductible(session.message.text);
                session.sendTyping();
                session.send(reply);
                if (session.userData.profile.hasOwnProperty("deductible")){ //Giving user update on current deductible spending
                	session.sendTyping();
                	session.send("Just FYI, you have spent $" + session.userData.profile.deductible + " on deductibles so far this year.");
                	session.sendTyping();
                	next({ checkif_deductible_update: true });
                } else { //Asking user if she likes bot to track her deductible spending
                	session.sendTyping();
                	next({ deductible_dialog: true });
                }
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
    	} else if (results.response){ 
            // TODO: this defaults to email address entry, but needs validation scheme
    		// Emailer Code Snippet:
    		session.userData.profile.email = results.response;
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

            // NOTE: please change to your own email to test out this function
            var mailOptions = {
            	from: '"Hilbert" <ceohockey60@gmail.com>',
            	to: email_addr,
            	subject: 'Adult Preventative Care - Sent by Hilbert',
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

// -----------------------------------------------
// Reroutes all User intent related to appeal process to the Appeal dialog thread  
// -----------------------------------------------

medical_coverage_intents.matches('Appeal', [
	function(session, args){
		session.beginDialog('/appeal');
	}
]);

// -----------------------------------------------
// Reroutes all User intent related to Ending Conversation to the End Conversation dialog thread  
// -----------------------------------------------

medical_coverage_intents.matches('EndConversation', [
	function (session, args){
		session.beginDialog('/exit');
	}
]);

// TODO: change onDefault and other catch alls to routing to Human Agents
medical_coverage_intents.onDefault(function(session, args){
	session.send("Sorry, I didn't understand your question.");
	session.replaceDialog('/medical_coverage', { reprompt: true, name: session.userData.profile.name });
});


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
// Insurance 101 -- Dialog Thread
// -----------------------------------------------
bot.dialog('/insurance101', [
	function(session, args, next){
        var insurance_101_card = new builder.Message(session)
            .attachments([
                new builder.HeroCard(session)
                    .title("Insurance 101")
                    .buttons([
                        builder.CardAction.dialogAction(session, "Copay/Coinsurance", undefined, "Copay vs Coinsurance"),
                        builder.CardAction.dialogAction(session, "Deductible/OOPM", undefined, "Deductible vs Out-of-Pocket Max"),
                        builder.CardAction.dialogAction(session, "In/OutOfNetwork", undefined, "In vs Out of Network"),
                        builder.CardAction.dialogAction(session, "Go Back to About My Plan", undefined, "Go Back")
                        ])
                    ]);
        session.send(insurance_101_card);
	}
]);
bot.beginDialogAction('Insurance 101', '/insurance101');

// SubDialog to show user information regarding copay and coinsurance
bot.dialog('/copay_coinsurance_info', [
    function(session, args, next){
        session.sendTyping();
        session.send(insurance_101_module.copayCoinsuranceInfo(0));
        session.sendTyping();
        builder.Prompts.confirm(session, "Would you like to know more about copay and coinsurance? [y/n]");
    },
    function(session, results, next){
        if (results.response){
            session.sendTyping();
            session.send(insurance_101_module.copayCoinsuranceInfo(1));
            session.sendTyping();
            builder.Prompts.confirm(session, "Would you like to know more about copay and coinsurance? [y/n]");
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

// SubDialog to show user information regarding deductibles and out-of-pocket maximum
bot.dialog('/deductible_oopm_info', [
    function(session, args, next){
        session.sendTyping();
        session.send(insurance_101_module.deductibleOOPMInfo(0));
        session.sendTyping();
        builder.Prompts.confirm(session, "Would you like to know more about how deductible or out-of-pocket maximum works? [y/n]");
    },
    function(session, results, next){
        if (results.response){
            session.sendTyping();
            session.send(insurance_101_module.deductibleOOPMInfo(1));
            session.sendTyping();
            builder.Prompts.confirm(session, "Would you like to know more about how deductible or out-of-pocket maximum works? [y/n]");
        } else {
            session.sendTyping();
            session.send("Sounds good, let's go back to Insurance 101.");
            session.replaceDialog('/insurance101');
        }
    },
    function(session, results, next){
        if (results.response){
            session.sendTyping();
            session.send(insurance_101_module.deductibleOOPMInfo(2));
            next();
        } else {
            session.sendTyping();
            session.send("Sounds good, let's go back to Insurance 101.");
            session.replaceDialog('/insurance101');
        }
    },
    function(session, results, next){
        session.sendTyping();
        session.send("Hope that was some useful information on how deductible and out-of-pocket maxiumum works.");
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

// SubDialog to show user information regarding in vs. out of network services
bot.dialog('/in_out_network', [
       function(session, args, next){
        session.sendTyping();
        session.send(insurance_101_module.inOutNetworkInfo(0));
        session.sendTyping();
        builder.Prompts.confirm(session, "Would you like to know more about how In vs. Out of Network works? [y/n]");
    },
    function(session, results, next){
        if (results.response){
            session.sendTyping();
            session.send(insurance_101_module.inOutNetworkInfo(1));
            session.sendTyping();
            builder.Prompts.confirm(session, "Would you like to know more about how In vs. Out of Network works? [y/n]");
        } else {
            session.sendTyping();
            session.send("Sounds good, let's go back to Insurance 101.");
            session.replaceDialog('/insurance101');
        }
    },
    function(session, results, next){
        if (results.response){
            session.sendTyping();
            session.send(insurance_101_module.inOutNetworkInfo(2));
            next();
        } else {
            session.sendTyping();
            session.send("Sounds good, let's go back to Insurance 101.");
            session.replaceDialog('/insurance101');
        }
    },
    function(session, results, next){
        session.sendTyping();
        session.send("Hope that was some useful information on how In vs. Out of Network works.");
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
bot.beginDialogAction('In/OutOfNetwork', '/in_out_network');


// Return to About My Plan menu
bot.dialog("/go_back_about_plan", [
	function(session, args, next){
		session.sendTyping();
		session.send("Ok, going back to 'About My Plan' Menu...");
		session.sendTyping();
		session.replaceDialog('/query', { reprompt: true, name: session.userData.profile.name });
	}
]);
bot.beginDialogAction('Go Back to About My Plan', '/go_back_about_plan');


// -----------------------------------------------
// Analyze a Explanation of Benefits (EOB) Uploaded by User -- Dialog Thread
// -----------------------------------------------
bot.dialog("/eob_analyzer", [
	function(session, args, next){
		session.send("Great! Medical bill and EOBs are pretty confusing...Let me help you!");
    session.sendTyping();
    session.send("We take your privacy very seriously, so your information will not be misused in any way, when I analyze your bills for you.");
    builder.Prompts.attachment(session, "Please upload a bill or Explanation of Benefits.");
  },
  function(session, results, next){
    console.log("Result: " + JSON.stringify(results));
    session.send("Cool, let me analyze this bill for you, hang on...");
    // NOTE: file path after upload is: results.response[0].contentUrl
    var PythonShell = require('python-shell');
    var pyshell = new PythonShell('./ocr_python/ocr_msft_comp_vision.py', { mode: 'text', pythonPath: 'python3'}); //specify to run script on python3
    console.log("Image url: " + results.response[0].contentUrl);
    console.log("sending file over to ocr script...");
    pyshell.send(results.response[0].contentUrl);
    console.log("ocr script now processing file...");

    pyshell.on('message', function (message) {
        console.log("Raw message: " + message);   
        session.send("Here's what I can find for now...");
        session.sendTyping();
        // Send Raw JSON object resulted from OCR to user for now
        session.send(JSON.stringify(message));
        // Go back to Home menu after OCR is finished
        session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
    });
    
    pyshell.end(function (err) {
        if (err) {
          session.send("Sorry, that didn't work...");
          session.replaceDialog('/home', { reprompt: true, name: session.userData.profile.name });
          throw err;
        }
        console.log('ocr finished');
    });
  }
]);
bot.beginDialogAction('EOB Analyzer', '/eob_analyzer');


// ---------------------------------------------------------
// Facilitate Appeal and Claims Dispute Resolution -- Dialog Thread
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

			function msg1(){             // IMR information:
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
			session.sendTyping();
			session.send(["I'll share this tip with you...", "Here's a good tip!", "Let me share this tip with you..."]);
			session.sendTyping();
			session.send(tips_module.appealTips());
			session.sendTyping();
			session.replaceDialog('/appeal', { reprompt: true, ask_tip: true });
		} else if (results.response.entity == "Write Appeal Letter"){ // Choice: auto-write appeal letter
            session.sendTyping();
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

            // NOTE: change this to your own email:
            var mailOptions = {
            	from: '"Hilbert" <ceohockey60@gmail.com>',
            	to: email_addr,
            	subject: 'How to File an Appeal - Sent by Hilbert',
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
		} else { 
			session.send("Ok, we will keep your information safely stored, and we can pick up where we left off the next time we chat!");
			session.save();
			session.sendTyping();
		}
		session.endDialog();
        session.endConversation("Have a good day!");
	}
]);
bot.beginDialogAction('Exit', '/exit');




