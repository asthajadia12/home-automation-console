# home-automation-console
Home Automation. System to remotely control devices at home. Set of RESTful APIs to control the smart devices remotely.

# Minimum Requirement
- Nodejs v10.0.0 
- Postgres 10

# Steps to run project
- Create DB and relation table based on queries below in '#Enrich DB'
- Go to workspace home directory
- create .env
- run `npm i`
- node index.js

# API DOC 
https://documenter.getpostman.com/view/2177173/SzmY8gZo

#Enrich DB
```
CREATE USER db_user WITH PASSWORD '<PASSWORD>';

CREATE DATABASE home_automation OWNER db_user;

CREATE TABLE devices (
	device_id serial PRIMARY KEY,
	device_name varchar (500) NOT NULL,
	serial_number varchar(500) NOT NULL UNIQUE,
	device_type varchar (500) NOT NULL,
	device_state varchar (500) NOT NULL,
	is_active BOOLEAN NOT NULL,
	created_on TIMESTAMP NOT NULL
);
```

#sample .env
```
	ENV
	NODE_ENV=development
	PORT=4700

	PGUSER=postgres
	PGHOST=localhost
	PGDATABASE=home_automation
	PGPASSWORD=admin123 
	PGPORT=5432
	#PGMAXCONNECTION
	#PGIDLETIMEOUT
	#PGCONNECTIONTIMEOUT
```