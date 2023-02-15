import React from "react";
import styles from "../styles/PermissionModal.module.css";
import { useState } from "react";

class Permission {
  constructor(lockID, email) {
    this.lockID = lockID;
    this.email = email;
  }
}

var addPermissionQueries = [];
var deletePermissionQueries = [];

const DoorItem = (props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);
  function handleClick() {
    if (isChecked) {
      console.log("delete perm");
      addPermissionQueries = addPermissionQueries.filter(function (perm) {
        return perm.lockID != props.lockID;
      });
      deletePermissionQueries.push(new Permission(props.lockID, props.user));
    } else {
      console.log("add perm");
      deletePermissionQueries = deletePermissionQueries.filter(function (perm) {
        return perm.lockID != props.lockID;
      });
      addPermissionQueries.push(new Permission(props.lockID, props.user));
    }
    setIsChecked(!isChecked);
  }
  return (
    <div className={styles.doorRow}>
      <div>{props.index}.</div>
      <div>{props.lockID}</div>
      <div>{props.doorName}</div>
      <div>{props.uuid}</div>
      <div>
        <input
          id={props.lockID}
          type="checkbox"
          checked={isChecked}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

function checkDoorsInPermissions(permissions, door) {
  for (const perm of permissions) {
    if (door.lockID == perm.lockID) {
      return true;
    }
  }
  return false;
}

const PermissionPopup = (props) => {
  var index = 1;
  var doors = props.doorsList;
  var permissions = props.permissionList;
  const socket = props.socket;

  function save() {
    socket.emit("addPermissions", { addQueries: addPermissionQueries });
    socket.emit("deletePermissions", {
      deleteQueries: deletePermissionQueries,
    });
    props.handleSave();
  }

  function cancel() {
    console.log(addPermissionQueries);
    console.log(deletePermissionQueries);
    addPermissionQueries = [];
    deletePermissionQueries = [];
    props.handleCancel();
  }

  return (
    <div className={styles.popupbox}>
      <div className={styles.boxpop}>
        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={save}>
            Save
          </button>
          <button className={styles.cancelButton} onClick={cancel}>
            Cancel
          </button>
        </div>
        <h1> Edit permissions for user: {props.user} </h1>
        <div className={styles.tableheader}>
          <div>Lp.</div>
          <div>IP</div>
          <div>Name</div>
          <div>Permission</div>
        </div>
        {doors.map((door) => (
          <DoorItem
            index={index++}
            lockID={door.lockID}
            doorName={door.doorName}
            isChecked={checkDoorsInPermissions(permissions, door)}
            user={props.user}
          />
        ))}
      </div>
    </div>
  );
};

export default PermissionPopup;
