import Head from "next/head";
import React from "react";
import styles from "../styles/User.module.css";
import { useState } from "react";
import Popup from "./editPopupDoor";
import PopupPermission from "./popupPermission";
import Login from "./login";
const io = require("socket.io-client");

class Door {
  constructor(lockID, doorName, status) {
    this.lockID = lockID;
    this.doorName = doorName;
    this.status = status;
  }
}

var doors = [];
var usersAll = [];
var userPerm = [];

class User {
  constructor(email, pass) {
    this.email = email;
    this.password = pass;
    this.perm = false;
  }
  setPermission(perm) {
    this.perm = perm;
  }
}

const socket = io.connect("http://localhost:4000", {
  transports: ["websocket"],
  upgrade: false,
});

socket.emit("doorList", {});

socket.on("deleteDoorsRes", function (data) {
  if (data.error) {
    alert("Usuwanie zakończyło się sukcesem");
    Main.deleting(data.lockID);
  } else {
    alert("Usuwanie zakończyło się niepowodzeniem");
  }
});

socket.on("addDoorsRes", function (data) {
  if (data.error) {
    alert(
      "Podano następujący ID: " +
        data.lockID +
        " oraz hasło: " +
        data.doorName +
        "\nDodanie zakończyło się sukcesem"
    );
    Main.adding(data.lockID, data.doorName, data.status);
  } else {
    alert(
      "Podano następujący ID: " +
        data.lockID +
        " oraz hasło: " +
        data.doorName +
        "\nDodanie zakonczyło się niepowodzeniem"
    );
  }
});

socket.on("users", function (data) {
  usersAll = [];
  for (const user of data) {
    usersAll.push(new User(user.email, user.password));
  }
  Main.gotUser();
});

socket.on("userDoorListRes", function (data) {
  userPerm = [];
  for (const user of data) {
    userPerm.push(new User(user.email, user.password));
  }
  Main.gotUserPerm();
});

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

function DoorTable(props) {
  var index = 1;
  return (
    <div className={styles.table}>
      <div className={styles.tableheader}>
        <div>Lp.</div>
        <div>IP</div>
        <div>NAME</div>
        <div>status</div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {props.items.map((item) => (
        <div className={styles.tableRow} key={index}>
          <div>{index++}</div>
          <div>{item.lockID}</div>
          <div>{item.doorName}</div>
          <div>{item.status}</div>
          <div>
            <button
              className={styles.editButtonTable}
              onClick={() => Main.editing(item.lockID)}
            >
              EDIT
            </button>
          </div>
          <div>
            <button
              className={styles.deleteButtonTable}
              onClick={() => Main.deleting(item.lockID)}
            >
              DELETE
            </button>
          </div>
          <div>
            <button
              className={styles.permButtonTable}
              onClick={() => Main.permissions(item.lockID)}
            >
              PERSMISSIONS
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Main() {
  const [lockIDState, setlockID] = useState("");
  const [lockIDStatePerm, setlockIDPerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  const refresh = useForceUpdate();
  let doorIDAdd = React.createRef();
  let doorNameAdd = React.createRef();

  const [login, setLogin] = useState(true);

  const loginUser = () => {
    socket.emit("isLoggedIn", {});
    socket.on("isLoggedInResponse", (data) => {
      //console.log("login");
      //console.log(data.isLoggedIn);
      setLogin(data.isLoggedIn);
      return data.isLoggedIn;
    });
  };

  loginUser();

  if (!login) {
    return <Login setLogin={setLogin} />;
  }

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const togglePopup2 = () => {
    setIsOpen2(!isOpen2);
    setIsOpen3(!isOpen3);
  };

  const gotUsers = () => {
    setIsOpen2(!isOpen2);
  };

  const gotUsersPerm = () => {
    setIsOpen3(!isOpen3);
  };

  function savePermissions(newPermission, oldPermission) {
    var deleteUsers = [];
    var addUsers = [];

    for (const userNew of newPermission) {
      for (const userOld of oldPermission) {
        if (userNew.perm !== userOld.perm) {
          if (userNew.perm) {
            addUsers.push(userNew.email);
          } else {
            deleteUsers.push(userNew.email);
          }
        }
      }
      console.log(lockIDStatePerm);
      for (const email of addUsers) {
        console.log(email);
        socket.emit("addPermission", { email: email, lockID: lockIDStatePerm });
      }
      for (const email of deleteUsers) {
        socket.emit("deletePermission", {
          email: email,
          lockID: lockIDStatePerm,
        });
      }
    }

    togglePopup2();
  }

  const currentEditDoor = (lockID) => {
    setlockID(lockID);
  };

  const editPermissionsDoor = (lockID) => {
    setlockIDPerm(lockID);
  };

  function checkIfNewDoorExists(lockID) {
    for (let i = 0; i < doors.length; i++) {
      console.log(doors[i]);
      if (doors[i].lockID == lockID) {
        return true;
      }
    }
    return false;
  }

  function addDoor(lockID, doorName, status) {
    if (status === 1) {
      var newDoor = new Door(lockID, doorName, "open");
    } else {
      var newDoor = new Door(lockID, doorName, "close");
    }
    doors.push(newDoor);
    refresh();
  }

  function deleteDoor(lockID) {
    for (let i = 0; i < doors.length; i++) {
      if (doors[i].lockID === lockID) {
        socket.emit("deleteDoors", { lockID: lockID });
        doors.splice(i, 1);
        refresh();
        break;
      }
    }
  }

  function editDoor(lockID) {
    currentEditDoor(lockID);
    togglePopup();
  }

  function editPermissions(lockID) {
    socket.emit("requestUsers", {});
    socket.emit("userDoorList", { lockID: lockID });

    editPermissionsDoor(lockID);
  }

  function executeEdit(lockID, doorName) {
    for (var door of doors) {
      if (door.lockID === lockIDState) {
        if (doorName != "") {
          door.doorName = doorName;
          socket.emit("editDoorName", {
            newDoorName: doorName,
            oldLockID: lockIDState,
          });
        }
        if (lockID != "") {
          door.lockID = lockID;
          socket.emit("editLockId", {
            newLockID: lockID,
            oldLockID: lockIDState,
          });
        }
      }
    }
    togglePopup();
    Main.refresh;
  }

  socket.on("doorListRes", function (data) {
    for (const door of data) {
      if (door.isOpen === 1) {
        doors.push(new Door(door.lockID, door.doorName, "open"));
      } else {
        doors.push(new Door(door.lockID, door.doorName, "close"));
      }
    }
    refresh();
  });

  Main.refresh = useForceUpdate;
  Main.adding = addDoor;
  Main.deleting = deleteDoor;
  Main.editing = editDoor;
  Main.permissions = editPermissions;
  Main.gotUser = gotUsers;
  Main.gotUserPerm = gotUsersPerm;

  function handleSubmitAdd(event) {
    event.preventDefault();
    event.stopPropagation();
    let lockID = doorIDAdd.current.value;
    let doorName = doorNameAdd.current.value;

    if (lockID == "" || doorName == "") {
      alert("Wypełnij wszystkie pola!");
      return;
    }
    if (checkIfNewDoorExists(lockID)) {
      alert("Drzwi o podanym ID już istnieją!");
      return;
    }

    socket.emit("addDoors", {
      lockID: doorIDAdd.current.value,
      doorName: doorNameAdd.current.value,
    });
    doorIDAdd.current.value = "";
    doorNameAdd.current.value = "";
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Doors</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Doors</h1>
        <DoorTable items={doors} />
        <div className={styles.box}>
          <form className={styles.form} onSubmit={handleSubmitAdd}>
            <h2>Create new door</h2>
            <input
              className={styles.inputtext}
              placeholder="IP"
              type="text"
              ref={doorIDAdd}
            />
            <input
              className={styles.inputtext}
              placeholder="Door name"
              type="text"
              ref={doorNameAdd}
            />
            <input
              className={styles.inputsubmit}
              type="submit"
              value="Add new door"
            />
          </form>
        </div>
      </main>
      {isOpen && (
        <Popup
          lockID={lockIDState}
          handleClose={togglePopup}
          handleEdit={executeEdit}
        />
      )}
      {isOpen2 && isOpen3 && (
        <PopupPermission
          lockID={lockIDStatePerm}
          usersAll={usersAll}
          usersPerm={userPerm}
          handleSave={savePermissions}
          handleClose={togglePopup2}
        />
      )}
    </div>
  );
}
