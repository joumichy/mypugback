# mypugback

The backend is made with node
need to run "npm install" for install all the package and "npm start" for launching it, check package json for more info.
Server build with express framework, need an .env file with :

- PORT
- JWTSECRET
- DBURL
- STRIPE_SECRET_KEY
JWT has to be generated for encryption.

Architecture is monolith, each files in folder are made for a specific API call in src/app/:
- src/models folder contain every entity model for mongodb
- src/repository folder contain every query for mongodb with monk framework


