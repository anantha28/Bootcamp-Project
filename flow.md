-----------------------------APIs addition to codebase Flow:-----------------------------

1) Go to an link, to configure the feedback form
    -add the structure of the feedback form...like how many text fields? star rating needed? comments needed? etc..
        -->See how Google forms are created for this.
    -Get webpage link where the form should appear?
    -Configure how often then User must receive the fedback from?(like every 90days or 30days)

2) Make POST API call when a button is clicked
    - CurrentUser details to be passed.
--> How to get current user details on our own?
--> How to track the page from where the API call was made?

3) Check in DB if the user has already received feedback in the last 90days or the configured days
    - If yes, don't trigger the feedback form....No updation needed in DB.
    - If no, trigger the feedback form...Update current date in DB

4) Dashboard UI and functionalities.
5) Expose APIs for external use.

----------------------------------------------------------------
Qns:
-- Plugin with 3rd party apps (or) APIs addition to codebase of VMware products.
-- Tech Stack
-- DB Schema
-- Who can access the dashboard?

----------------------------------------------------------------
Setup:
-- Github or Gitlab?
-- DB and final API hosting?

----------------------------------------------------------------

-- Collision in API call(existing product API and our feedback form API)
    -- Call Product API and simultaneously call feedabck API
    -- Call feedback API 1st then call the product API(disadv: slowing down the actual product execution)
    -- Call feeback API at the end, after execution of product API.

-- How to display our feedback form over background process using API call?
