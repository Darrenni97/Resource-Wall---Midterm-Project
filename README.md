pin-mint, a Resource Wall Project

pin-mint is a resource wall for pinning resources from the internet in one easy to view place. Users can create an account to make their own pins, like other pins, rate pins and comment on them.


This project uses HTML, CSS, SASS, JS, jQuery and AJAX for front-end, and then Node, Express, PostgreSQL and multiple back-end dependencies.
=========

## Final Product

Screenshot 1
"Description" ![](ImageURLHERE)

Screenshot 2
"Description" ![](ImageURLHERE)

Screenshot 3
"Description" ![](ImageURLHERE)

Screenshot 4
"Description" ![](ImageURLHERE)




## Getting Started


1. Fork this repository, then clone your fork of this repository.
2. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
3. Install dependencies using the npm install comand.
4. Within your Vagrant, set up the data base by entering the command `psql -U vagrant -d template1`
5. Run the following command to create the data base 
`CREATE ROLE labber WITH LOGIN password 'labber'; CREATE DATABASE midterm OWNER labber;`
6. Run a database reset to move seed information into the database. (`npm run db:reset`)
7. Start the web server using the npm run local command.
8. Go to http://localhost:8080/ in your browser to visit the site.


## Dependencies


- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- bcrypt 3.0.6 or above
- body-parser 1.19.0 or above
- chalk 2.4.2 or above
- Cookie Session 1.3.3 or above
- dotenv 2.0.0 or above
- ejs 2.6.2 or above
- express 4.17.1 or above
- morgan 1.9.1 or above
- Node-sass 0.11.0 or above
- PG Native 3.0.0 or above
