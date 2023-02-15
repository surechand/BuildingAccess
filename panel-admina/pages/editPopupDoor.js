import React from "react"
import styles from '../styles/User.module.css'

const Popup = props => {
    let lockID = React.createRef();
    let doorName = React.createRef();
    let UUID = React.createRef();

    return(
        <div className={styles.popupbox}>
            <div className={styles.boxpop}>
                <span className={styles.closeicon} onClick={props.handleClose}>x</span>
                <form className={styles.form} onSubmit={() => props.handleEdit(lockID.current.value, doorName.current.value, UUID.current.value)}>
                    <h2>Edit door: {props.lockID} </h2>
                    <input className={styles.inputtext} placeholder="IP" type="text"  ref={lockID}  />
                    <input className={styles.inputtext} placeholder="Name" type="text"  ref={doorName} />
                    <input className={styles.inputtext} placeholder="UUID" type="text"  ref={UUID} />
                    <input className={styles.inputsubmit} type="submit" value="Edit door" />
                </form>
            </div>
        </div>
    );
}

export default Popup;
