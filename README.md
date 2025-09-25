# Cognito Username/Password Auth Prototype

This repo contains a prototype username and password signup field which when configured with AWS Cognito, allows users to sign up for a user account which is stored in a Cognito user pool.

The user can then also use /login to login into their created account.

This used v0 to create the frontend of the form and aws-sdk to provide the Cognito methods required to signup and authenticate the user at login.

To run this, add your cognito credentials to a .env file and then run `npm run dev` to run this locally.