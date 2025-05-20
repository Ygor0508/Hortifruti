export interface ConsumidorItf {
  id: number
  nome: string
  email: string
  senha: string
  telefone: string
  endereco: string
  createdAt: string  // DateTime no Prisma, aqui string ISO
  updatedAt: string
  codigoRecuperacao?: string | null
  // Não incluí pedidos para evitar referência circular direta
}
