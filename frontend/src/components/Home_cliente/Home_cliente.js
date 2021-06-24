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
    const [usuario, setUsuario] = useState([]);
    let [page, setPage] = useState(1);
    const [imagem, setImagem] = useState({ file: null });
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
         
         let formdata = new FormData();
         
         formdata.append('imagem',file);

         try {
             await api.patch(`usuarios/imagem/${id_solicitante}`,formdata
             ,{
                headers: {
                    Authorization: id_solicitante,
                    'Content-Type': 'multipart/form-data',
                },
             },);
             alert('Imagem de perfil alterada, com sucerro');
             window.location.reload();
            }catch(err){
                alert('Você não tem permissão para alterar esta postagem \n \n' + err);
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
                alert("Não há mais registros !");
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
            return alert("Esta é a página inicial !");
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
        <div >
            <header>
                <div className = 'header-home'>
                    <img id = 'logo' src={logo} alt = 'logo'/>
                    <input type = 'text' onChange={e => setFiltro(e.target.value)}/>
                    <NavLink to = '/Pagina_filtro'>
                        <img id = 'lupa' src={lupa} alt = 'lupa'/>
                    </NavLink>
                    {usuario.map(us =>(
                        <li key = {us.id}>
                        <img src={`http://localhost:3333/${us.imagem}`} alt="img" />
                    </li>
                    ))}
                    
                    <span>{nome}</span>
                    <button type = "button" onClick = {logOut}>Sair</button>
                </div>
            </header>
            <form encType="multipart/form-data" onSubmit={() => {uploadImagem(id_solicitante)}}>
                <input
                        type="file"
                        name="imagem"
                        onChange={(e) => input(e)}
                    />
                 <button type = "submit" >ok</button>
             </form>
                <span>{nome}</span>
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
            <div className="paginacao">
                <button type="button" onClick={previousPage}>Anterior</button>
                <button type="button" onClick={nextPage}>Próxima</button>
            </div>
        </div>
    )
}

export default Home_cliente
