const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { email, senha } = request.body;

        const user = await connection('usuario')
        .where('email', email)
        .andWhere('senha', senha)
        .select('id','nome','tipo_usuario', 'email')
        .first();

        if(!user) {
            return response.status(400).json({ error: 'Usuario não encontrado para essas credenciais'});
        }

        return response.json(user);
    }
}