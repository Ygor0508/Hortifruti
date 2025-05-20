import { PrismaClient, Status, Tipo_entrega } from "@prisma/client"
import { Router } from "express"
import { z } from "zod"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()
const router = Router()

// Validação de criação de pedido
const pedidoSchema = z.object({
  consumidor_id: z.number(),
  mercadoria_id: z.number(),
  status: z.nativeEnum(Status),
  tipo_entrega: z.nativeEnum(Tipo_entrega),
  motoboy_id: z.number().optional(),
})

// GET /pedido/ — listar todos os pedidos
router.get("/", async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: { consumidor: true, mercadoria: true },
      orderBy: { id: 'desc' }
    })
    res.status(200).json(pedidos)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// POST /pedido/ — criar novo pedido
router.post("/", async (req, res) => {
  const valida = pedidoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }
  try {
    const pedido = await prisma.pedido.create({
      data: valida.data
    })
    res.status(201).json(pedido)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// Função de envio de e-mail para atualização de status do pedido
async function enviaEmailPedido(
  nome: string,
  email: string,
  mercadoria: string,
  status: string
) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: "968f0dd8cc78d9",
      pass: "89ed8bfbf9b7f9"
    }
  })

  const info = await transporter.sendMail({
    from: 'no-reply@seusistema.com',
    to: email,
    subject: `Atualização do seu pedido: ${mercadoria}`,
    text: `Olá ${nome},\n\nSeu pedido da mercadoria "${mercadoria}" agora está com status: ${status}.`,
    html: `
      <h3>Olá, ${nome}</h3>
      <p>Sua mercadoria: <strong>${mercadoria}</strong></p>
      <p>Status do pedido: <strong>${status}</strong></p>
      <p>Obrigado por comprar conosco!</p>
    `
  })

  console.log("E-mail enviado: %s", info.messageId)
}

// PATCH /pedido/:id — atualizar status e/ou motoboy, e enviar e-mail
router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { status, motoboy_id } = req.body

  if (!status) {
    res.status(400).json({ erro: "Informe o novo status do pedido" })
    return
  }

  try {
    // Atualiza o pedido
    const pedido = await prisma.pedido.update({
      where: { id: Number(id) },
      data: {
        status,
        motoboy_id: motoboy_id ?? undefined
      }
    })

    // Busca dados para envio de e-mail
    const dados = await prisma.pedido.findUnique({
      where: { id: Number(id) },
      include: {
        consumidor: true,
        mercadoria: true
      }
    })

    if (dados) {
      await enviaEmailPedido(
        dados.consumidor.nome as string,
        dados.consumidor.email as string,
        dados.mercadoria.nome as string,
        status
      )
    }

    res.status(200).json(pedido)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// GET /pedido/:consumidorId — pedidos de um consumidor
router.get("/:consumidorId", async (req, res) => {
  const { consumidorId } = req.params
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { consumidor_id: Number(consumidorId) },
      include: { mercadoria: true }
    })
    res.status(200).json(pedidos)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// DELETE /pedido/:id — remover pedido
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const pedido = await prisma.pedido.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(pedido)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router
