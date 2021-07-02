const connection = require('../database/connection');

module.exports = {
    async getAllProjetosPendentes(request, response) {
        const { page = 1, id_profissional = '' } = request.query;   //recuperar projetos do profissional pendentes
        const [count] = await connection('projeto').count();

        const projeto = connection('projeto')    

       
            projeto
            .select('usuario.nome','projeto.nome_projeto','projeto.data_soli','projeto.id_post').from('usuario')
            .join('projeto', 'usuario.id', 'projeto.id_solicitante')
            .where({ id_profissional: id_profissional, status_projeto:'pendente' })
            .limit(4)
            .offset((page - 1) * 4)
            .orderBy('projeto.id_post', "desc");

            response.header('X-Total-Count', count['count(*)'])
        

        const postagens = await projeto

        return response.json(postagens);
    },
    async getAllProjetosEmAndamento(request, response) {
        const { page = 1, id_profissional= '' } = request.query;   //recuperar projetos do profissional em andamento
        const [count] = await connection('projeto').count();

        const projeto = connection('projeto')    

        projeto
            .select('usuario.nome','projeto.nome_projeto','projeto.data_soli','projeto.id_post','projeto.descricao').from('usuario')
            .join('projeto', 'usuario.id', 'projeto.id_solicitante')
            .where({ id_profissional: id_profissional, status_projeto:'em andamento' })
            .limit(4)
            .offset((page - 1) * 4)
            .orderBy('projeto.id_post', "desc");

            response.header('X-Total-Count', count['count(*)'])
        

        const postagens = await projeto

        return response.json(postagens);
    },
    async getAllProjetosEmAndamentoSoli(request, response) {
        const { page = 1, id_solicitante = '' } = request.query;   //recuperar projetos do solicitante em andamento
        const [count] = await connection('projeto').count();


        const projeto = connection('projeto');

            projeto
                .select('usuario.nome','projeto.nome_projeto','projeto.data_soli','projeto.id_post','projeto.descricao').from('usuario')
                .join('projeto', 'usuario.id', 'projeto.id_profissional')
                .where({ id_solicitante: id_solicitante, status_projeto:'em andamento' })
                .limit(6)
                .offset((page - 1) * 6)
                .orderBy('projeto.id_post', "desc");

            response.header('X-Total-Count', count['count(*)'])

        const postagens = await projeto

        return response.json(postagens);
    },
    async getAllUsuarioFiltroTipoNegocio(request, response) {
        const { page = 1, tipo_negocio= '' } = request.query;   //recuperar projetos do profissional filtro
        const [count] = await connection('usuario').count();

        const user = connection('usuario')    

        user
            .select('usuario.nome','usuario.email','usuario.id','usuario.razao_social','usuario.tipo_negocio','usuario.imagem').from('usuario')
            .where({ tipo_negocio:tipo_negocio })
            .limit(6)
            .offset((page - 1) * 6)
            .orderBy('usuario.id', "desc");

            response.header('X-Total-Count', count['count(*)'])
        

        const users = await user

        return response.json(users);
    },
     

    async create(request, response) {

        const { nome_projeto,id_solicitante,id_profissional,data_soli,status_projeto,descricao } = request.body;
        const id_solici = request.headers.authorization;

            const [id] = await connection('projeto').insert({
                nome_projeto,id_solicitante,id_profissional,data_soli,status_projeto,descricao
            });

            return response.json({ id }); 
    },
    async delete(request, response) {
        const { id } = request.params;
        const id_profissional = request.headers.authorization;

        const post = await connection('projeto').where('id_post', id).select('id_profissional').first();

        if (post.id_profissional != id_profissional) {
            return response.status(401).json({ error: 'Operação não permitida !' });
        }

        await connection('projeto').where('id_post', id).delete();

        return response.status(204).send();
    },

    async update(request,response){
       const { id } = request.params;
     
       await connection ('projeto').where('id_post',id).update({status_projeto:'em andamento'});

       return response.status(204).send();
    }
};








