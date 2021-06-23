import React, {useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import './Login.css';
import logo_cad from '../../imagens/logo_2.png';
import api from '../../service/api';

function Login() {

    const [email, setEmail] = useState("");
    const [senha,setSenha] = useState("");
    const history = useHistory();


    async function LoginUser(e) {
        e.preventDefault();

        try{
        const res = await api.post('sessions',{
          email: email,
          senha : senha
        });
          localStorage.setItem ('tipo_usuario', res.data.tipo_usuario);
          localStorage.setItem('Nome', res.data.nome);
          localStorage.setItem('Email', res.data.email);
          localStorage.setItem('Id', res.data.id);

          if(localStorage.getItem('tipo_usuario')==0){
            history.push('/Home_cliente')
          } else{
            history.push('/Home_profissional')
          }

        } catch(err){
            alert("Não foi possível realizar login");
            console.log(err);
        }

    };

  

    return (
      <div className = "cadastro-container">
            <form className = "box">
            <NavLink to = "/">
                <img id ='logo_cad' src={logo_cad} alt = "Logo"/>
            </NavLink>
            <input type="text" placeholder = "e-mail" value = {email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" placeholder = "senha" value = {senha} onChange={e => setSenha(e.target.value)}/>
            <button className="button_logar" onClick = {LoginUser} >Logar</button>
            </form> 
        </div>
    )
}

export default Login
