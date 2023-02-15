import Head from 'next/head';
import React from 'react';
import styles from '../styles/User.module.css';
import { useState } from 'react';
import Popup from './editPopup';
import PermissionPopup from './userPermissionsModal';
import Login from './login';
const io = require("socket.io-client");

class User {
    constructor(email, pass) {
        this.email = email;
        this.password = pass;
    }
}

class Door {
    constructor(lockID, doorName) {
        this.lockID = lockID;
        this.doorName = doorName;
    }
}

class DoorServer {
    constructor(lockID, doorName, uuid) {
        this.lockID = lockID;
        this.doorName = doorName;
        this.uuid = uuid;
    }
}

var users = [];
var doors = [];
var permissions = [];

const socket = io.connect("http://localhost:4000", {
    transports: ['websocket'],
    upgrade: false
});

socket.emit('requestUsers', {});

socket.on('deleteUserRes', function (data) {
    if (data.error=="true") {
        alert('Usuwanie zakończyło się sukcesem');
        Main.deleting(data.email);
    } else {
        alert('Usuwanie zakończyło się niepowodzeniem');
    }
});

socket.on('addUserRes', function (data) {
    if (data.error === "true") {
        alert('Podano następujący email: ' + data.email +' oraz hasło: '+ data.password + '\nDodanie zakończyło się sukcesem');
        Main.adding(data.email,data.password);
    } else {
        alert('Podano następujący email: ' + data.email +' oraz hasło: '+ data.password + '\nDodanie zakonczyło się niepowodzeniem');
    }
});

socket.on('fullDoorsListResponse', function(data) {
    doors = [];
    console.log("responsepopup");
    for(const door of data.doorsList) {
        doors.push(new DoorServer(door.lockID, door.doorName, door.uuid));
    }
    socket.emit('doorsList', {email: Main.userName});

});

socket.on('doors', function(data){
    permissions = [];
    for(const door of data.doorsList) {
        permissions.push(new Door(door.lockID, door.doorName));
    }
    Main.togglePermModal();
});

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

function UserTable(props) {
    console.log(props.items);
    var index = 1;
    return (
        <div className={styles.table}>
            <div className={styles.tableheader}>
                <div>Lp.</div>
                <div>Email</div>
                <div>Password</div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            {props.items.map(item => (
                <div className={styles.tableRow} key={index}>
                    <div>{index++}</div>
                    <div>{item.email}</div>
                    <div>{item.password}</div>
                    <div>
                        <button className={styles.editButtonTable} onClick={() => Main.editing(item.email)}>EDIT</button>
                    </div>
                    <div>
                        <button className={styles.deleteButtonTable} onClick={() => Main.deleting(item.email)}>DELETE</button>
                    </div>
                    <div>
                        <button className={styles.permButtonTable} onClick={() => Main.permissions(item.email)}>PERSMISSIONS</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Main() {
    const [userName, setUserName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPermissionModal, setIsOpenModal] = useState(false);
    const refresh = useForceUpdate();
    let emailInputAdd = React.createRef();
    let passwordInputAdd = React.createRef();

    const [login, setLogin] = useState(true);

    Main.userName = userName;
  const loginUser = () => {
    socket.emit("isLoggedIn", {});
    socket.on("isLoggedInResponse", (data) => {
      setLogin(data.isLoggedIn);
      return data.isLoggedIn;
    });
  }

  loginUser();

  if(!login) {
    return <Login setLogin={setLogin} />
  }

    const togglePermissionsModal = () => {
        setIsOpenModal(!isOpenPermissionModal);
    }

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const currentEditUser = (email) => {
        setUserName(email);
    }

    socket.on('users', function(data) {
        users = [];
        console.log("Hello");
        for(const user of data) {
            users.push(new User(user.email, user.password));
        }
        refresh();
    });

    function checkIfNewUserExists(email) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].email == email) {
                return true;
            }
        }
        return false;
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function addUser(email, password) {
        var newUser = new User(email, password);
        users.push(newUser);
        refresh();
    }

    function deleteUser(email) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].email == email) {
                socket.emit("deleteUser", {email: email});
                users.splice(i, 1);
                refresh();
                break;
            }
        }
    }

    function editUser(email){
        currentEditUser(email);

        togglePopup();
    }

    function editPermissions(email){
        currentEditUser(email);
        socket.emit("fullDoorsListRequest", {});
    }

    function executeEdit(email, password) {
        for(var user of users) {
            if(user.email === userName) {
                if(password != "") {
                    user.password = password;
                    socket.emit("editPassword", {email: userName, newPassword: password});
                } if(email != "" && validateEmail(email)) {
                    user.email = email;
                    socket.emit("editEmail", {oldEmail: userName, newEmail: email});
                }
            }
        }
        togglePopup();
        refresh();
    }

    Main.adding = addUser;
    Main.deleting = deleteUser;
    Main.editing = editUser;
    Main.permissions = editPermissions;
    Main.togglePermModal = togglePermissionsModal;
    Main.refresh = refresh;

    function handleSubmitAdd(event) {
        event.preventDefault();
        event.stopPropagation();
        let email = emailInputAdd.current.value;
        let password = passwordInputAdd.current.value;

        if(email == '' || password == '') {
            alert("Wypełnij wszystkie pola!");
            return;
        }

        if(checkIfNewUserExists(email)) {
            alert("Użytkownik o podanym emailu już istnieje!");
            return;
        }
        if (!validateEmail(email)) {
            alert("Wprowadź poprawny email.");
            return;
        }
        socket.emit("addUser", {email: email, password: password});
        emailInputAdd.current.value = '';
        passwordInputAdd.current.value = '';
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Users</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Users
                </h1>
                <UserTable items={users}/>
                <div className={styles.box}>
                    <form className={styles.form} onSubmit={handleSubmitAdd}>
                        <h2>Add user</h2>
                        <input className={styles.inputtext} placeholder="Email" type="text" ref={emailInputAdd} />
                        <input className={styles.inputtext} placeholder="Password" type="password" ref={passwordInputAdd} />
                        <input className={styles.inputsubmit} type="submit" value="Add new user" />
                    </form>
                </div>
            </main>
            {isOpen && <Popup
            user={userName}
            handleClose={togglePopup}
            handleEdit={executeEdit}/> }

            {isOpenPermissionModal && <PermissionPopup
            user={userName}
            doorsList={doors}
            permissionList={permissions}
            handleSave={togglePermissionsModal}
            handleCancel={togglePermissionsModal}
            socket={socket} />}
        </div>
    );
}
