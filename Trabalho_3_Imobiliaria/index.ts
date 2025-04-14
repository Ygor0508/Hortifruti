import express from 'express'
import routesImoveis from './routes/imoveis'
import routesUsuarios from './routes/usuarios'
import routesLogin from './routes/login'

const app = express()
const port = 3000

app.use(express.json())

app.use("/imoveis", routesImoveis)
app.use("/usuarios", routesUsuarios)
app.use("/login", routesLogin)

app.get('/', (req, res) => {
  res.send('API de Cadastro de Imoveis')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})