'use client'
// import { CardMercadoria } from "@/components/CardMercadoria";
import { CardMercadoria } from "../app/componentes/CardMercadorias";
// import { InputPesquisa } from "@/components/InputPesquisa";
import { InputPesquisa } from "../app/componentes/InputPesquisa";
// import { MercadoriaItf } from "@/utils/types/MercadorisItf";
import { MercadoriaItf } from "../app/utils/types/MercadoriaItf";
import { useEffect, useState } from "react";

export default function Home() {
  const [mercadorias, setMercadoria] = useState<MercadoriaItf[]>([])

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/mercadorias`)
      const dados = await response.json()
      console.log(dados)
      setMercadoria(dados)
    }
    buscaDados()
  }, [])

  const listaMercadorias = mercadorias.map( mercadoria => (
    <CardMercadoria data={mercadoria} key={mercadoria.id} />
  ))

  return (
    <>
      <InputPesquisa setMercadorias={setMercadoria} />
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Mercadorias <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">em destaque</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"> 
          {/* grid-cols-1 => para tela pequena, celular -- sm:grid-cols-2 => para tela média, tablets -- md:grid-cols-3 => para telas maiores, pc e etc */}
          {listaMercadorias}
        </div>
      </div>
    </>
  );
}
