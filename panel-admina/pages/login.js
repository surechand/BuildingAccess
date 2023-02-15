import React, { useState } from "react"
import styles from '../styles/Login.module.css'

const io = require("socket.io-client");

const socket = io.connect("http://localhost:4000", {
    transports: ['websocket'],
    upgrade: false
});

socket.on("adminLoginResponse", function (data) {
    console.log(data.response);
    if (data.response) {
        Login.setLogin(true);
    } else {
        alert("Błędna nazwa użytkownika lub hasło.");
    }
});

export default function Login({ setLogin }) {
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();

    Login.setLogin = setLogin;

    const handleSubmit = async e => {
        e.preventDefault();
        socket.emit("adminLoginRequest", { userName: userName, password: password });
    }
    return (
        <div className={styles.loginBox}>
            <form className={styles.loginForm} onSubmit={handleSubmit} >
                <h2>Login</h2>
                <input className={styles.inputtext} placeholder="Email" type="text"
                    onChange={e => setUserName(e.target.value)} />
                <input className={styles.inputtext} placeholder="Password" type="password"
                    onChange={e => setPassword(e.target.value)} />
                <input className={styles.inputsubmit} type="submit" value="Login" />
            </form>
        </div>
    );
}
