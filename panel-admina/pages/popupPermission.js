import React from "react"
import styles from '../styles/popupPermission.module.css'
import Main from "./users";
import { useState } from 'react';

class User {
    constructor(email, pass, perm) {
        this.email = email;
        this.password = pass;
        this.perm = perm;
    }
    setPermission(perm) {
        this.perm = perm;
    }
}

var oldUsersPermission = [];
var newUsersPermission = [];

function DoorItem(props) {

    const [isChecked, setIsChecked] = useState(props.items.perm);

    function handleClick(email) {
        for (const userperm of newUsersPermission) {
            if (userperm.email === email) {
                userperm.perm = !userperm.perm;
            }
        }
        setIsChecked(!isChecked);
    }


    return (
        <div className={styles.doorRow}>
            <div>{props.index}.</div>
            <div>{props.items.email}</div>
            <div><input id={props.items.email} type="checkbox" defaultValue={true} checked={isChecked} onChange={() => handleClick(props.items.email)} /></div>
        </div>
    );
}




const Popup = props => {
    var index = 1;
    const users = props.usersAll;
    const doorUsers = props.usersPerm;
    oldUsersPermission = [];
    newUsersPermission = [];

    function save() {
        props.handleSave(newUsersPermission, oldUsersPermission);
    }

    function cancel() {
        props.handleClose();
    }

    for (const user of users) {
        oldUsersPermission.push(new User (user.email,user.password,false));
        newUsersPermission.push(new User (user.email,user.password,false));
    }

    if (doorUsers.length > 0) {
        for (const userperm of doorUsers) {
            for (const user of newUsersPermission) {
                if (userperm.email === user.email) {
                    user.setPermission(true)

                }
            }
        }
        for (const userperm of doorUsers) {
            for (const user of oldUsersPermission) {
                if (userperm.email === user.email) {
                    user.setPermission(true)

                }
            }
        }
    }


    return (
        <div className={styles.popupbox}>
            <div className={styles.boxpop}>
                <div className={styles.buttonGroup}>
                    <button className={styles.saveButton} onClick={save}>Save</button>
                    <button className={styles.cancelButton} onClick={cancel}>Cancel</button>
                </div>
                <h1> Edit permissions for doors: {props.lockID} </h1>
                <div className={styles.tableheader}>
                    <div>Lp.</div>
                    <div>Email</div>
                    <div>Permission</div>
                </div>
                {newUsersPermission.map(item => (
                    <DoorItem index={index++} items={item} />
                ))}
            </div>
        </div>
    );
}

export default Popup;
