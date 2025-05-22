'use client'
import './page.css'
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/ClienteContext";
import { PedidoItf } from "@/utils/types/PedidoItf";
import { toast } from 'sonner';

type Inputs = {
  descricao: string
}

export default function Pedido() {
  // const params = useParams()

  const [pedido, setPedido] = useState<PedidoItf[]>([])
  const { cliente } = useClienteStore()

  // const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${cliente.id}`)
      const dados = await response.json()
      setPedido(dados)
    }
    buscaDados()
  }, [])


  // para retornar apenas a data do campo no banco de dados
  // 2024-10-10T22:46:27.227Z => 10/10/2024
  function dataDMA(data: string) {
    const ano = data.substring(0, 4)
    const mes = data.substring(5, 7)
    const dia = data.substring(8, 10)
    return dia + "/" + mes + "/" + ano
  }

  const pedidoTable = pedido.map(pedido => (
    <tr key={pedido.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <p><b>{pedido.mercadoria.nome} <br/> 
          {pedido.mercadoria.categoria}</b></p>
        <p className='mt-3'>
          R$: {Number(pedido.mercadoria.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
      </th>
      <td className="px-6 py-4">
        <img src={pedido.mercadoria.foto} className="fotoMercadoria" alt="Foto Mercadoria" />
      </td>
      <td className="px-6 py-4">
        <p><b>{pedido.mercadoria_Id}</b></p>
        <p><i>{pedido.mercadoria.quantidade}</i></p>
      </td>
      <td className="px-6 py-4">
        {pedido.status ?
          <>
            <p><b>{pedido.status}</b></p>
            <p><i>Entregue em: {dataDMA(pedido.updatedAt as string)}</i></p>
          </>
          :
          <i>Aguardando...</i>}
      </td>
    </tr>
  ))

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Listagem de <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Meus Pedidos</span></h1>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nome
            </th>
            <th scope="col" className="px-6 py-3">
              Foto
            </th>
            <th scope="col" className="px-6 py-3">
              Quantidade
            </th>
            <th scope="col" className="px-6 py-3">
              Categoria
            </th>
          </tr>
        </thead>
        <tbody>
          {pedidoTable}
        </tbody>
      </table>
    </section>
  )
}