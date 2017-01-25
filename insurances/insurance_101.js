"use strict";

//=========================================================
// Insurance 101 Module; Contains and exports information  
// related to key definitions, mechanisms, and terminologies
// to understand how a typical health insurance plan works.
// Sources: Consumer Reports, Nerdwallet
//=========================================================

// ---------------------------------
// General information on copay and coinsurance
// ---------------------------------
var copay_coinsurance_info_bank = [
	"copay1",
	"copay2",
	"copay3"
];
exports.copayCoinsuranceInfo = function(index){
	return copay_coinsurance_info_bank[index];
};

// ---------------------------------
// General information on deductible
// ---------------------------------
var deductible_info_bank = [
	"",
	"",
	""
];
exports.deductibleInfo = function(index){
	return deductible_info_bank[index];
};

// ---------------------------------
// General information on Out-of-Pocket Maximum
// ---------------------------------
var oopm_info_bank = [
	"",
	"Obamacare limit $6,850 per individual, $13,700 per family. Cannot exceed!",
	""
];
exports.oopmInfo = function(index){
	return oopm_info_bank[index];
};

// ---------------------------------
// General information on the Insurance Business
// ---------------------------------
var insurance_biz_info_bank = [
	"",
	"",
	""
];
exports.insuranceBizInfo = function(index){
	return insurance_biz_info_bank[index];
};

// ---------------------------------------------------------------
// General information on Important Key Terms related to insurance
// ---------------------------------------------------------------
var key_terms_info_bank = [
	"Medically Necessary",
	"Pre-Authorization",
	""
];
exports.keyTermsInfo = function(index) {
	return key_terms_info_bank[index];
};

