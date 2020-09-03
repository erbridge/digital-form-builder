Feature: uk-passport-flow

  Ensures the page flow is correct

  Scenario: Ensure 'Do you have a UK passport?' is the default page
    Given form is loaded 'test'
     Then page loaded is "Do you have a UK passport?"

  Scenario: If 'Yes' is chosen then 'How many applicants are there?' is the next page
    Given form is loaded 'test/uk-passport'
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'submit' is pressed
    Then page loaded is "How many applicants are there?"

  Scenario: If 'No' is chosen then 'You're not eligible for this service' is the next page
    Given form is loaded 'test/uk-passport'
    When YesNoField 'ukPassport' is 'No'
    And  Button 'submit' is pressed
    Then page loaded is "You're not eligible for this service"

  Scenario: If applicant numbers are submitted then 'Applicant' is the next page
    Given form is loaded 'test/uk-passport'
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'submit' is pressed
    And page loaded is "How many applicants are there?"
    And SelectField 'numberOfApplicants' is '1'
    And Button 'submit' is pressed
    Then page loaded is "Applicant"

  Scenario: If applicant details are submitted then 'Address' is the next page
    Given form is loaded 'test/uk-passport'
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'submit' is pressed
    And page loaded is "How many applicants are there?"
    And SelectField 'numberOfApplicants' is '1'
    And Button 'submit' is pressed
    And page loaded is "Applicant"
    And TextField 'firstName' is 'Dean'
    And TextField 'lastName' is 'Miley'
    And Button 'submit' is pressed
    Then page loaded is "Address"

  Scenario: If address details are submitted then 'Applicant contact details' is the next page
    Given form is loaded 'test/uk-passport'
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'submit' is pressed
    And page loaded is "How many applicants are there?"
    And SelectField 'numberOfApplicants' is '1'
    And Button 'submit' is pressed
    And page loaded is "Applicant"
    And TextField 'firstName' is 'Dean'
    And TextField 'lastName' is 'Miley'
    And Button 'submit' is pressed
    And page loaded is "Address"
    And TextField 'address__addressLine1' is '3 Dumbreeze Grove'
    And TextField 'address__addressLine2' is 'Knowsley Village'
    And TextField 'address__town' is 'Prescot'
    And TextField 'address__postcode' is 'L34 8HW'
    And Button 'submit' is pressed
    Then page loaded is "Applicant contact details"


  Scenario: If applicant contact details are submitted then 'Summary' is the next page
    Given form is loaded 'test/uk-passport'
    When YesNoField 'ukPassport' is 'Yes'
    And  Button 'submit' is pressed
    And page loaded is "How many applicants are there?"
    And SelectField 'numberOfApplicants' is '1'
    And Button 'submit' is pressed
    And page loaded is "Applicant"
    And TextField 'firstName' is 'Dean'
    And TextField 'lastName' is 'Miley'
    And Button 'submit' is pressed
    And page loaded is "Address"
    And TextField 'address__addressLine1' is '3 Dumbreeze Grove'
    And TextField 'address__addressLine2' is 'Knowsley Village'
    And TextField 'address__town' is 'Prescot'
    And TextField 'address__postcode' is 'L34 8HW'
    And Button 'submit' is pressed
    And page loaded is "Applicant contact details"
    And TextField 'phoneNumber' is '01515482487'
    And TextField 'emailAddress' is 'dean.miley@gmail.com'
    And Button 'submit' is pressed
    Then page loaded is "Summary"


