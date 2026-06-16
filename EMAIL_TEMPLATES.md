This describes the Email Templates and Generator feature:

- The system shall support the ability to create custom email templates.
- The templates shall be stored in the database
- An administrator shall be able to create / edit / delete the templates.
- Deleting a template should be a soft delete.
- The email templates shall support the ability to use variables. These variables {{ referral.first_name }} would map to the referral.first_name table. When previewing the template the system shall replace the

Generating Emails

- From the client page a user shall be able to select from a list of email templates and generate an email to send to the client.
- When generating the email it shall provide a pop-up showing a preview of what the email looks like.
- Once reviewed the user can save the email as a draft, send immediately, or schedule for delivery later
- The email will sent to the email on file, or can be overriden from the modal.
- All emails shall be stored in the database with their status. Draft emails are considered unsent.

Email Tracking

- On the email tracking page we should be able to filter by the status

Referral Page

- On the referral page we should be able to view the email activity for a referral
