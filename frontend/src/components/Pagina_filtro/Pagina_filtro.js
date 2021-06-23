import React,{useState,useEffect} from 'react';
import logo from '../../imagens/logo_2.png';
import icon_1 from '../../imagens/icon_andamento.png';
import lupa from '../../imagens/lupa.png';
import {useHistory,NavLink} from 'react-router-dom';
import api from '../../service/api';

function Pagina_filtro() {
    
    const nome = localStorage.getItem('Nome');
    const history = useHistory();
    const filt = localStorage.getItem('Filtro');
    const id_solicitante = localStorage.getItem('Id');
    const [filtro, setFiltro] = useState('');
    const [user, setUser] = useState([]);
    
    useEffect(() => {
        api.get(`projetos/usuariotipo?tipo_negocio=${filt}`, { 
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response => {
            setUser(response.data);

        })
    }, [id_solicitante]);
    

    function logOut(){
        localStorage.clear();
        history.push('/');
    }

    return (
        <div>
            <header>
                <div className = 'header-home'>
                    <img id = 'logo' src={logo} alt = 'logo'/>
                    <input type = 'text' onChange={e => setFiltro(e.target.value)}/>
                    <NavLink to = '/Pagina_filtro'>
                        <img id = 'lupa' src={lupa} alt = 'lupa'/>
                    </NavLink>
                    <span>{nome}</span>
                    <button type = "button" onClick = {logOut}>Sair</button>
                </div>
            </header>
            <ul> 

                {user.map(us => (
                       <li key = {us.id}>

                          <p>{us.nome}</p>

                          <p>{us.razao_social}</p>

                          <p>{us.email}</p>
                          
                          <NavLink to = '/View_profissional'>
                         <button type = 'button' onClick = {()=>{localStorage.setItem('Viewid',us.id);localStorage.setItem('Emailview',us.email);localStorage.setItem('Nomeview',us.nome)}}>Acessar Perfil</button>
                         </NavLink>
                       </li>
                ))}
            </ul>
        </div>
    )
}

export default Pagina_filtro
