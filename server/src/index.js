const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
var config = require("./config.json");

const app = express();
app.use(cors());

var isLoggedIn = false;

var users = [];
var doors = [];
var permissions = [];

const lockFunction = {
  OPEN: "open",
  CLOSE: "close",
  QUICK_OPEN: "quick_open",
  NOTHING: "nothing",
};
var currentFunction = lockFunction.NOTHING;

class User {
  constructor(email, pass) {
    this.email = email;
    this.password = pass;
  }
}
class Door {
  constructor(lockID, doorName, isOpen) {
    this.lockID = lockID;
    this.doorName = doorName;
    this.isOpen = isOpen;
  }
}

var server = app.listen(4000, function () {
  console.log("Server is open on port 4000");
});

var io = socket(server);

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: config.username,
  password: config.password,
  database: "door_access_system",
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("isLoggedIn", (data) => {
    socket.emit("isLoggedInResponse", { isLoggedIn: isLoggedIn });
  });

  socket.on("adminLoginRequest", (data) => {
    console.log("Admin Login Request: ");
    console.log(data);
    let adminLoginQuery =
      'SELECT * from admins WHERE login="' +
      data.userName +
      '" AND password = "' +
      data.password +
      '";';
    var response = false;
    connection.query(adminLoginQuery, function (error, results, field) {
      if (error) {
        throw error;
      }
      if (results.length > 0) {
        isLoggedIn = true;
        response = true;
      }
      socket.emit("adminLoginResponse", { response: response });
    });
  });

  socket.on("loginRequest", (data) => {
    var loginQuery =
      'SELECT * from door_access_system.users WHERE email = "' +
      data.email +
      '" AND password = "' +
      data.password +
      '"';
    connection.query(loginQuery, function (error, result, field) {
      if (error) {
        console.log(
          "Login user email =" +
            data.email +
            " with password =" +
            data.password +
            ": failed"
        );
        socket.emit("loginRequestRes", false);
        throw error;
      }
      if (result.length > 0) {
        console.log(
          "Login user email=" +
            data.email +
            " with password=" +
            data.password +
            ": success"
        );
        socket.emit("loginRequestRes", true);
      } else {
        console.log(
          "Login user email=" +
            data.email +
            " with password=" +
            data.password +
            ": failed"
        );
        socket.emit("loginRequestRes", false);
      }
    });
  });

  socket.on("requestUsers", function () {
    users = [];
    connection.query("SELECT * from users", function (error, results, fields) {
      if (error) throw error;
      for (const row of results) {
        users.push(new User(row.email, row.password));
      }
      console.log(users);
      console.log("users requested");
      socket.emit("users", users);
    });
  });

  socket.on("addUser", (data) => {
    var addQuery =
      'insert ignore into users (email, password) values ("' +
      data.email +
      '", "' +
      data.password +
      '");';
    connection.query(addQuery, function (err, result, fields) {
      if (err) {
        console.log(
          "Added user:" +
            data.email +
            " with password: " +
            data.password +
            " : failed"
        );
        socket.emit("addUserRes", {
          email: data.email,
          error: "false",
          password: data.password,
        });
        throw err;
      } else {
        console.log(
          "Added user:" +
            data.email +
            " with password: " +
            data.password +
            " : success"
        );
        socket.emit("addUserRes", {
          email: data.email,
          error: "true",
          password: data.password,
        });
        users.push(new User(data.email, data.password));
      }
    });
  });

  socket.on("deleteUser", (data) => {
    var deleteQuery = 'DELETE from users where email = "' + data.email + '";';

    connection.query(deleteQuery, function (err, result, fields) {
      if (err) {
        console.log("Deleted user:" + data.email + " : failed");
        socket.emit("deleteUserRes", { email: data.email, error: "false" });
        throw err;
      } else {
        console.log("Deleted user:" + data.email + " : success");
        socket.emit("deleteUserRes", { email: data.email, error: "true" });
        for (var i = 0; i < users.length; i++) {
          if (users[i].email == data.email) {
            users.splice(i, 1);
            break;
          }
        }
      }
    });
  });

  socket.on("doorList", (data) => {
    var doorListQuery = "SELECT * from doors";

    connection.query(doorListQuery, function (err, result, fields) {
      if (err) {
        throw err;
      } else {
        var doorsList = [];
        for (const row of result) {
          console.log(row.isOpen);
          doorsList.push(new Door(row.lockID, row.door_name, row.isOpen));
        }
        socket.emit("doorListRes", doorsList);
      }
    });
  });

  socket.on("addDoors", (data) => {
    var addDoorQuery =
      'insert ignore into doors (lockID, door_name) values ("' +
      data.lockID +
      '", "' +
      data.doorName +
      '");';

    connection.query(addDoorQuery, function (err, result, fields) {
      if (err) {
        console.log("Adding doors: " + data.lockID + "failed");
        socket.emit("addDoorsRes", {
          lockID: data.lockID,
          doorName: data.doorName,
          uuid: data.uuid,
          status: data.isOpen,
          error: false,
        });
        throw err;
      } else {
        console.log("Adding doors: " + data.lockID + "succeed");
        socket.emit("addDoorsRes", {
          lockID: data.lockID,
          doorName: data.doorName,
          uuid: data.uuid,
          status: data.isOpen,
          error: true,
        });
      }
    });
  });

  socket.on("deleteDoors", (data) => {
    var deleteDoorQuery =
      'DELETE from doors where lockID = "' + data.lockID + '";';

    connection.query(deleteDoorQuery, function (err, result, fields) {
      if (err) {
        console.log("Deleting doors: " + data.lockID + "failed");
        socket.emit("deleteDoorsRes", { lockID: data.lockID, error: false });
        throw err;
      } else {
        console.log("Deleting doors: " + data.lockID + "succeed");
        socket.emit("deleteDoorsRes", { lockID: data.lockID, error: true });
      }
    });
  });

  socket.on("addPermission", (data) => {
    var addPermissionQuery =
      'insert ignore into permissions (lockID, email) values ("' +
      data.lockID +
      '", "' +
      data.email +
      '");';
    connection.query(addPermissionQuery, function (err, result, fields) {
      if (err) {
        console.log(
          "Adding permission: " + data.lockID + " : " + data.email + " failed"
        );
        socket.emit("addPermissionRes", {
          lockID: data.lockID,
          email: data.email,
          error: false,
        });
        throw err;
      } else {
        console.log(
          "Adding permission: " + data.lockID + " : " + data.email + " succeed"
        );
        socket.emit("addPermissionRes", {
          lockID: data.lockID,
          email: data.email,
          error: true,
        });
      }
    });
  });

  socket.on("deletePermission", (data) => {
    var deletePermissionQuery =
      'DELETE from permissions where lockID = "' +
      data.lockID +
      '" AND email="' +
      data.email +
      '";';
    connection.query(deletePermissionQuery, function (err, result, fields) {
      if (err) {
        console.log(
          "Deleting permission: " + data.lockID + " : " + data.email + " failed"
        );
        socket.emit("deletePermissionRes", {
          lockID: data.lockID,
          email: data.email,
          error: false,
        });
        throw err;
      } else {
        console.log(
          "Deleting permission: " +
            data.lockID +
            " : " +
            data.email +
            " succeed"
        );
        socket.emit("deletePermissionRes", {
          lockID: data.lockID,
          email: data.email,
          error: true,
        });
      }
    });
  });

  socket.on("doorsList", (data) => {
    console.log(data);
    console.log("Doors List emited");
    var usersDoorsQuery =
      'select * from doors WHERE lockID IN (select lockID from permissions WHERE email="' +
      data.email +
      '");';
    var doorsList = [];
    connection.query(usersDoorsQuery, function (err, results, fields) {
      if (err) {
        console.log("Couldn't get list of doors for user: " + data.email);
      } else {
        for (const row of results) {
          doorsList.push(new Door(row.lockID, row.door_name, row.isOpen));
        }
        socket.emit("doors", { doorsList: doorsList });
        console.log(doorsList);
      }
    });
  });

  socket.on("userDoorList", (data) => {
    console.log("User door List emited");
    var usersDoorsQuery =
      'select * from users WHERE email IN (select email from permissions WHERE lockID="' +
      data.lockID +
      '");';
    var usersList = [];
    connection.query(usersDoorsQuery, function (err, results, fields) {
      if (err) {
        console.log("Couldn't get list of users for doors: " + data.lockID);
      } else {
        for (const row of results) {
          usersList.push(new User(row.email, row.password));
        }
        socket.emit("userDoorListRes", usersList);
        console.log(usersList);
      }
    });
  });

  socket.on("editLockId", (data) => {
    console.log("editing lockID");
    var editLockIDQuery =
      'UPDATE doors SET lockID = "' +
      data.newLockID +
      '" WHERE lockID="' +
      data.oldLockID +
      '";';
    connection.query(editLockIDQuery, function (err) {
      if (err) {
        console.log(
          "Couldnt update door: " +
            data.oldLockID +
            " with new lock ID: " +
            data.newLockID
        );
        throw err;
      } else {
        console.log(
          "Successfully updated door with lock ID: " + data.newLockID
        );
      }
    });
  });

  socket.on("editUUID", (data) => {
    console.log("editing uuid");
    var editUUIDQuery =
      'UPDATE doors SET uuid = "' +
      data.newUUID +
      '" WHERE lockID="' +
      data.oldLockID +
      '";';
    connection.query(editUUIDQuery, function (err) {
      if (err) {
        console.log(
          "Couldnt update door: " +
            data.oldLockID +
            " with new uuid: " +
            data.newUUID
        );
        throw err;
      } else {
        console.log("Successfully updated door with uuid: " + data.newUUID);
      }
    });
  });

  socket.on("editDoorName", (data) => {
    console.log("editing door name");
    console.log(data.newDoorName);
    console.log(data.oldLockID);
    var editDoorNameQuery =
      'UPDATE doors SET door_name = "' +
      data.newDoorName +
      '" WHERE lockID="' +
      data.oldLockID +
      '";';
    connection.query(editDoorNameQuery, function (err) {
      if (err) {
        console.log(
          "Couldnt update door: " +
            data.oldLockID +
            " with new door name: " +
            data.newDoorName
        );
        throw err;
      } else {
        console.log(
          "Successfully updated door with lock ID: " + data.oldLockID
        );
      }
    });
  });

  socket.on("editEmail", (data) => {
    console.log("editing email");
    var editEmailQuery =
      'UPDATE users SET email = "' +
      data.newEmail +
      '" WHERE email="' +
      data.oldEmail +
      '";';
    connection.query(editEmailQuery, function (err) {
      if (err) {
        console.log(
          "Couldnt update user: " +
            data.oldEmail +
            " with new email: " +
            data.newEmail
        );
        throw err;
      } else {
        console.log("Successfully updated user with email: " + data.newEmail);
      }
    });
  });

  socket.on("editPassword", (data) => {
    console.log("editing password");
    var editPasswordQuery =
      'UPDATE users SET password = "' +
      data.newPassword +
      '" WHERE email="' +
      data.email +
      '";';
    connection.query(editPasswordQuery, function (err) {
      if (err) {
        console.log(
          "Couldnt update user: " +
            data.email +
            " with new password: " +
            data.newPassword
        );
        throw err;
      } else {
        console.log(
          "Successfully updated user with email: " +
            data.email +
            " pass: " +
            data.newPassword
        );
      }
    });
  });

  socket.on("fullDoorsListRequest", (data) => {
    var doorsListQuery = "SELECT * from doors";
    connection.query(doorsListQuery, function (err, results, fields) {
      if (err) {
        console.log("Couldn't get doors list");
        throw err;
      } else {
        var newDoorsList = [];
        for (const row of results) {
          newDoorsList.push(new Door(row.lockID, row.door_name, row.isOpen));
        }
        socket.emit("fullDoorsListResponse", { doorsList: newDoorsList });
        console.log("popup");
        console.log(newDoorsList);
      }
    });
  });

  socket.on("addPermissions", (data) => {
    for (const perm of data.addQueries) {
      var addPermisQuery =
        'insert ignore into permissions (lockID, email) values ("' +
        perm.lockID +
        '", "' +
        perm.email +
        '");';
      connection.query(addPermisQuery, function (err) {
        if (err) throw err;
        console.log("permission data added");
      });
    }
  });

  socket.on("deletePermissions", (data) => {
    for (const perm of data.deleteQueries) {
      var deletePermisQuery =
        'DELETE from permissions where email = "' +
        perm.email +
        '" AND lockID="' +
        perm.lockID +
        '";';
      connection.query(deletePermisQuery, function (err) {
        if (err) throw err;
        console.log("permission data removed");
      });
    }
  });

  // socket.on("openDoor", (data) => {
  //   console.log(data);
  //   console.log("opening doors with id: " + data.lockID);
  //   socket.broadcast.emit("openLockResponse", {
  //     didOpen: true,
  //     lockID: data.lockID,
  //   });
  // });

  // socket.on("closeDoor", (data) => {
  //   console.log(data);
  //   console.log("closing doors with id: " + data.lockID);
  //   socket.broadcast.emit("closeLockResponse", {
  //     didClose: true,
  //     lockID: data.lockID,
  //   });
  // });

  // socket.on("quickOpenDoor", (data) => {
  //   console.log(data);
  //   console.log("opening doors for 10 seconds with id: " + data.lockID);
  //   socket.broadcast.emit("quickOpenLockResponse", {
  //     didOpen: true,
  //     lockID: data.lockID,
  //   });
  // });

  socket.on("openDoor", (data) => {
    console.log(data);
    console.log("response");
    // if (data.didOpen) {
    // console.log("didOpen true");
    var openDoorQuery =
      'UPDATE doors SET isOpen = 1 WHERE lockID="' + data.lockID + '";';
    connection.query(openDoorQuery, function (err) {
      if (err) throw err;
    });
    io.emit("doorStateChanged");
    // }
  });

  socket.on("closeDoor", (data) => {
    console.log(data);
    // if (data.didClose) {
    var closeDoorQuery =
      'UPDATE doors SET isOpen = 0 WHERE lockID="' + data.lockID + '";';
    connection.query(closeDoorQuery, function (err) {
      if (err) throw err;
    });
    console.log("doors closed");
    io.emit("doorStateChanged");
    // }
  });

  socket.on("quickOpenDoor", (data) => {
    console.log(data);
    // if (data.didOpen) {
    console.log("opened for 10 seconds");
    var openDoorQuery =
      'UPDATE doors SET isOpen = 1 WHERE lockID="' + data.lockID + '";';
    connection.query(openDoorQuery, function (err) {
      if (err) throw err;
    });

    io.emit("doorStateChanged");

    var closeDoorQuery =
      'UPDATE doors SET isOpen = 0 WHERE lockID="' + data.lockID + '";';

    setTimeout(() => {
      connection.query(closeDoorQuery, function (err) {
        if (err) throw err;
      });
      console.log("doors closed");
      io.emit("doorStateChanged");
    }, 10000);

    // }
  });
});
