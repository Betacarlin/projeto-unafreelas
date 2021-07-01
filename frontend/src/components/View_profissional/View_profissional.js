import React,{useState,useEffect} from 'react';
import logo from '../../imagens/logo_2.png';
import icon from '../../imagens/icon_andamento.png';
import icoon from '../../imagens/icon_pendentes.png';
import lupa from '../../imagens/lupa.png';
import Modal from '../Popup_view/Popup_view';
import {useHistory,NavLink} from 'react-router-dom';
import api from '../../service/api';
import './View_profissional.css';

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
    const [usuario, setUsuario] = useState([]);
    const [userImg,setUserImg] = useState([]);
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

    useEffect(()=>{
        api.get(`usuarios/imagem?id=${viewid}`,{
            headers: {
                Authorization: viewid,
            }
        }).then(response =>{
            setUsuario(response.data)
        })

    },[viewid]);

    useEffect(()=>{
        api.get(`usuarios/imagem?id=${id_solicitante}`,{
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response =>{
            setUserImg(response.data)
        })

    },[id_solicitante]);


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
        <div className = "view-container">
            
            <header>
                    <img id = 'logo' src={logo} alt = 'logo'/>
                    <div className = "search-box">
                    <input type = 'text' onChange={e => setFiltro(e.target.value)}/>
                    <NavLink to = '/Pagina_filtro'>
                        <img id = 'lupa' src={lupa} alt = 'lupa'/>
                    </NavLink>
                    </div>
                    {userImg.map(user =>(
                        <li key = {user.id}>
                        <img src={`http://localhost:3333/${user.imagem}`} alt="img" />
                    </li>
                    ))}
                    <NavLink to = '/Home_cliente'>
                        <span>{nomesoli}</span>
                    </NavLink>
                    <button type = "button" onClick = {logOut}>Sair</button>
                    
            </header>
            <div className = "perfil-container2">
            {usuario.map(us =>(
                        <li key = {us.id}>
                        <img src={`http://localhost:3333/${us.imagem}`} alt="img" />
                    </li>
                    ))}
            <span>{viewnome}</span>
            </div>
            <div className = "butao">
                <button onClick = {() => setButtonPopup(true)}>Novo chamado</button>
            </div>
             {buttonPopup ? (
              <Modal onClose = {() =>setButtonPopup(false)}>
                  <div className = "form">
                    <strong>Titulo</strong>
                    <input type = "text" value = {titulo} onChange={e => setTitulo(e.target.value)}/>
                    <strong className = "desc">Descrição</strong>
                    <textarea maxLength="255"
                        placeholder="Descreva em no máximo 255 caracteres"
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                    />
                    <button className = "button_submit" onClick = {novoProjeto}>Solicitar</button>
                  </div>
              </Modal>
              ) : null}
             <div className = "call-container-andamento-view">
            <ul> 
                <div className = "titulo">
                    <img id = 'icon' src={icon} alt = 'icon'/>
                    <h1>Projetos em andamento</h1>
                </div>
                {projetosAnd.map(pj => (
                       <li key = {pj.id_post}>

                          <p1>{pj.nome_projeto}</p1>

                          <p2>{pj.data_soli}</p2>

                          <p3>{pj.nome}</p3>
                         
                       </li>
                ))}
            </ul>
            </div>
            <div className = "call-container-pendentes-view">
                <ul> 

                <div className = "titulo">
                    <img id = 'icoon' src={icoon} alt = 'icoon'/>
                    <h1>Propostas de projeto</h1>
                </div>
                    {projetosPen.map(pjen => (
                       <li key = {pjen.id_post}>

                          <p4>{pjen.nome_projeto}</p4>

                          <p5>{pjen.data_soli}</p5>

                          <p6>{pjen.nome}</p6>

                       </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default View_profissional
