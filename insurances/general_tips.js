"use strict";

//=========================================================
// General Tips Module; Contains and exports information  
// that can serve as tips and advice for patients to appeal
// a claim denial, negotiation medical bills, and the things 
// one should remember to do and be aware of before and after
// she receives care.
// Sources: Nerdwallet, Crowdsource
//=========================================================


// ------------------------------------
// Helper: getRandomInt(min, max)
// params: min = 0
// 		   max = length of array of tips bank
// -------------------------------------
function getRandomInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// -------------------------------------
// Tips for Insurance Appeal Process
// -------------------------------------
var appeal_tips_bank = [
	"Take time to gather all the supporting documents to maximize your success before filing an appeal. Don't rush things, even though I know it'd be stressful.",
	"Get your doctor on your side. Appeals rarely succeed if the doctor doesn't support your story. Make sure she writes a good letter supporting your appeal.",
	"Document everything when you talk to insurance company: date, person you talked to, method (email, phone, etc.), summary of your conversations.",
	"Some examples of supporting documents: your doctor's letter of support, positive medical results of the service you were denied, medical studies saying the service works.",
	"Ask your doctor to review the appeal letter you write to your insurance company, in case you made any mistakes describing your medical situation or treatment.",
	"Write a clear, concise letter stating your story and case. Don't use any legal words or other confusing terms. Be as simple and straightforward as possible.",
	"If the insurance rep is not helpful or delaying things, don't be afraid to go above him and talk to his superior. You have every right to do so."
];

var appeal_tips_cache = [];

exports.appealTips = function(){
	if (appeal_tips_bank.length == appeal_tips_cache.length){
		appeal_tips_cache = []; // If all tips have been shared, reset and share again.
	} 
	var index = getRandomInt(0, appeal_tips_bank.length);
	while (appeal_tips_cache.includes(index)){
		index = getRandomInt(0, appeal_tips_bank.length);
	}
	appeal_tips_cache.push(index);
	return appeal_tips_bank[index];
};

// ----------------------------------------------
// Tips for Before User Receives Medical Service 
// ----------------------------------------------
var pre_service_tips_bank = [
	"Always remember to get pre-authorization from your insurance before receiving care. Otherwise they can deny your claim.",
	"If you have time, compare cost before deciding on a doctor and procedure. Call 3-4 doctors to compare prices. Use my 'Estimate Cost' tool to get a reference.",
	"It's totally fine to negotiate price before you pick a doctor for a procedure. Use my 'Estimate Cost' tool to get a reference to help you negotiate.",
	"Always call your doctor to confirm she's in-network with your insurance before getting care. Sometimes doctors leave a network in the middle of a plan year!",
	"When in hospital, make sure all the specialists (radiologist, anesthesiologist, etc) are in-network with your insurance. Quite often, some are and others aren't!"
];

var pre_service_tips_cache = [];

exports.preServiceTips = function(){
	if (pre_service_tips_bank.length == pre_service_tips_cache.length){
		pre_service_tips_cache = []; // If all tips have been shared, reset and share again.
	} 
	var index = getRandomInt(0, pre_service_tips_bank.length);
	while (pre_service_tips_cache.includes(index)){
		index = getRandomInt(0, pre_service_tips_bank.length);
	}
	pre_service_tips_cache.push(index);
	return pre_service_tips_bank[index];

};

// -------------------------------------
// Tips for after receiving Medical Service including negotiation tips for bill reduction
// -------------------------------------
var post_service_tips_bank = [
	"Just remember, every medical bill is negotiable, just like buying a car or house. So don't be afraid to negotiate for a discount.",
	"Take time to understand the Evidence of Benefits (EOB). Ask for an itemized EOB if what you received was too broad so you could check if your doctor made any error when billing.",
	"If you have enough cash (either on hand or in your FSA/HSA account), offer to pay your doctor cash upfront for a discount. It usually works because doctors want to get paid quickly too!",
	"If you are confused about anything on your bill, don't be afraid to call your doctor and ask for answers. It's your right to know!",
	"If you are in financial hardship, ask your doctor for help. He can usually provide assistance with your medical bill, like a discount or interest-free monthly payment plan.",
	"When negotiating your medical bill cost, use my 'Estimate Cost' tool as a starting point for your negotiation.",
	"If your hospital bill was more than you expected and you will have a hard time paying, ask for financial assistance from the hospital.",
	"If you have trouble managing your medical bills or don't feel comfortable negotiating, enlist the help of a professional patient advocate.",
	"Doctors are people too. Sometime they make mistake when billing, which could cost you. So look at your bill closely, and don't be afraid to point out their mistakes."
];

	// Content:
		//  - Reminder of pre-authorization/certification before treatment
		//  - Everything is negotiable (give analogies: car, house, flea market)
		//  	- Talk to either Billing Dept or Patient Accounts managers (doctors dont wanna deal with this...)
		//      - Document every conversation/person/titles/call reference #s
		//  	- Be nice; express your situation; appeal to sympathy
		//  - Understand your EOB (dont get scared not a bill; issue spotting tips!)
		//      - request an itemized bill if not provided
		//      - call and ask to clarify the items if you don't understand
		//  - Use price reference as leverage (estimator average + Medicare rate)
		//  - Understand a procedures cost upfront, do comparision shopping (prompt Estimate Cost) before committing
		//  - Suggest Patient Advocate organizations (reminder: beware of hospital/insurance provided advocates, conflict of interest)
		//  - Look for financial assistance programs from hospitals	
		//  - Pay cash lump sum up front for a discount (using your own cash or $$ from FSA/HSA)
		//  - Ask to pay in regular, monthly installments (usually no interests)
var post_service_tips_cache = [];

exports.postServiceTips = function(){
	if (post_service_tips_bank.length == post_service_tips_cache.length){
		post_service_tips_cache = []; // If all tips have been shared, reset and share again.
	} 
	var index = getRandomInt(0, post_service_tips_bank.length);
	while (post_service_tips_cache.includes(index)){
		index = getRandomInt(0, post_service_tips_bank.length);
	}
	post_service_tips_cache.push(index);
	return post_service_tips_bank[index];
};

// -------------------------------------
// Tips for General Communication Tactics
// -------------------------------------
var communication_tips_bank = [
	"Document every conversation you have with your insurer (date, person's name, what you talked about, etc.) Have a record in case different people say different things.",
	"Take a deep breath and be calm before you call, especially if you are angry about your bill or a claim denial. You are right to be angry, but you have to be nice for people to help you.",
	"If customer service is not being helpful, don't be afraid to go above to their superior. Keep elevating the issue until you find someone willing to help.",
	"No matter how mad you are, always be nice, respectful, and share your worries and concerns. You need sympathetic ears who want to help you and be on your side.",
	"When talking to your doctor, use some strategic flattery to get him on your side. Things like: 'you are the best doc in town', 'all my friends recommended you', etc.",
	"When writing an appeal or statement, be as concise and straightforward as possible. I know you would likely be angry or stressed out, but rambling can make things worse for you."
];

var communication_tips_cache = [];

exports.communicationTips = function(){
	if (communication_tips_bank.length == communication_tips_cache.length){
		communication_tips_cache = []; // If all tips have been shared, reset and share again.
	} 
	var index = getRandomInt(0, communication_tips_bank.length);
	while (communication_tips_cache.includes(index)){
		index = getRandomInt(0, communication_tips_bank.length);
	}
	communication_tips_cache.push(index);
	return communication_tips_bank[index];
};


