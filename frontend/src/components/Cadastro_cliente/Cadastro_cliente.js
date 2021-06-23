import React, { useState} from 'react';
import {NavLink,useHistory} from 'react-router-dom';
import './Cadastro_cliente.css';
import logo_cad from '../../imagens/logo_2.png';
import {Card,Nav} from 'react-bootstrap';
import api from '../../service/api';



function Cadastro_cliente() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha,setConfirmSenha] = useState("");
    const [isErr,setIsErr] = useState("");
    const history = useHistory();
    
    
    
    const submitCad = () => {
      api.post('usuarios',{
        nome : nome,
        email: email,
        senha : senha,
        tipo_usuario: 0
      }).then(() => {
        alert ("Cadastro de cliente realizado com sucesso")
      })
      history.push('/Home_cliente')
    };

    const checkValidation = (e) =>{
      const confPass = e.target.value;
      setConfirmSenha(confPass);
      if(senha != confPass){
        setIsErr("Senhas não conferem!!");
      }else if(senha == confPass | confPass == null){
        setIsErr("");
      }
    };

    return (

        <div className = "cadastro-container">
            <form className = "box">
                <div className = "box-header">
<Card>
  <Card.Header>
    <Nav variant="pills" defaultActiveKey="#first">
      <Nav.Item>
        <NavLink to="#first">Cliente</NavLink>
      </Nav.Item>
      <Nav.Item>
        <NavLink to="/Cadastro_profissional">Profissional</NavLink>
      </Nav.Item>
    </Nav>
  </Card.Header>
</Card>
                </div>
            <NavLink to = "/">
                <img id ='logo_cad' src={logo_cad} alt = "Logo"/>
            </NavLink>
            <div style = {{ position: "static", top:20}}>
                {isErr}
            </div>
            <input type="text" placeholder = "nome completo" value = {nome} onChange={e => setNome(e.target.value)}/>
            <input type="text" placeholder = "e-mail" value = {email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" placeholder = "senha" value = {senha} onChange={e => setSenha(e.target.value)}/>
            <input type="password" placeholder = "confirmar senha" value = {confirmSenha} onChange={e => checkValidation(e)}/>
            <button className="button_cadastrar" onClick={submitCad}>Cadastrar</button>
            </form> 
        </div>
    )
}

export default Cadastro_cliente
