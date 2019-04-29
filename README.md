README

This README would normally document whatever steps are necessary to get your application up and running.
What is this repository for?

    Quick summary The repository is for TankstelleAPP
    Version No version
    Learn Markdown

How do I set up?

    Summary of set up You have to download npm and nodejs last version from the online sources. After downloading, open a command line and navigate to the project folder. First of all, type "npm install" and then "npm start".
    Configuration Test the npm with the following command in windows command line "npm --version" Test nodejs version with the following command "node --version"
    Dependencies npm, nodejs and node modules
    Database configuration You need to install mysql database in your local or remote path. After creating mysql server, please create a user with the following command named tankkoenig mysql> "CREATE USER 'tankkoenig'@'localhost' IDENTIFIED BY 'password'" mysql> "GRANT ALL PRIVILEGES ON . TO 'tankkoenig'@'localhost' WITH GRANT OPTION"; mysql> "CREATE USER 'tankkoenig'@'%' IDENTIFIED BY 'password'"; mysql> "GRANT ALL PRIVILEGES ON . TO 'tankkoenig'@'%' WITH GRANT OPTION;"
    How to run tests No test yet
    Deployment instructions
	
Brief Overview on the Project

	This is a project that uses an API the so-called tankerkönig API to provide gas prices regarding oil station to the end user and drivers.
	
![Web App](https://github.com/zointblackbriar/TankstelleApplication/blob/master/presentation_images/Web_App_Mouse_Circle.PNG)
	
	As you can see in the Figure above, a user can draw a circle without giving a location data to the system. Hence, the Tankstelle application can 
	show result in the perimeter. Due to the limitation over the calls of API, a user should be aware of the usage of the limitation of circles. Each
	circle sends a unique REST call to fetch data from the Tankstelle API by means of Node.js back-end application.
	
![Database Preview](https://github.com/zointblackbriar/TankstelleApplication/blob/master/presentation_images/Database_Preview.PNG)

	We have used relational database with a primary key parameter which named ID. Each ID has a unique E5, E10, DIESEL, and DATE column in order to
	calculate mean prices and do some data analysis. This database has been located in an Unix-based operating system.
	
![Database Plan](https://github.com/zointblackbriar/TankstelleApplication/blob/master/presentation_images/Database_Plan.PNG)

	We have simplified the database design so that the REST call of application has been became simple.
	
![Android Preview](https://github.com/zointblackbriar/TankstelleApplication/blob/master/presentation_images/Android_Sample_Screen.PNG)

	As you can see in the bottom Figure, the Android application can show the result in a viewer with Google Maps API.

Contribution guidelines

    Writing tests
    Code review
    Other guidelines
