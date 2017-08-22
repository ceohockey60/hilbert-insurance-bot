"use strict";

//=========================================================
// This module abstracts away the list of preventative care
// services that are mandated by the Affordable Care Act 
// which every insurance plan must cover for free, in HTML
// so they can be emailed to any user.
//=========================================================


// List of Adult Preventative Care procedures in HTML form.
exports.emailAdultPrevCare = function(){
	return "<p><strong>Adult Preventative Care:</strong></p>" + 
				"<ul>" +
					"<li>Abdominal Aortic Aneurysm (This procedure is recommended if you are an adult who have smoked and is between the age of 65 and 75.)</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Alcohol Screening &amp; Counseling</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Aspirin Daily Use (Check with your doctor about taking aspirin daily if you are in your 50s, and are smoking or have high blood pressure, diabetes, or high cholesterol.)</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Blood Pressure Screening (If you are 40 or older, or have high risk of high blood pressure, it's recommended that you check your blood pressure annually. Otherwise, check it every 3 to 5 years.)</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Cholesterol Screening (You should get your cholesterol level checked if you are a man older than 35, a man between 20-35 with high risk of heart disease, or a woman older than 20 with high risk of heart disease.)</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Colorectal Cancer Screening (You should get this test if you are more than 50 years old.)</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Depression Screening</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Diabetes Screening (You should screen for diabetes if you have high blood pressure.)</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Diet Counseling</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Hepatitis B Screening</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Hepatitis C Screening</li>" +
				"</ul>" +
				"<ul>" +
					"<li>HIV Screening (It's always a good idea to get tested for HIV. You could have HIV and still feel fine.)</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Immunization Vaccines (There's a bunch of vaccines available, so ask your doctor to see which ones you should have. At the very least, get a flu shot every year.)</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Lung Cancer Screening (Lung cancer screening is especially necessary if you are 55 years or older with a history of smoking.)&nbsp;</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Obesity Screening &amp; Counseling (Make sure to check your Body Mass Index)" +
				"</ul>" +
				"<ul>" +
					"<li>STI Prevention Counseling</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Syphilis Screening&nbsp;</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Tobacco Use Screening</li>" +
				"</ul>" +
				"<ul>" +
					"<li>Bone Density Test (This is recommended if you are woman 50 years or older, or man 65 years or older.)</li>" +
				"</ul>";
};