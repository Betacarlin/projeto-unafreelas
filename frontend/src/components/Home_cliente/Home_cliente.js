import React,{useState,useEffect} from 'react';
import logo from '../../imagens/logo_2.png';
import icon_1 from '../../imagens/icon_andamento.png';
import lupa from '../../imagens/lupa.png';
import {useHistory,NavLink} from 'react-router-dom';
import api from '../../service/api';

function Home_cliente() {
    const nome = localStorage.getItem('Nome');
    const id_solicitante = localStorage.getItem('Id');
    const history = useHistory();
    const [projetos, setProjetos] = useState([]);
    const [filtro, setFiltro] = useState('') ;
    localStorage.setItem('Filtro', filtro);

    useEffect(() => {
        api.get(`projetos/andamentosoli?id_solicitante=${id_solicitante}`, { 
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response => {
            setProjetos(response.data);

        })
    }, [id_solicitante]);

    console.log('id é',projetos)

    function logOut(){
        localStorage.clear();
        history.push('/');
    }

    return (
        <div >
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

                <p>Projetos solicitados em andamento</p>
                {projetos.map(pj => (
                       <li key = {pj.id_post}>

                          <p>{pj.nome_projeto}</p>

                          <p>{pj.data_soli}</p>

                          <p>{pj.nome}</p>

                       </li>
                ))}
            </ul>
        </div>
    )
}

export default Home_cliente
