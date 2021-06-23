const connection = require('../database/connection');

module.exports = {
    async getAllPostsByOng(request, response){
        const ong_id = request.headers.authorization;

        const posts = await connection('projeto').where('ong_id', ong_id).select('*');

        return response.json(posts);
    }
}