Feature: uk-passport-flow

  Ensures the page flow of the uk-passport form is correct

  Scenario: Ensure 'Do you have a UK passport?' is the default page
    Given Form 'test' is loaded
    Then Page "Do you have a UK passport?" is loaded

  Scenario: If 'Yes' is chosen then 'How many applicants are there?' is the next page
    Given Form 'test/uk-passport' is loaded
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'Continue' is clicked
    Then Page "How many applicants are there?" is loaded

  Scenario: If 'No' is chosen then 'You're not eligible for this service' is the next page
    Given Form 'test/uk-passport' is loaded
    When YesNoField 'ukPassport' is 'No'
    And  Button 'Continue' is clicked
    Then Page "You're not eligible for this service" is loaded

  Scenario: If applicant numbers are submitted then 'Applicant' is the next page
    Given Form 'test/uk-passport' is loaded
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'Continue' is clicked
    And Page "How many applicants are there?" is loaded
    And SelectField 'How many applicants are there?' is '1'
    And Button 'Continue' is clicked
    Then Page "Applicant" is loaded

  Scenario: If applicant details are submitted then 'Address' is the next page
    Given Form 'test/uk-passport' is loaded
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'Continue' is clicked
    And Page "How many applicants are there?" is loaded
    And SelectField 'How many applicants are there?' is '1'
    And Button 'Continue' is clicked
    And Page "Applicant" is loaded
    And TextField 'First name' is 'Dean'
    And TextField 'Surname' is 'Miley'
    And Button 'Continue' is clicked
    Then Page "Address" is loaded

  Scenario: If address details are submitted then 'Applicant contact details' is the next page
    Given Form 'test/uk-passport' is loaded
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'Continue' is clicked
    And Page "How many applicants are there?" is loaded
    And SelectField 'How many applicants are there?' is '1'
    And Button 'Continue' is clicked
    And Page "Applicant" is loaded
    And TextField 'First name' is 'Dean'
    And TextField 'Surname' is 'Miley'
    And Button 'Continue' is clicked
    And Page "Address" is loaded
    And UkAddressField 'Address line 1' is '3 Dumbreeze Grove'
    And UkAddressField 'Address line 2 (Optional)' is 'Knowsley Village'
    And UkAddressField 'Town or city' is 'Prescot'
    And UkAddressField 'Postcode' is 'L34 8HW'
    And Button 'Continue' is clicked
    Then Page "Applicant contact details" is loaded


  Scenario: If applicant contact details are submitted then 'Summary' is the next page
    Given Form 'test/uk-passport' is loaded
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'Continue' is clicked
    And Page "How many applicants are there?" is loaded
    And SelectField 'How many applicants are there?' is '1'
    And Button 'Continue' is clicked
    And Page "Applicant" is loaded
    And TextField 'First name' is 'Dean'
    And TextField 'Surname' is 'Miley'
    And Button 'Continue' is clicked
    And Page "Address" is loaded
    And UkAddressField 'Address line 1' is '3 Dumbreeze Grove'
    And UkAddressField 'Address line 2 (Optional)' is 'Knowsley Village'
    And UkAddressField 'Town or city' is 'Prescot'
    And UkAddressField 'Postcode' is 'L34 8HW'
    And Button 'Continue' is clicked
    And Page "Applicant contact details" is loaded
    And TelephoneNumberField 'Phone number' is '01515482487'
    And EmailAddressField 'Your email address' is 'dean.miley@gmail.com'
    And Button 'Continue' is clicked
    Then Page "Summary" is loaded

  Scenario: If 'Summary' is submitted then 'undefined - GOV.UK' is the next page
    Given Form 'test/uk-passport' is loaded
    When YesNoField 'ukPassport' is 'Yes'
    And Button 'Continue' is clicked
    And Page "How many applicants are there?" is loaded
    And SelectField 'How many applicants are there?' is '1'
    And Button 'Continue' is clicked
    And Page "Applicant" is loaded
    And TextField 'First name' is 'Dean'
    And TextField 'Surname' is 'Miley'
    And Button 'Continue' is clicked
    And Page "Address" is loaded
    And UkAddressField 'Address line 1' is '3 Dumbreeze Grove'
    And UkAddressField 'Address line 2 (Optional)' is 'Knowsley Village'
    And UkAddressField 'Town or city' is 'Prescot'
    And UkAddressField 'Postcode' is 'L34 8HW'
    And Button 'Continue' is clicked
    And Page "Applicant contact details" is loaded
    And TelephoneNumberField 'Phone number' is '01515482487'
    And EmailAddressField 'Your email address' is 'dean.miley@gmail.com'
    And Button 'Continue' is clicked
    And Page "Summary" is loaded
    And CheckboxesField 'Confirm' is 'Checked'
    And Button 'Submit' is clicked
    Then Page "undefined - GOV.UK" is loaded

  Scenario: If 'Summary' is submitted then a reference is returned
    Given Form 'test/uk-passport' is loaded
    When YesNoField 'ukPassport' is 'Yes'
    And Button 'Continue' is clicked
    And Page "How many applicants are there?" is loaded
    And SelectField 'How many applicants are there?' is '1'
    And Button 'Continue' is clicked
    And Page "Applicant" is loaded
    And TextField 'First name' is 'Dean'
    And TextField 'Surname' is 'Miley'
    And Button 'Continue' is clicked
    And Page "Address" is loaded
    And UkAddressField 'Address line 1' is '3 Dumbreeze Grove'
    And UkAddressField 'Address line 2 (Optional)' is 'Knowsley Village'
    And UkAddressField 'Town or city' is 'Prescot'
    And UkAddressField 'Postcode' is 'L34 8HW'
    And Button 'Continue' is clicked
    And Page "Applicant contact details" is loaded
    And TelephoneNumberField 'Phone number' is '01515482487'
    And EmailAddressField 'Your email address' is 'dean.miley@gmail.com'
    And Button 'Continue' is clicked
    And Page "Summary" is loaded
    And CheckboxesField 'Confirm' is 'Checked'
    And Button 'Submit' is clicked
    Then Page "undefined - GOV.UK" is loaded