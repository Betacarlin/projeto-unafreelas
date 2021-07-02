import React from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';
import logo from '../../imagens/logo_4.png';
function Home() {
    
    return (
        <>
        <nav className = "navbar">
            <div classname = "navbar-container">
                <NavLink to = "/" className = "navbar-logo">
               <img id ='logo' src={logo} alt = "Logo"/>
                </NavLink>
                <ul>
                <li>
                    <NavLink to = "/Login">Login</NavLink>
                </li>
                <li>
                    <NavLink to = "/Cadastro_cliente">Cadastro</NavLink>
                </li>
                </ul>
            </div>
        </nav>
        <div className = "home-container">
            <div className = "text">
                <h1>Peça ou realize um serviço de maneira rápida, simples e segura.</h1>
            </div>
            <div className = "buttom-getstart">
                <NavLink to = "/Cadastro_cliente">
                    <button className="button" type ="submit">Começar agora</button>
                </NavLink>
            </div>
        </div>
        </>
    )
}

export default Home
