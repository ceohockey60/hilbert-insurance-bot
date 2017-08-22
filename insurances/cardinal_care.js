"use strict";

//=========================================================
// This module models basic terms, conditions and procedures
// covered by Stanford's Cardinal Care Plan, which is offered
// to all students. 
// Source: insurance plan's Evidence of Benefits document
//=========================================================


// Name and Carrier
exports.planName = function(){
	return "Stanford Cardinal Care";
};
exports.carrierName = function(){
	return "HealthNet";
}

// ---------------------------------------------
// Out-of-Pocket Maximum and Deductible Section
// ---------------------------------------------

exports.outOfPocketMax = function(){
	var oopm = 2000;
	return oopm;
};

exports.deductible = function(query){	
	var emergency_deductible = 100;
	var urgent_care_deductible = 50;
	var normal_deductible = 0;
	if (query.includes("emergency room") || query.includes("emergency")) {
		return "Your deductible in an emergency room situation is $" + emergency_deductible + " for this year.";
	} else if (query.includes("urgent care")) {
		return "Your deductible when receiving urgent care is $" + urgent_care_deductible + " for this year.";
	} else {
		return "Your deductible under normal, non-emergency or non-urgent care situations is $" + normal_deductible + " for this year."
	}

};

// ---------------------------------------------
// Copay, Coinsurance, Coverage Questions Section
// ---------------------------------------------
exports.coverageCopay= function(query, coverage_Q_flag){
	var coverage_Q_yes_message = "Yes, this service is covered. ";
	var coverage_Q_no_message = "No, unfortunatley, this service is not covered. "
	var pre_auth_phone_number = "1-800-977-7282";
	//TODO: need to fix word overlap mistakes, e.g. "surgery" and "transgender surgery" both map to surgery
	var copay_no_cert = [
		{
			"service": "prenatal office visit",
			"price": 0,
			"certification": false,
			"message": ""
		},
		{
			"service": "normal delivery",
			"price": 0,
			"certification": false,
			"message": ""
		},
		{
			"service": "c section", //Or: caesarean section
			"price": 0,
			"certification": false,
			"message": ""
		},
		{
			"service": "new born inpatient care",
			"price": 0,
			"certification": false,
			"message": ""
		},
		{
			"service": "physician visit",
			"price": 25,
			"certification": false,
			"message": ""
		},
		{
			"service": "postnatal office visit",
			"price": 25,
			"certification": false,
			"message": ""
		},
		{
			"service": "specialist consultation",
			"price": 30,
			"certification": false,
			"message": ""
		},
		{
			"service": "chemotherapy",
			"price": 30,
			"certification": false,
			"message": ""
		},
		{
			"service": "vision exam",
			"price": 30,
			"certification": false,
			"message": ""
		},
		{
			"service": "hearing exam",
			"price": 30,
			"certification": false,
			"message": ""
		}
	]
	var copay_with_cert = [
		{
			"service": "physician hospital visit",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the visit first, by calling your insurer at " + pre_auth_phone_number + ", at least five business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "transgender surgery",
			// First price is always inpatient rate, second is outpatient rate.
			"price": [0, 250], 
			"certification" : true,
			"message": "Make sure you get certification and prior authorization for the surgery first, by calling your insurer at " + pre_auth_phone_number + ". Just FYI, the lifetime benefit maximum is $75,000 per person."	
		},
		{
			"service": "surgery",
			"price": 0, 
			"certification" : true,
			"message": "There's no copay as long as it's not a bariatric (weight-loss) surgery. Make sure you get certification for the surgery first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},		
		{
			"service": "anesthetics",
			"price": 0, 
			"certification" : true,
			"message": "There's no copay as long as it's not a bariatric (weight-loss) anesthetics. Make sure you get certification for the procedure first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before.. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "organ transplant",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the transplant first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "stem cell transplant",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the transplant first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "ambulance",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification as soon as your emergency is under control, by calling your insurer at " + pre_auth_phone_number + ", ideally within 48 hours after the event, or you might risk a $500 peanlty."	
		},
		{
			"service": "x ray",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the X-ray first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "lab procedure",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the lab procedure first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "habilitative service",
			"price": 30, 
			"certification" : true,
			"message": "Make sure you get certification for the service first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before.. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "radiation",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the radiation first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "ct imaging",
			"price": 50, 
			"certification" : true,
			"message": "Make sure you get certification for the service first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "spect imaging",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the service first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "mri imaging",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the service first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "muga imaging",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the service first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		},
		{
			"service": "pet imaging",
			"price": 0, 
			"certification" : true,
			"message": "Make sure you get certification for the service first, by calling your insurer at " + pre_auth_phone_number + ", at least 5 business days before. Otherwise you could be subject to a $500 penalty."	
		}
	]
	// Matching arg: "query" with the approrpriate copay procedure
	if (query){
		// Checking if query is mapped to coinsurance, route appropriately
		var coinsurance_services_keywords = ['bariatric surgery', 'bariatric anesthetics', 'weight loss surgery', 'weight-loss surgery', 'bariatric', 'weight-loss', 'weight loss'];
		for (var a = 0; a < coinsurance_services_keywords.length; a++){
			if (query.includes(coinsurance_services_keywords[a])){
				//if (coverage_Q_flag){
				return coinsurance(query, coverage_Q_flag);
					// coinsurance(query, coverage_Q_flag);
				//}
			}
		}
		// specific treatment copay query requested
		var found = false;
		var index;
		for (var i = 0; i < copay_with_cert.length; i++){
			var keywords = copay_with_cert[i].service.split(" ");
			var counter = 0;
			for (var j = 0; j < keywords.length; j++){
				if (query.includes(keywords[j])){
					counter++;
				}
			}
			if (counter === keywords.length){
				found = true;
				index = i;
				break;
			}
		}
		// Process services with different inpatient and outpatient prices
		var price_array = function (price){
				if (typeof(price) == "object"){
					return price[0] + " for inpatient care and $" + price[1] + " for outpatient care";
				} else {
					return price;
				}
			}
		if (found){ // If a w/ cert service is found in the database of services
			if (coverage_Q_flag){
				return coverage_Q_yes_message + "Your copay for " + copay_with_cert[index].service + " is $" + price_array(copay_with_cert[index].price) + ". " + copay_with_cert[index].message;
			} else {
				return "Your copay for " + copay_with_cert[index].service + " is $" + price_array(copay_with_cert[index].price) + ". " + copay_with_cert[index].message;
			}
		} else {
			for (var m = 0; m < copay_no_cert.length; m++){
				var keywords = copay_no_cert[m].service.split(" ");
				var counter = 0;
				for (var n = 0; n < keywords.length; n++){
					if (query.includes(keywords[n])){
						counter++;
					}
				}
				if (counter === keywords.length){
					found = true;
					index = m;
					break;
				}
			}
			if (found){ // if a no-cert service is found in database
				if (coverage_Q_flag){
					return coverage_Q_yes_message + "Your copay for " + copay_no_cert[index].service + " is $" + price_array(copay_no_cert[index].price) + ".";
				} else {
					return "Your copay for " + copay_no_cert[index].service + " is $" + price_array(copay_no_cert[index].price) + ".";
				}
			} else { // Two scenarios: 1. generate copay question, which should trigger random response; 2. coverage question and service was not found
				// general copay info requested by picking a random service from no_cert and with_cert categories
				// this is triggered when no service matched with query
				if (coverage_Q_flag){
					return coverage_Q_no_message;
				} else {
					var random_num1 = Math.floor(Math.random() * (copay_no_cert.length + 1));
					var random_num2 = Math.floor(Math.random() * (copay_with_cert.length + 1));
					return "Different services have different copay amounts. For example, some services like " + copay_no_cert[random_num1].service + " has a copay of $" + copay_no_cert[random_num1].price + 
						". \nOther procedures like " + copay_with_cert[random_num2].service + " has a copay of $" + 
						copay_with_cert[random_num2].price + ", but you need a certification from your insurer beforehand.";
				}
			}
		}
	} else { // if "query" param is undefined, doesn't exist...
	//TODO: rethink these responses...
		return "Sorry, your query is empty. Please enter a question that I can help you with.";

	}
};

exports.coinsurance = function(query, coverage_Q_flag){ //ASSESS: too rigid, just tailored to bariatric procedures, which only apply to cardinal care, not very generalizable yet. 
	var coverage_Q_yes_message = "Yes, this service is covered. ";
	var coverage_Q_no_message = "Unfortunatley, this service is not covered. "
	var keywords = ['bariatric surgery', 'bariatric anesthetics', 'weight loss surgery', 'weight-loss surgery', 'bariatric', 'weight-loss', 'weight loss'];
	for (var i = 0; i < keywords.length; i++){
		if (query.includes(keywords[i])){
			if (coverage_Q_flag){
				return coverage_Q_yes_message + "Your coinsurance (not copay) of a " + keywords[i] + " is 50 percent (not dollars) of the procedure. " + 
					"Make sure you get certification first, by calling your insurer at 1-800-977-7282, at least five business days before. Otherwise you could be subject to a $500 penalty. ";
			} else {
				return "Your coinsurance (not copay) of a " + keywords[i] + " is 50 percent (not dollars) of the procedure. " + 
					"Make sure you get certification first, by calling your insurer at 1-800-977-7282, at least five business days before. Otherwise you could be subject to a $500 penalty. ";
			}
		}
	}

	if (coverage_Q_flag){
		return coverage_Q_no_message;
	} else {
		return "Sorry, we could not find any coinsurance information related to your question. Maybe you were thinking about copay instead.";
	}
};

// ----------------------------------------------------------------
// Appeal/Dispute, Independent Medical Review, Arbitration Section
// ----------------------------------------------------------------
exports.appealInfo = function(email){
	var appeal_info = {
		"appeal_filing_period": 365, //in calendar days
		"claim_response_days": 15, //in calendar days
		"non_claim_response_days": 30, //in calendar days
		"phone_number": "1-800-250-5226",
		"website":  "www.healthnet.com/cardinalcare",
		"mail_addr": "Health Net Life Insurance Company\nCustomer Contact Center Appeals and Grievance Department\nP.O. Box 10348\nVan Nuys, CA 91410-0348",
		"mail_addr_html" : "<br><p>Health Net Life Insurance Company</p>" + 
							"<p>Customer Contact Center Appeals and Grievance Department</p>" +
							"<p>P.O. Box 10348</p>" +
							"<p>Van Nuys, CA 91410-0348</p>",
		"paper_form_link": "https://www.healthnet.com/static/member/unprotected/pdfs/ca/member_forms/mbr_grv_cmp071905english.pdf"
	}

	if (email){
		var html_appeal_info = "<p><strong>Appeal Process for Stanford Cardinal Care<strong></p>" +
								"<p>You can appeal any time where you thought the insurance company wrongly denied, reduced, terminated or failed to pay for services or claims.</p>" +
								"<p>There are 3 ways to file an appeal: </p>"+
								"<p>1. You call the insurance company at " + appeal_info.phone_number + " to explain your situation.</p>" +
								"<p>2. You go on the HealthNet website at " + appeal_info.website + " and fill out the appeal form online.</p>" +
								"<p>3. You can make an appeal in writing by mailing the appeal form to: "+ appeal_info.mail_addr_html + ".</p>" +
								"<p>You can find and print out the form here: " + appeal_info.paper_form_link + ".</p>" +
								"<p></p>" + 
								"<p>If your appeal is related to a claim denial, the insurance company must respond within " + appeal_info.claim_response_days  + " days.</p>"+
								"<p>If it's not related to a claim denial, they must respond within " + appeal_info.non_claim_response_days  + " days.</p>" +
								"<p>You have " + appeal_info.appeal_filing_period + " days from the day the claim in dispute happened to file an appeal.</p>";
		return html_appeal_info;
	} else {
		return appeal_info;
	}
};

exports.imrInfo = function(){
	var imr_info = {
		"state": "California", 
		"website": "http://www.insurance.ca.gov/01-consumers/101-help/Independent-Medical-Review-Program.cfm", 
		"phone_number": "1-800-927-4357",
		"application_form": "http://www.insurance.ca.gov/01-consumers/101-help/upload/CSD003IMR20150623_092616.pdf",
		"imr_trigger_period_days": 30, // unclear if business or calendar days 
		"non_urgent_response_days": 30, // unclear if business or calendar days
		"urgent_response_days": 3 // in business days
	};
	return imr_info;
};

exports.arbitrationInfo = function(){
	var arbitration_info = {
		"state": "California",
		"arb_demand_addr": "Health Net Life Insurance Company\nAttention: Litigation Administrator\nP.O. Box 4504\nWoodland Hills, CA 91356-4505"
	}
	return arbitration_info;
};


