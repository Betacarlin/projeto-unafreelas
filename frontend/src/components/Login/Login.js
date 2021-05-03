import React from 'react';
import {NavLink} from 'react-router-dom';
import './Login.css';
import logo_cad from '../../imagens/logo_2.png';

function Login() {
    return (
      <div className = "cadastro-container">
            <form className = "box">
            <NavLink to = "/">
                <img id ='logo_cad' src={logo_cad} alt = "Logo"/>
            </NavLink>
            <input type="text" name = "" placeholder = "e-mail"/>
            <input type="password" name = "" placeholder = "senha"/>
            <NavLink to = "/Login">
                <button className="button_logar" type ="submit">Logar</button>
            </NavLink>
            </form> 
        </div>
    )
}

export default Login
