import React,{useState,useEffect} from 'react';
import logo from '../../imagens/logo_2.png';
import icon from '../../imagens/icon_andamento.png';
import icoon from '../../imagens/icon_pendentes.png';
import lupa from '../../imagens/lupa.png';
import {useHistory,NavLink} from 'react-router-dom';
import api from '../../service/api';
import './Home_profissional.css';
import Modal from '../Popup_view/Popup_view';

function Home_profissional() {
    const nome = localStorage.getItem('Nome');
    const id_profissional = localStorage.getItem('Id');
    const history = useHistory();
    const [projetosAnd, setProjetosAnd] = useState([]);
    const [projetosPen, setProjetosPen] = useState([]);
    const [usuario, setUsuario] = useState([]);
    let [page, setPage] = useState(1);
    const [imagem, setImagem] = useState({ file: null });
    const [filtro, setFiltro] = useState('') ;
    localStorage.setItem('Filtro', filtro);
    const [buttonPopup,setButtonPopup] = useState(false);

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

    useEffect(()=>{
        api.get(`usuarios/imagem?id=${id_profissional}`,{
            headers: {
                Authorization: id_profissional,
            }
        }).then(response =>{
            setUsuario(response.data)
        })

    },[id_profissional]);
    
    function input(e) {
        let arquivo = e.target.files[0]
        setImagem({ file: arquivo })
    };

    async function uploadImagem(id_profissional){

        let file = imagem.file;
        
        let formdata = new FormData();
        
        formdata.append('imagem',file);

        try {
            await api.patch(`usuarios/imagem/${id_profissional}`,formdata
            ,{
               headers: {
                   Authorization: id_profissional,
                   'Content-Type': 'multipart/form-data',
               },
            },);
            alert('Imagem de perfil alterada, com sucesso');
            window.location.reload();
           }catch(err){
               alert('Arquivos com extensão somente jpg, png e jpeg! \n \n' + err);
            }
   };

    //console.log('id é',projetosPen)
     

    async function deletePost(id_post) {
        try {
            await api.delete(`projetos/${id_post}`, {
                headers: {
                    Authorization: id_profissional,
                }
            });
            alert('Post deletado com sucesso !');
            window.location.reload();
        } catch (err) {
            alert('Você não tem permissão para deletar esta postagem \n \n' + err);
        }
    };

    async function updatePost(id_post) {
        try {
            await api.put(`projetos/${id_post}`,
            {
                headers: {
                    Authorization: id_profissional,
                }
            });
            alert('Post alterado com sucesso !');
            window.location.reload();
        } catch (err) {
            alert('Você não tem permissão para alterar esta postagem \n \n' + err);
        }
    };

    function nextPageAnd() {

        setPage(page += 1);
        api.get(`projetos/andamento?page=${page}&id_profissional=${id_profissional}`, {
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            if (response.data < [1]) {
                alert("Não há mais registros !");
                setPage(page -= 1);
            }
            else {
                setProjetosAnd(response.data)
            }
        });
            window.scrollTo(0, 0);      
    };

    function previousPageAnd() {

        if (page === 1) {
            return alert("Esta é a página inicial !");
        }
        setPage(page -= 1);
        api.get(`projetos/andamento?page=${page}&id_profissional=${id_profissional}`, {
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            setProjetosAnd(response.data);
        });
        window.scrollTo(0, 0); 
    };

    function nextPagePen() {

        setPage(page += 1);
        api.get(`projetos/pendente?page=${page}&id_profissional=${id_profissional}`, {
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            if (response.data < [1]) {
                alert("Não há mais registros !");
                setPage(page -= 1);
            }
            else {
                setProjetosAnd(response.data)
            }
        });
            window.scrollTo(0, 0);      
    };

    function previousPagePen() {

        if (page === 1) {
            return alert("Esta é a página inicial !");
        }
        setPage(page -= 1);
        api.get(`projetos/pendente?page=${page}&id_profissional=${id_profissional}`, {
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            setProjetosAnd(response.data);
        });
        window.scrollTo(0, 0); 
    };

    function logOut(){
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className = "home-container">
            <header>
                    <img id = 'logo' src={logo} alt = 'logo'/>
                    <div className = "search-box">
                    <input type = 'text' onChange={e => setFiltro(e.target.value)}/>
                    <NavLink to = '/Pagina_filtro'>
                        <img id = 'lupa' src={lupa} alt = 'lupa'/>
                    </NavLink>
                    </div>
                    {usuario.map(us =>(
                        <li key = {us.id}>
                        <img src={`http://localhost:3333/${us.imagem}`} alt="img-header" id = "imgheader" />
                    </li>
                    ))}
                    <span>{nome}</span>
                    <button type = "button" onClick = {logOut}>Sair</button>
                
            </header>
            <div className = "perfil-container1">
            <button onClick = {() => setButtonPopup(true)}>Editar perfil</button>  
                {usuario.map(us =>(
                        <li key = {us.id}>
                        <img src={`http://localhost:3333/${us.imagem}`} alt="img-header" id = "imgheader" />
                    </li>
                    ))}
                <span>{nome}</span>
            </div>
            {buttonPopup ? (
                <Modal onClose = {() =>setButtonPopup(false)}>
                    <form encType="multipart/form-data" onSubmit={() => {uploadImagem(id_profissional)}}>
                    <input
                        type="file"
                        name="imagem"
                        onChange={(e) => input(e)}
                    />
                    <button type = "submit" >ok</button>
                </form>
                </Modal>
            ):null}  
            <div className = "call-container-andamento">
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
            <div className="paginacao">
                <button type="button" onClick={previousPageAnd}>Anterior</button>
                <button type="button" onClick={nextPageAnd}>Próxima</button>
            </div>
                
            </ul>
            </div>
            
            <div className = "call-container-pendentes">
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
                          <div className="butao-submit">
                              <div className = "Aceitar">
                                <button type = "button" onClick = {() => {updatePost(pjen.id_post)}}>Aceitar</button>
                              </div>
                              <div><button type = "button" onClick = {() => {deletePost(pjen.id_post)}}>Rejeitar</button></div>
                         </div> 
                       </li>
                ))}
                    <div className="paginacao">
                        <button type="button" onClick={previousPagePen}>Anterior</button>
                        <button type="button" onClick={nextPagePen}>Próxima</button>
                    </div>
                </ul>
            </div>
            
            
              
        </div>
    )
}

export default Home_profissional
