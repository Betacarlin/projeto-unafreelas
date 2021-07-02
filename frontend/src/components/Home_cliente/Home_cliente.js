import React,{useState,useEffect} from 'react';
import logo from '../../imagens/logo_4.png';
import icon from '../../imagens/icon_andamento.png';
import lupa from '../../imagens/lupa.png';
import {useHistory,NavLink} from 'react-router-dom';
import api from '../../service/api';
import './Home_cliente.css';
import Modal from '../Popup_view/Popup_view';

function Home_cliente() {
    const nome = localStorage.getItem('Nome');
    const id_solicitante = localStorage.getItem('Id');
    const email = localStorage.getItem('Email');
    const history = useHistory();
    const [name,setName] = useState('');
    const [emails,setEmails] = useState('');
    const [projetos, setProjetos] = useState([]);
    const [usuario, setUsuario] = useState([]);
    let [page, setPage] = useState(1);
    const [imagem, setImagem] = useState({ file: null });
    const [filtro, setFiltro] = useState('') ;
    localStorage.setItem('Filtro', filtro);
    const [buttonPopup,setButtonPopup] = useState(false);

    useEffect(() => {
        api.get(`projetos/andamentosoli?id_solicitante=${id_solicitante}`, { 
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response => {
            setProjetos(response.data);

        })
    }, [id_solicitante]);

    useEffect(()=>{
        api.get(`usuarios/imagem?id=${id_solicitante}`,{
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response =>{
            setUsuario(response.data)
        })

    },[id_solicitante]);

    function input(e) {
        let arquivo = e.target.files[0]
        setImagem({ file: arquivo })
    };
    
    async function uploadImagem(id_solicitante){

        let file = imagem.file;
        let nome = name;
        let email = emails;
         
         let formdata = new FormData();
         
         formdata.append('imagem',file);
         formdata.set('nome',nome);
         formdata.set('email',email);

         try {
             await api.patch(`usuarios/imagem/${id_solicitante}`,formdata
             ,{
                headers: {
                    Authorization: id_solicitante,
                    'Content-Type': 'multipart/form-data',
                },
             },);
             alert('Perfil alterado com sucesso!');
             localStorage.setItem('Email',email);
             localStorage.setItem('Nome',nome);
             window.location.reload();
            }catch(err){
                alert('Arquivos com extensão somente jpg, png e jpeg!\n \n' + err);
             }
    };

    console.log('id é',imagem)
    
    function nextPage() {

        setPage(page += 1);
        api.get(`projetos/andamentosoli?page=${page}&id_solicitante=${id_solicitante}`, {
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response => {
            if (response.data < [1]) {
                alert("Não há mais registros!");
                setPage(page -= 1);
            }
            else {
                setProjetos(response.data)
            }
        });
            window.scrollTo(0, 0);      
    };

    function previousPage() {

        if (page === 1) {
            return alert("Esta é a página inicial!");
        }
        setPage(page -= 1);
        api.get(`projetos/andamentosoli?page=${page}&id_solicitante=${id_solicitante}`, {
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response => {
            setProjetos(response.data);
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
                    
                    <img className = "logo" id = 'logo' src={logo} alt = 'logo'/>
                    <div className = "search-box">
                        <input type = 'text' onChange={e => setFiltro(e.target.value)}/>
                        <NavLink to = '/Pagina_filtro'>
                            <img className = 'lupa' id = 'lupa' src={lupa} alt = 'lupa'/>
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
            <div className = "perfil-container">
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
                    <div className = "form-perfil">
                    <form encType="multipart/form-data" onSubmit={() => {uploadImagem(id_solicitante)}}>
                    <input
                        type="file"
                        name="imagem"
                        onChange={(e) => input(e)}
                    />
                    <p1>Nome </p1>
                    <input className = "nome" type = "text" placeholder = {nome} value = {name} onChange={e => setName(e.target.value)}/>
                    <p2>Email </p2>
                    <input className = "email" type = "text" placeholder = {email} value = {emails} onChange={e => setEmails(e.target.value)}/>
                    <button type = "submit" >Editar</button>
                </form>
                </div>
                </Modal>
            ):null}     
            <div className = "call-container">
            <ul> 
                <div className = "titulo">
                <img id = 'icon' src={icon} alt = 'icon'/>
                <h1>Projetos em andamento</h1>
                </div>
                
                {projetos.map(pj => (
                    <li key = {pj.id_post}>
                          
                       <p1>{pj.nome_projeto}</p1>

                       <p2>{pj.data_soli}</p2>

                       <p3>{pj.nome}</p3>
                     
                    </li>
                ))}

                <div className="paginacao">
                    <button type="button" onClick={previousPage}>Anterior</button>
                    <button type="button" onClick={nextPage}>Próxima</button>
                </div>    
            </ul>
            </div>
            
        </div>
    )
}

export default Home_cliente
