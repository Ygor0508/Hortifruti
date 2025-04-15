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

const motoboySchema = z.object({
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
  
  veiculo: z.string().min(2, {
      message: "Localização deve possuir, no mínimo, 2 caracteres"
    }),
  modelo_Veiculo: z.string().min(2, {
    message: "Modelo do veículo de possuir, no minimo 2 caracteres"
    }),
  placa_Veiculo: z.string().min(7, {
    message: "Placa do veículo de possuir, 7 caracteres"
  }) 
  })

router.get("/", async (req, res) => {
  try {
    const motoboy = await prisma.motoboy.findMany({
    
    })
    res.status(200).json(motoboy)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {

  const valida = motoboySchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome, email, senha, telefone, veiculo, modelo_Veiculo, placa_Veiculo } = valida.data

  try {
    const motoboy = await prisma.motoboy.create({
      data: {
        nome, email, senha, telefone, veiculo, modelo_Veiculo, placa_Veiculo
      }
    })
    res.status(201).json(motoboy)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const motoboy = await prisma.motoboy.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(motoboy)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = motoboySchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome, email, senha, telefone, veiculo, modelo_Veiculo, placa_Veiculo } = valida.data

  try {
    const motoboy = await prisma.motoboy.update({
      where: { id: Number(id) },
      data: {
        nome, email, senha, telefone, veiculo, modelo_Veiculo, placa_Veiculo
      }
    })
    res.status(200).json(motoboy)
  } catch (error) {
    res.status(400).json({ error })
  }
})

// router.get("/pesquisa/:termo", async (req, res) => {
//   const { termo } = req.params;
//   const motoboy_id = req.query.motoboy_id
  
//   if (!motoboy_id) {
//     return res.status(400).json({ erro: "ID do motoboy é obrigatório" });
//   }
//   try {
//     const pedidos = await prisma.pedido.findMany({
//       where: {
//         motoboy_id: Number(motoboy_id),
//         OR: [
//           {
//             data_pedido: {
//               contains: termo,
//               mode: "insensitive"
//             }
//           },
//           {
//             status: {
//               contains: termo,
//               mode: "insensitive"
//             }
//           },
//           {
//             tipo_entrega: {
//               contains: termo,
//               mode: "insensitive"
//             }
//           }
//         ]
//       },
//       include: {
//         consumidor: true,
//         pedidosMercadorias: true
//       }
//   });
  
//   res.status(200).json(pedidos);
// } catch (error) {
//   res.status(500).json({ erro: "Erro ao buscar pedidos", detalhes: error.message });
// }
// });

// Rota de Consulta de motoboy pelo Id, retorna um OBJETO, não um ARRAY
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const motoboy = await prisma.motoboy.findUnique({
      where: { id: Number(id)},
    })
    res.status(200).json(motoboy)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
