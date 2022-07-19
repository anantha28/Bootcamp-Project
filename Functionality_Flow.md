-----------------------------Project Functionality and Flow:-----------------------------

1) Admin can go to an webpage, to configure the feedback form:
    -Admin has to login (or) SignUp if using the webpage for 1st time.
    -Admin can add the structure of the feedback form, like how many text fields? star rating needed? comments needed? etc..
    -Admin enters the webpage link where the form should appear.
    -Configure how often then User must receive the fedback form?(like every 90days or 30days)
    -Finally admin is provided with API link which can be added in the product code base to trigger the feedback form.
    
2) User will be triggered with feeback form:
    -CurrentUser details to be found out
    -User can fill the feedback form or not fill it.
    2.1) Check in DB if the user has already received feedback in the last 90days or the configured days
        - If yes, don't trigger the feedback form....No updation needed in DB.
        - If no, trigger the feedback form...Update current date in DB

3) Feedback Form Metrics:
    -User specific responses are stored.
    -Number of times the form was filled and numbers of times form was triggered is stored.
    -Event which triggered the feedback form is stored in DB

4) Dashboard:
    -Feedback form metrics are shown to the admin.

5) APIs are exposed for exporting the feedbacks given by users.

----------------------------------------------------------------------------------------------
Tech Stack:
1) Frontend: Angular with Clarity UI (Shahab, Manideep)
2) Backend: Node, Express, MongoDB (Anantha, Kushagra)
----------------------------------------------------------------------------------------------
UI pages:
1) Login/SignUp page for admin 
2) Admin Dashboard
3) Feedback Form
----------------------------------------------------------------------------------------------
API Details:

Admin Login/SignUp:
    -- POST API:
        --To handle Admin login/SignUp.

Configuration form:
    -- POST API: 
        --To handle number of input fields, url where form should show up, API link. 

User Specific Info.
    -- POST API:
        -- To store feedback form responses.

    -- GET API:
        --To list last time feedback form was submitted 
        --To list responses submitted by the user

    -- store userID, last form submitted date, last form showup date, form_submitted_counter, counter_form_showup 
    -->derive response rate

Dashboard(Only Admin can access it)
    -- GET API:
        --To list user_specific info., prod. specific feedabck response.

----------------------------------------------------------------------------------------------
Questions about the project:
1) How to access user details who is logged in to the website?
2) How to handle API collision?
3) Functionalities of the APIs that are to be used for external use?
----------------------------------------------------------------------------------------------