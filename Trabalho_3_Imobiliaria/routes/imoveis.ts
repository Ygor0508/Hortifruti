import { PrismaClient, Tipo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { verificaToken } from '../middlewares/verificaToken'
import { verificaNivel } from '../middlewares/verificaNivel'

const prisma = new PrismaClient()
const router = Router()

const imovelSchema = z.object({
  cidade: z.string(),
  endereco: z.string().min(3,
    { message: "Endereço deve ter, no mínimo, 3 caracteres" }),
  bairro: z.string().min(3,
    { message: "Endereço deve ter, no mínimo, 3 caracteres" }),
  tamanho: z.string().optional(),
  quarto: z.number().min(1,
    {message: "O imóvel deve possuir no mínimo 1 quarto"}),
  banheiro: z.number().min(1,
    {message: "O imóvel deve possuir no mínimo 1 banheiro"}),
  garagem: z.number().optional(),
  preco: z.number().positive(
    { message: "Preço não pode ser negativo" }),
  tipo: z.nativeEnum(Tipo).optional(),
  usuarioId: z.number()
})

router.get("/", async (req, res) => {
  try {
    const imoveis = await prisma.imovel.findMany({
      orderBy: { id: 'desc' },
      
    })
    res.status(200).json(imoveis)
  } catch (error) {
    res.status(500).json({erro: error})
  }
})

router.get("/imoveisArquivados", async (req, res) => {
  try {
    const imoveisArquivados = await prisma.imovelArquivado.findMany({
      orderBy: { id: 'desc' },
      
    })
    res.status(200).json(imoveisArquivados)
  } catch (error) {
    res.status(500).json({erro: error})
  }
})

router.post("/", verificaToken, verificaNivel(3), async (req, res) => {
  const valida = imovelSchema.safeParse(req.body);
  if (!valida.success) {
    res.status(400).json({ erro: valida.error });
    return;
  }

  try {
    const imovel = await prisma.imovel.create({
      data: valida.data,
    });
    res.status(201).json(imovel);
  } catch (error) {
    res.status(400).json({ error });
  }
});


router.delete("/:id", verificaToken, verificaNivel(3), async (req: any, res) => {
  const { id } = req.params;

  try {
    const excluido = await prisma.imovel.findUnique({
      where: { id: Number(id) },
    });

    if (excluido) {
      await prisma.imovelArquivado.create({
        data: { ...excluido, usuarioId: req.userLogadoId },
      });
    }

    const imovel = await prisma.imovel.delete({
      where: { id: Number(id) },
    });

    await prisma.log.create({
      data: {
        descricao: `Exclusão do Imóvel: ${id}`,
        complemento: `Funcionário: ${req.userLogadoNome}`,
        usuarioId: req.userLogadoId,
      },
    });

    res.status(200).json(imovel);
  } catch (error) {
    res.status(400).json({ erro: error });
  }
});


router.put("/:id", verificaToken, verificaNivel(2), async (req, res) => {
  const { id } = req.params

  const valida = imovelSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  try {
    const imovel = await prisma.imovel.update({
      where: { id: Number(id) },
      data: valida.data
    })
    res.status(201).json(imovel)
  } catch (error) {
    res.status(400).json({ error })
  }
})


router.patch("/:id", verificaToken, verificaNivel(2), async (req, res) => {
  const { id } = req.params

  const partialImovelSchema = imovelSchema.partial()

  const valida = partialImovelSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  try {
    const imovel = await prisma.imovel.update({
      where: { id: Number(id) },
      data: valida.data
    })
    res.status(201).json(imovel)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get("/pesquisa/:cidade", async (req, res) => {
  const { cidade } = req.params
  try {
    const imoveis = await prisma.imovel.findMany({
      where: { cidade: { contains: cidade } }
    })
    res.status(200).json(imoveis)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

export default router
