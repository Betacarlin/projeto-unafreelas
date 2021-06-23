import React,{useState,useEffect} from 'react';
import logo from '../../imagens/logo_2.png';
import icon_1 from '../../imagens/icon_andamento.png';
import lupa from '../../imagens/lupa.png';
import Modal from '../Popup_view/Popup_view';
import {useHistory,NavLink} from 'react-router-dom';
import api from '../../service/api';

function View_profissional() {
    const viewnome = localStorage.getItem('Nomeview');
    const viewid = localStorage.getItem('Viewid');
    const history = useHistory();
    const [buttonPopup,setButtonPopup] = useState(false);
    const [projetosAnd, setProjetosAnd] = useState([]);
    const [projetosPen, setProjetosPen] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [titulo, setTitulo] = useState('');
    localStorage.setItem('Filtro', filtro);

    useEffect(() => {
        api.get(`/projetos/andamento?id_profissional=${viewid}`, { 
            headers: {
                Authorization: viewid,
            }
        }).then(response => {
            setProjetosAnd(response.data);

        })
    }, [viewid]);

    useEffect(() => {
        api.get(`/projetos/pendente?id_profissional=${viewid}`, { 
            headers: {
                Authorization: viewid,
            }
        }).then(response => {
            setProjetosPen(response.data);

        })
    }, [viewid]);

    console.log('id é',buttonPopup);

    async function novoProjeto(){
         
    }

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
                    <span>{viewnome}</span>
                    <button type = "button" onClick = {logOut}>Sair</button>
                </div>
            </header>
            <body>
            <div>
            <button onClick = {() => setButtonPopup(true)}>Novo chamado</button>
             {buttonPopup ? (
              <Modal onClose = {() =>setButtonPopup(false)}>
                 <h2>Modal do app</h2>
              </Modal>
              ) : null}
             </div>
             </body>
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

export default View_profissional
