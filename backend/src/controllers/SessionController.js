const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
    async create(request, response) {
        const { email, senha } = request.body;

        const user = await connection('usuario')
        .where('email', email)
        .select('id','nome','tipo_usuario', 'email','razao_social','tipo_negocio','senha')
        .first();

        if(user) {
            const validPass = await bcrypt.compare(senha,user.senha)
            if(validPass){
                return response.json(user);
            }
        }

    }
}