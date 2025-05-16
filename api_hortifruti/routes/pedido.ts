import { PrismaClient, Status, Tipo_entrega } from "@prisma/client"
import { Router } from "express"
import { z } from 'zod'
import nodemailer from "nodemailer"

const prisma = new PrismaClient()
const router = Router()

const pedidoSchema = z.object({
  quantidade: z.number(),
  status: z.nativeEnum(Status),
  Tipo_entrega: z.nativeEnum(Tipo_entrega),
  consumidor: z.string(),
  mercadoria: z.string(),
  
})

router.get("/", async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        mercadoria: true,
        consumidor: true,
      },
      orderBy: { id: 'desc'}
    })
    res.status(200).json(pedidos)
  } catch (error) {
    res.status(400).json(error)
  }
})


// Cadsstro de pedido de mercadoria

router.post("/", async (req, res) => {

  const valida = pedidoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }  
  const { pedido, mercadoria, quantidade } = valida.data

  try {
    const pedido = await prisma.pedido.create({
      data: { pedido, mercadoria, quantidade }
    })
    res.status(201).json(pedido_mercadoria)
  } catch (error) {
    res.status(400).json(error)
  }
})

async function enviaEmail(nome: string, email: string,
  descricao: string, resposta: string) {

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: "968f0dd8cc78d9",
      pass: "89ed8bfbf9b7f9"
    }
  });

  const info = await transporter.sendMail({
    from: 'edeciofernando@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Re: Proposta Revenda Herbie", // Subject line
    text: resposta, // plain text body
    html: `<h3>Estimado Cliente: ${nome}</h3>
           <h3>Proposta: ${descricao}</h3>
           <h3>Resposta da Revenda: ${resposta}</h3>
           <p>Muito obrigado pelo seu contato</p>
           <p>Revenda Herbie</p>`
  });

  console.log("Message sent: %s", info.messageId);
}

router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { resposta } = req.body

  if (!resposta) {
    res.status(400).json({ "erro": "Informe a resposta desta proposta" })
    return
  }

  try {
    const proposta = await prisma.proposta.update({
      where: { id: Number(id) },
      data: { resposta }
    })

    const dados = await prisma.proposta.findUnique({
      where: { id: Number(id) },
      include: {
        cliente: true
      }
    })

    enviaEmail(dados?.cliente.nome as string,
      dados?.cliente.email as string,
      dados?.descricao as string,
      resposta)

    res.status(200).json(proposta)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params
  try {
    const propostas = await prisma.proposta.findMany({
      where: { clienteId },
      include: {
        carro: {
          include: {
            marca: true
          }
        }
      }
    })
    res.status(200).json(propostas)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const proposta = await prisma.proposta.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(proposta)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router