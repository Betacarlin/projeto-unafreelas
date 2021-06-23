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
    }
};