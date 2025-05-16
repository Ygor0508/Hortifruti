"use client"
// import { MercadoriaItf } from "@/utils/types/MercadoriaItf";
import { MercadoriaItf } from "../../utils/types/MercadoriaItf";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function Detalhes() {
  const params = useParams()

  const [mercadoria, setMercadoria] = useState<MercadoriaItf>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/mercadorias/${params.mercadoria_id}`)
      const dados = await response.json()
      // console.log(dados)
      setMercadoria(dados)
    }
    buscaDados()
  }, [])

  const listaFotos = mercadoria?.fotos.map( fotos_mercadoria => (
      <div key={fotos_mercadoria.id}>
          <img>
            src={fotos_mercadoria.url} 
            alt={fotos_mercadoria.descricao}
            title={fotos_mercadoria.descricao}
            className="h-52 max-w-80 rounded lg"
          </img>
      </div>
  ))

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          
          {mercadoria?.foto &&
          // para não ficar o icone de foto carregando quando clicasse no ver detalhes
            <>
          <img className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
            src={mercadoria?.foto} alt="Foto da mercadoria" />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {mercadoria?.nome} {mercadoria?.categoria}
            </h5>
            <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
              preco: {mercadoria?.preco} - {mercadoria?.localizacao}
            </h5>
            <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
              Preço R$: {Number(mercadoria?.preco)
                .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {mercadoria?.categoria}
            </p>
          </div> 
            </> }
        </section>

        < div className="mt-4 md:max-w-5xl mx-auto rid grid-cols-2 md:grid-cols-3 gap-4">
        {listaFotos}
        </div>
    </>
  )
}
