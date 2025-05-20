'use client'
import { MercadoriaItf } from "@/utils/types/MercadoriaItf";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/ClienteContext"; // IMPORTE seu contexto de cliente
import { toast } from "sonner";

export default function Detalhes() {
  const params = useParams()
  const { cliente } = useClienteStore() // pegando cliente logado

  const [mercadoria, setMercadoria] = useState<MercadoriaItf>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/mercadorias/${params.mercadoria_id}`)
      const dados = await response.json()
      setMercadoria(dados)
    }
    buscaDados()
  }, [params.mercadoria_id])

  async function adicionaCarrinho() {
    if (!cliente?.id) {
      toast.error("Você precisa estar logado para adicionar ao carrinho.")
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        clienteId: cliente.id,
        mercadoriaId: Number(params.mercadoria_id),
        descricao: `Compra da mercadoria: ${mercadoria?.nome ?? ''}`
      })
    })

    if (response.status === 201) {
      toast.success("Mercadoria adicionada ao carrinho!")
    } else {
      toast.error("Erro ao adicionar ao carrinho.")
    }
  }

  const listaFotos = mercadoria?.fotos?.map(foto => (
    <div key={foto.id}>
      <img
        src={foto.url}
        alt={foto.descricao}
        title={foto.descricao}
        className="h-52 max-w-80 rounded-lg"
      />
    </div>
  ))

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        {mercadoria?.foto &&
          <>
            <img
              className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
              src={mercadoria.foto}
              alt="Foto da mercadoria"
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {mercadoria.nome} {mercadoria.categoria}
              </h5>
              <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
                Localização: {mercadoria.localizacao}
              </h5>
              <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
                Preço R$: {Number(mercadoria.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {mercadoria.categoria}
              </p>

              {/* Botão para adicionar ao carrinho */}
              <button
                onClick={adicionaCarrinho}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </>
        }
      </section>

      <div className="mt-4 md:max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {listaFotos}
      </div>
    </>
  )
}
