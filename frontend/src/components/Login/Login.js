import React, {useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import './Login.css';
import logo_cad from '../../imagens/logo_2.png';
import api from '../../service/api';

function Login() {

    const [email, setEmail] = useState("");
    const [senha,setSenha] = useState("");


    async function LoginUser(e) {
        e.preventDefault();

        try{
        const res = await api.post('http://localhost:3333/usuario/login',{
          email: email,
          senha : senha
        }).then(() => {
          alert ("Chegou no THEN");
          
          localStorage.setItem ('tipoUser', res.data.tipo_usuario);
          localStorage.setItem('tipoNome', res.data.nome);
          localStorage.setItem('tipoEmail', res.data.email);
        })
        } catch(err){
            alert('ERRO DE ALGUMA COISA CAIU NO CATCH')
        }

        //history.push('/Login')
    };

  

    return (
      <div className = "cadastro-container">
            <form className = "box">
            <NavLink to = "/">
                <img id ='logo_cad' src={logo_cad} alt = "Logo"/>
            </NavLink>
            <input type="text" placeholder = "e-mail" value = {email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" placeholder = "senha" value = {senha} onChange={e => setSenha(e.target.value)}/>
            <button className="button_logar" onClick = {() => LoginUser} >Logar</button>
            </form> 
        </div>
    )
}

export default Login
