var mysql = require("mysql");
var config = require("./config.json");

var connection = mysql.createConnection({
  host: "localhost",
  user: config.username,
  password: config.password,
});

connection.connect();

// connection.query(
//   `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dupa123'`,
//   function (err) {
//     if (err) throw err;
//     console.log("alter user root@localhost");
//   }
// );


connection.query(
  "DROP DATABASE IF EXISTS `door_access_system`;",
  function (err) {
    if (err) throw err;
    console.log("Cleared previous schema.");
  }
);

connection.query(
  "CREATE SCHEMA IF NOT EXISTS `door_access_system` DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;",
  function (err) {
    if (err) throw err;
    console.log("Scheme door_access_system successfully created.");
  }
);

connection.query("USE door_access_system;", function (err) {
  if (err) throw err;
  console.log("Scheme door_access_system successfully created.");
});


//-----------------------------------------------------------------------------------------------------

connection.query(
  "CREATE TABLE IF NOT EXISTS `users` ( `email` VARCHAR(30) NOT NULL, `password` VARCHAR(30) NOT NULL, PRIMARY KEY (`email`)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8 COLLATE = utf8_polish_ci;",
  function (err) {
    if (err) throw err;
    console.log("User data table has been created.");
  }
);

connection.query(
  'insert ignore into users (email, password) values ("email@email.com", "password")',
  function (err) {
    if (err) throw err;
    console.log("user data #1 added");
  }
);

connection.query(
  'insert ignore into users (email, password) values ("test@gmail.com", "1234");',
  function (err) {
    if (err) throw err;
    console.log("user data #2 added.");
  }
);

//-----------------------------------------------------------------------------------------------------

connection.query(
  "CREATE TABLE IF NOT EXISTS  `door_access_system`.`doors` (`lockID` VARCHAR(45) NOT NULL, `door_name` VARCHAR(30) NOT NULL, `isOpen` BOOLEAN NOT NULL DEFAULT FALSE,PRIMARY KEY (`lockID`)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8 COLLATE = utf8_polish_ci;",
  function (err) {
    if (err) throw err;
    console.log("Doors data table has been created.");
  }
);

connection.query(
  'insert ignore into doors (lockID, door_name) values ("192.1.200.15", "serwerownia");',
  function (err) {
    if (err) throw err;
    console.log("door data #1 added");
  }
);

connection.query(
  'insert ignore into doors (lockID, door_name) values ("192.1.200.16", "biuro");',
  function (err) {
    if (err) throw err;
    console.log("door data #2 added");
  }
);

connection.query(
  'insert ignore into doors (lockID, door_name) values ("192.1.200.17", "pracownia");',
  function (err) {
    if (err) throw err;
    console.log("door data #3 added");
  }
);

connection.query(
  'insert ignore into doors (lockID, door_name) values ("200.200.150.1", "pracownia 2");',
  function (err) {
    if (err) throw err;
    console.log("door data #4 added.");
  }
);

//-----------------------------------------------------------------------------------------------------

connection.query(
  "CREATE TABLE IF NOT EXISTS `door_access_system`.`permissions` (`lockID` VARCHAR(45) NOT NULL,`email` VARCHAR(45) NOT NULL, PRIMARY KEY(`lockID`, `email`), CONSTRAINT `FK_lockID` FOREIGN KEY (`lockID`) REFERENCES `door_access_system`.`doors` (`lockID`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `FK_email` FOREIGN KEY (`email`) REFERENCES `door_access_system`.`users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8 COLLATE = utf8_polish_ci;",
  function (err) {
    if (err) throw err;
    console.log("Doors data table has been created.");
  }
);

connection.query(
  'insert ignore into permissions (lockID, email) values ("192.1.200.15", "email@email.com");',
  function (err) {
    if (err) throw err;
    console.log("permission data #1 added");
  }
);

connection.query(
  'insert ignore into permissions (lockID, email) values ("192.1.200.15", "test@gmail.com");',
  function (err) {
    if (err) throw err;
    console.log("permission data #2 added.");
  }
);

connection.query(
  'insert ignore into permissions (lockID, email) values ("192.1.200.16", "test@gmail.com");',
  function (err) {
    if (err) throw err;
    console.log("permission data #3 added.");
  }
);

connection.query(
  'insert ignore into permissions (lockID, email) values ("192.1.200.17", "test@gmail.com");',
  function (err) {
    if (err) throw err;
    console.log("permission data #4 added.");
  }
);

//-----------------------------------------------------------------------------------------------------

connection.query(
  "CREATE TABLE IF NOT EXISTS `door_access_system`.`admins` (`login` VARCHAR(30) NOT NULL, `password` VARCHAR(45) NOT NULL, PRIMARY KEY (`login`)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8 COLLATE = utf8_polish_ci; ",
  function (err) {
    if (err) throw err;
    console.log("Admins data table has been created.");
  }
);

connection.query(
  'insert ignore into admins(login, password) values("admin", "admin");',
  function (err) {
    if (err) throw err;
    console.log("admin data #1 added.");
  }
);

connection.query(
  'insert ignore into admins(login, password) values("root", "root");',
  function (err) {
    if (err) throw err;
    console.log("admin data #2 added.");
  }
);

connection.end();
