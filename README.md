# Treasure Hunt
## A fully functional project written in Javascript (Angular.JS) and Node.JS with a MySQL database that is a simple game of chance
## Watch the following video that show cases what this project does
[![Treasure Hunt Example Video](https://img.youtube.com/vi/J3y_GAf4KXc/0.jpg)](https://www.youtube.com/watch?v=J3y_GAf4KXc)

## How to install this project

1. [Make sure Node.js and npm are installed](https://nodejs.org/en/download)
2. [Make sure MySQL is installed](https://dev.mysql.com/downloads/)
3. Run the following command in a termimal pointing to a desired folder `git clone https://github.com/floyko/TreasureHuntFull.git` - After cloning is complete you can close the terminal
4. In one terminal change to TreasureHunt folder and run `npm ci`
5. In a second terminal change to TreasureHuntBackend folder and run `npm ci`
6. In a third terminal change to TreasureHuntBackend folder and run MySQL
   - Once MySQL is running type `source createDB.sql` to create the database
7. In the second terminal run `npm start`
8. In the first terminal run `npm start`

In the first terminal click the link that will open a new browser tab with the game. See example of terminal below!

![After npm start](https://github.com/user-attachments/assets/ef8055c7-64d1-44d0-bed3-9b477db8d034)

**Please note you may need to change the [config.json](/TreasureHuntBackend/config/config.json) file in [TreasureHuntBackend](/TreasureHuntBackend/) to match your MySQL and database access rights.**
