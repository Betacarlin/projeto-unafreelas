const crypto = require('crypto');
const connection = require('../database/connection');


module.exports = {
    async getAllUsers(request, response) {

        const usuarios = await connection('usuario').select('*');

        return response.json(usuarios);
    },
    async create(request, response) {
        const { id, nome, email, senha, tipo_usuario, razao_social, tipo_negocio } = request.body;

        // const id = crypto.randomBytes(8).toString('HEX');

        await connection('usuario').insert({ id, nome, email, senha, tipo_usuario, razao_social, tipo_negocio })

        return response.json({ id });
    },
    async createImagem(request,response,){
        const imagem = request.file.path;
        const { id } = request.params;

        await connection ('usuario').where('id',id).update({imagem:imagem});
        return response.status(204).send();    

    },

    async viewImagem(request,response){
        const { id} = request.query;   //recuperar projetos do profissional filtro
        const [count] = await connection('usuario').count();

        const user = connection('usuario')    

        user
            .select('usuario.nome','usuario.email','usuario.id','usuario.razao_social','usuario.tipo_negocio','usuario.imagem').from('usuario')
            .where({ id:id });

            response.header('X-Total-Count', count['count(*)'])
        

        const users = await user

        return response.json(users);
    }
};