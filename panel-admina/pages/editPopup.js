import React from "react"
import styles from '../styles/User.module.css'

const Popup = props => {
    let emailInputAdd = React.createRef();
    let passwordInputAdd = React.createRef();

    return(
        <div className={styles.popupbox}>
            <div className={styles.boxpop}>
                <span className={styles.closeicon} onClick={props.handleClose}>x</span>
                <div className={styles.permTable}>
                    <form className={styles.form} onSubmit={() => props.handleEdit(emailInputAdd.current.value, passwordInputAdd.current.value)}>
                        <h2>Edit user: {props.user} </h2>
                        <input className={styles.inputtext} placeholder="Email" type="text"  ref={emailInputAdd}  />
                        <input className={styles.inputtext} placeholder="Password" type="text"  ref={passwordInputAdd} />
                        <input className={styles.inputsubmit} type="submit" value="Edit user" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Popup;