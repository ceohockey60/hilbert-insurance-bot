"use strict";

//=========================================================
// Insurance 101 Module; Contains and exports information  
// related to key definitions, mechanisms, and terminologies
// to understand how a typical health insurance plan works.
// Sources: Hilbert Team, Consumer Reports, Nerdwallet
//=========================================================


// ---------------------------------
// General information on copay and coinsurance
// ---------------------------------
var copay_coinsurance_info_bank = [
	"A copay is a fixed amount or flat fee that you pay each time you visit a healthcare provider (e.g. $30 for specialist visits and $50 for emergency room visits).",
	"Once you have met your deductible, coinsurance comes into play. Coinsurance is a percentage of the total cost of eligible medical or prescription drug expenses that an insured person must pay (e.g. 20%, 40%, etc.)",
	"Copays do not count towards your deductible, but DO count towards your out-of-pocket maximum."
];
exports.copayCoinsuranceInfo = function(index){
	return copay_coinsurance_info_bank[index];
};

// ---------------------------------
// General information on deductible
// ---------------------------------
var deductible_oopm_info_bank = [
	"A deductible is the predetermined amount of money that you must pay out-of-pocket in a calendar year for doctor’s visits or health care services before your health insurance company begins to pay for care.",
	"An out-of-pocket maximum is the most you will be responsible to pay out-of-pocket for doctor’s visits and medical procedures in a year. After that, your insurance plan pays 100% of your medical cost.",
	"Sometimes there are overlaps between your deductible and your out-of-pocket maximum, and sometimes there are not. So it's best to check the specific terms of your plan to get the most out of your insurance."
];
exports.deductibleOOPMInfo = function(index){
	return deductible_oopm_info_bank[index];
};


// ---------------------------------------------------------------
// General information on In versus Out of Network differences related to insurance
// ---------------------------------------------------------------
var in_out_network_info_bank = [
	"In-network health care providers, including hospitals and doctors, have special contracts with your insurance company to accept discounted rates.",
	"Out-of-network providers are those who DO NOT have special agreements with your insurance companies to accept discounted rates.",
	"Because the difference in costs between In and Out-of-Network providers usually large, it's generally a good idea to buy health insurance and use In-Network providers to get affordable care."
];
exports.inOutNetworkInfo = function(index) {
	return in_out_network_info_bank[index];
};

