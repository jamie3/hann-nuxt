# TODO

Things to do during the migration

- (Completed) Updated wix site to new referral page
- Close opened files on new migrates.
- Shut down AWS

# Bugs

- (Fixed) Session Date is wrong
- (Fixed) When we Resend the PDF Email it sends the thank you and the PDF. It should only send the PDF.
- Referral Form - Address entry is not working with Google Maps
- (Fixed) Create user doesnt show the Name
- (Fixed) Edit Referral (Date is not displaying the correct Date. Seems like a time zone conversion issue )
- (Fixed) Referral No. Not showing the primary key
- Drop down filters not working in prod but work in local (Status, Assigned To)
- The Migate Mysql script when fetching new referrals sets the status to open not new.
- Age at Referral is showing 0 years for https://clients.hannwellness.com/referrals/2538
- Referral PDF is missing address
- Fix this error Dec 24 13:18:23 2025-12-24 13:18:23 [[33mwarn[39m]: Unauthorized API access attempt {"service":"hann-nuxt","url":"/api/\_auth/session","sourceIp":""}

# New Features

- (Completed) Upload file
- (Completed) Expand all clinical notes in same view.
- (Completed) Remove Favicon
- (Completed) Updated Date - Retain the same date from old db
- (Completed) Create User
- (Completed) Edit User
- (Completed) Resend PDF Email
- (Completed) Create Referral - Store PDF in database
- (Completed) Store credit card
- (Completed) Assign referral to a person
- (Completed) Delete Clinical Note
- (Completed) Delete Referral
- (Completed) Add gender
- (Completed) Lock user after 5 failed attempts
- (Completed) Nicer Email templates
- (Completed) Embedded editing (Remove Edit Presenting Issues in Modal, move this to the Card)
- (Completed) Display full name in user drop down
- (Completed) Status: Archived in the drop down
- (Completed) Credit Card Encryption Key
- (Completed) Cloudflare Turnstile
- (Completed) Add cloud flare infront of the application
- (Completed) Add website to PDF footer
- (Completed) View / Edit Profile
- (Completed) Add google maps address support
- (Completed) Multi-select and close many referrals
- (Completed) Archive referral
- (Completed) Add Google Maps to Edit Referral
- (In Progress) History of emails sent
- Whitelist cloudflare IPs
- Track open / closes (see existing DB)
- Print all the Clinical Notes in PDF a cronilogical order
- When clicking "View Referral" in email and not logged in it should have a redirectTo url
- Format phone number
- Format Postal Code
- Disable User
- Forgot password
- Change password on login
- User Roles
- Dark Mode
- Referrals page make the drop downs more colourful (eg. badges, icons)

Nice to Have

- Read receipts webhooks
- Clinical Notes - WYSYWIG editor
- On the Files page add the Last name, First name
- On the referral page add the emails that were sent

# Shutdown Resources

clients -> hann-web-lb-6253567.ca-central-1.elb.amazonaws.com

DELETE

hann-client.pages.dev

DELETE auth0
