import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { z } from "zod"

const prisma = new PrismaClient()
const router = Router()

// Validação para adicionar item ao carrinho
const carrinhoSchema = z.object({
  consumidor_id: z.number(),
  mercadoria_id: z.number(),
})

// GET /carrinho/:consumidorId - listar itens do carrinho de um consumidor
router.get("/:consumidorId", async (req, res) => {
  const { consumidorId } = req.params
  try {
    const carrinho = await prisma.carrinho.findMany({
      where: { consumidor_id: Number(consumidorId) },
      include: {
        mercadoria: {
          include: {
            fotos: true,
            feirante: true
          }
        }
      },
      orderBy: { id: 'desc' }
    })
    res.status(200).json(carrinho)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// POST /carrinho/ - adicionar item ao carrinho
router.post("/", async (req, res) => {
  const valida = carrinhoSchema.safeParse(req.body)
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error })
  }
  try {
    const carrinho = await prisma.carrinho.create({
      data: valida.data
    })
    res.status(201).json(carrinho)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// DELETE /carrinho/:id - remover item do carrinho
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const itemRemovido = await prisma.carrinho.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(itemRemovido)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router
