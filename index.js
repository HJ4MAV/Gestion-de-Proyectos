
require('./infraestructura/conectionDB')
const { validarToken, admin, estudiante } = require('./middleware/authjwt')
const jwt = require('jsonwebtoken')

const typeDefs = require('./typeDef')
const resolvers = require('./resolver')
const authRoute = require('./routes/auth.routes')

const express = require('express')
const { ApolloServer } = require('apollo-server-express')

const key = 'CLAVEDIFICIL';

const iniciarServidor = async () => {
    const api = express();
    const apollo = new ApolloServer(
        {
            typeDefs,
            resolvers,
            context: (ctx) => {
                
                const token = ctx.req.headers.authorization;
                try {
                    const perfil = jwt.verify(token, key)
                    if (perfil) {
                        return {rol: perfil.rolesito}
                    }
                } catch (error) {
                    console.error(error)
                }
                return ctx
            }
        });
    await apollo.start()
    apollo.applyMiddleware({ app: api })
    /*api.use((request, response) => {
        response.send('Hola')
    })*/
    api.use(express.json())  //PARA TRABAJAR CON JSON
    api.use('/api', authRoute)
    api.get('/api/dashboard/admin', [validarToken, admin], (request, response) => {
        response.json("Soy el dashboard")
    })

    api.get('/api/dashboard/estudiante', [validarToken, estudiante], (request, response) => {
        response.json("Soy el dashboard")
    })
    api.listen('9092', () => console.log('Inicio server'))
}
iniciarServidor()