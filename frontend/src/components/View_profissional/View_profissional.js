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
    const nomesoli = localStorage.getItem('Nome');
    const id_solicitante = localStorage.getItem('Id');
    const history = useHistory();
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const dataAtual = dia + '/' + mes + '/' + ano;
    const [buttonPopup,setButtonPopup] = useState(false);
    const [projetosAnd, setProjetosAnd] = useState([]);
    const [projetosPen, setProjetosPen] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao,setDescricao] = useState('');
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

    console.log('id é',descricao);

    async function novoProjeto(e){
        
        e.preventDefault();
         try {
             await api.post(`projetos?id_solici=${id_solicitante}`,{
                 nome_projeto: titulo,
                 id_solicitante: id_solicitante,
                 id_profissional: viewid,
                 data_soli: dataAtual,
                 status_projeto: 'pendente',
                 descricao: descricao
             },
             {
                headers: {
                    Authorization: id_solicitante
                },
             },
             );
             alert('Projeto solicitado para '+viewnome);
          }catch(err){
              alert('Não foi possivel solicitar o projeto! '+ err)
          }
    };

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
                    <NavLink to = '/Home_cliente'>
                        <span>{nomesoli}</span>
                    </NavLink>
                    <button type = "button" onClick = {logOut}>Sair</button>
                </div>
            </header>
            <span>{viewnome}</span>
            <div>
            <button onClick = {() => setButtonPopup(true)}>Novo chamado</button>
             {buttonPopup ? (
              <Modal onClose = {() =>setButtonPopup(false)}>
                 <strong>Titulo</strong>
                 <input type = "text" value = {titulo} onChange={e => setTitulo(e.target.value)}/>
                 <strong>Descrição</strong>
                 <textarea maxLength="255"
                    placeholder="Descreva em no máximo 255 caracteres"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                 />
                 <button className = "button_submit" onClick = {novoProjeto}>Solicitar</button>
              </Modal>
              ) : null}
             </div>
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
