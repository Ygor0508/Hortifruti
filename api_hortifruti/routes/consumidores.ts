import { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

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
    const consumidores = await prisma.consumidor.findMany({
      where: {
        OR: [
          {
              nome: {
                contains: termo,
                mode: "insensitive"
              }
          },
          {
            endereco: {
              contains: termo,
              mode: "insensitive"
            }
          },
          {
            telefone: {
              contains: termo,
              mode: "insensitive"
            }
          }
        ]
      }
    })

    res.status(200).json(consumidores)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: error })
  }
})

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

// 1) Solicitar código de recuperação
router.post("/solicitar-recuperacao", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({ error: "Email é obrigatório" });

      const consumidor = await prisma.consumidor.findUnique({
        where: { email },
      });
      if (!consumidor)
        return res
          .status(404)
          .json({ error: "Consumidor não encontrado" });

      // Gera um código numérico de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await prisma.consumidor.update({
        where: { email },
        data: { codigoRecuperacao: code },
      });

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Código de recuperação de senha",
        text: `Use este código para recuperar sua senha: ${code}`,
      });

      return res.json({
        message: "Código de recuperação enviado para seu email",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }
);

// 2) Alterar senha usando código de recuperação
router.post(
  "/alterar-senha",
  async (req: Request, res: Response) => {
    try {
      const {
        email,
        codigoRecuperacao,
        novaSenha,
        confirmarSenha,
      } = req.body;
      if (
        !email ||
        !codigoRecuperacao ||
        !novaSenha ||
        !confirmarSenha
      ) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios" });
      }
      if (novaSenha !== confirmarSenha) {
        return res
          .status(400)
          .json({ error: "As senhas não coincidem" });
      }

      const consumidor = await prisma.consumidor.findUnique({
        where: { email },
      });
      if (
        !consumidor ||
        consumidor.codigoRecuperacao !== codigoRecuperacao
      ) {
        return res
          .status(400)
          .json({ error: "Código de recuperação inválido" });
      }

      const hash = await bcrypt.hash(novaSenha, 10);
      await prisma.consumidor.update({
        where: { email },
        data: { senha: hash, codigoRecuperacao: null },
      });

      return res.json({ message: "Senha alterada com sucesso" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }
);

export default router
