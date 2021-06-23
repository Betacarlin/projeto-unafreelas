import React,{useState,useEffect} from 'react';
import logo from '../../imagens/logo_2.png';
import icon_1 from '../../imagens/icon_andamento.png';
import lupa from '../../imagens/lupa.png';
import {useHistory,NavLink} from 'react-router-dom';
import api from '../../service/api';

function Home_profissional() {
    const nome = localStorage.getItem('Nome');
    const id_profissional = localStorage.getItem('Id');
    const history = useHistory();
    const [projetosAnd, setProjetosAnd] = useState([]);
    const [projetosPen, setProjetosPen] = useState([]);
    const [filtro, setFiltro] = useState('') ;
    localStorage.setItem('Filtro', filtro);

    useEffect(() => {
        api.get(`/projetos/andamento?id_profissional=${id_profissional}`, { 
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            setProjetosAnd(response.data);

        })
    }, [id_profissional]);

    useEffect(() => {
        api.get(`/projetos/pendente?id_profissional=${id_profissional}`, { 
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            setProjetosPen(response.data);

        })
    }, [id_profissional]);

    console.log('id é',projetosPen)

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
                {projetosAnd.map(pj => (
                       <li key = {pj.id_post}>

                          <p>{pj.nome_projeto}</p>

                          <p>{pj.data_soli}</p>

                          <p>{pj.nome}</p>

                       </li>
                ))}
            </ul>

            <ul> 

                <p>Projetos solicitados pendentes</p>
                {projetosPen.map(pjen => (
                       <li key = {pjen.id_post}>

                          <p>{pjen.nome_projeto}</p>

                          <p>{pjen.data_soli}</p>

                          <p>{pjen.nome}</p>

                       </li>
                ))}
            </ul>
        </div>
    )
}

export default Home_profissional
