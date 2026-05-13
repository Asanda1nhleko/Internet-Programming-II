MUT ICT SYSTEM
=====================

PROJECT DESCRIPTION
-------------------
This is a full-stack web application developed for the MUT ICT department.
It allows students to log in and access portal features connected to a MySQL database.

------------------------------------------------------------


TECHNOLOGIES USED
------------------
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL

------------------------------------------------------------

HOW TO RUN THE PROJECT
-----------------------

1. Install Node.js
Download from: https://nodejs.org

------------------------------------------------------------

2. Install Dependencies
Open terminal in project folder and run:

npm install

------------------------------------------------------------

3. Setup Database

Open MySQL Workbench and run:

CREATE DATABASE mut_portal;

Then import the SQL file located in:
/database/mut_portal.sql

------------------------------------------------------------

4. Configure Database

Open server.js and ensure:

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mut_portal"
});

------------------------------------------------------------

5. Run Server

node server.js

If successful, you will see:
Server running on http://localhost:3000

------------------------------------------------------------

6. Open Application

Open browser and go to:
http://localhost:3000

