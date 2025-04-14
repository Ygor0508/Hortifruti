import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()
// const prisma = new PrismaClient({
//   log: [
//     {
//       emit: 'event',
//       level: 'query',
//     },
//     {
//       emit: 'stdout',
//       level: 'error',
//     },
//     {
//       emit: 'stdout',
//       level: 'info',
//     },
//     {
//       emit: 'stdout',
//       level: 'warn',
//     },
//   ],
// })

// prisma.$on('query', (e) => {
//   console.log('Query: ' + e.query)
//   console.log('Params: ' + e.params)
//   console.log('Duration: ' + e.duration + 'ms')
// })

const router = Router()

const consumidorSchema = z.object({
  nome: z.string().min(2,
    { message: "Nome deve possuir, no mínimo, 2 caracteres" }),

  email: z.string().email({
      message: "E-mail inválido"
    }),
  
  senha: z.string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
      .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula" })
      .regex(/[^A-Za-z0-9]/, { message: "A senha deve conter pelo menos um caractere especial" }),
  
  telefone: z.string()
      .regex(/^\d{10,11}$/, {
        message: "Telefone deve conter apenas números e ter entre 10 e 11 dígitos"
      }),
  
  endereco: z.string().min(2, {
      message: "Endereço deve possuir, no mínimo, 2 caracteres"
    }),
  })

router.get("/", async (req, res) => {
  try {
    const consumidor = await prisma.consumidor.findMany({
    
    })
    res.status(200).json(consumidor)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {

  const valida = consumidorSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome, email, senha, telefone, endereco } = valida.data

  try {
    const consumidor = await prisma.consumidor.create({
      data: {
        nome, email, senha, telefone, endereco
      }
    })
    res.status(201).json(consumidor)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const consumidor = await prisma.consumidor.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(consumidor)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = consumidorSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome, email, senha, telefone, endereco } = valida.data

  try {
    const consumidor = await prisma.consumidor.update({
      where: { id: Number(id) },
      data: {
        nome, email, senha, telefone, endereco
      }
    })
    res.status(200).json(consumidor)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params

  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        OR: [
          {
            consumidor: {
              nome: {
                contains: termo,
                mode: "insensitive"
              }
            }
          },
          {
            status: {
              contains: termo,
              mode: "insensitive"
            }
          },
          {
            tipo_entrega: {
              contains: termo,
              mode: "insensitive"
            }
          }
        ]
      },
      include: {
        consumidor: true,
        pedidosMercadorias: {
          include: {
            mercadoria: true
          }
        },
        motoboy: true
      }
    })

    res.status(200).json(pedidos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao buscar pedidos." })
  }
})
//   try {
//     const consumidor = await prisma.consumidor.findMany({
//       where: {
//         OR: [
//           {
//             nome: {
//               contains: termo,
//               mode: "insensitive"
//             }
//           },
//           {
//             localizacao: {
//               contains: termo,
//               mode: "insensitive"
//             }
//           }
//         ]
//       }
//     })
//     res.status(200).json(feirantes)
//   } catch (error) {
//     res.status(500).json({ erro: error })
//   }
// })

// Rota de Consulta de consumidor pelo Id, retorna um OBJETO, não um ARRAY
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const consumidor = await prisma.consumidor.findUnique({
      where: { id: Number(id)},
    })
    res.status(200).json(consumidor)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
