import React from "react";

import { Header } from "../components/Header";
import { Filter } from "../components/Filter";
import { Mindmap } from "../components/Mindmap";

import { api } from "../services/api";
import { Output } from "../components/Output";
import { Operation } from "../components/Operation";
import { Businesslogic } from "../components/Businesslogic";
 

import { useAppContext } from "../context/MindmapContext";


type Ambiente = {
  id: string;
  name: string;
};

type Portal = {
  id: string;
  ambiente: string;
  system: string;
  portal: string;
  type: string;
  businesslogic: string;
  path: string;
  server: string;
  recollect: string;
};

type BusinessLogic = {
  id: string;
  ambiente: string;
  businesslogic: string;
  status: string;
  description: string;
};

type HomeProps = {
  ambientes: Ambiente[];
  portais: Portal[];
  businesslogics: BusinessLogic[];
};

export default function Home(props: HomeProps) {

  const { isOutput, isOperation, isBusinessLogic } = useAppContext();


  return (
    <div style={{ display: "flex", flexDirection: "column", }} >

      <Header />

      <Filter
        {...props}
      />

      <div style={{ display: "flex", flexDirection: "row", marginLeft: "8px" }} >
        <div style={{ width: "79%" }} >
          <Mindmap />
        </div>
        <div style={{ width: "20%", background: "#fff", marginLeft: "5px" }} >
          {
            isOutput && (
              <Output />
            )
          }

          {
            isOperation && (
              <Operation />
            )
          }

          {
            isBusinessLogic && (
              <Businesslogic />
            )
          }
        </div>
      </div>
    </div>
  )
}


/**
 * Faz a requisição de informações de Ambientes, Portais and BusinessLogic
 */
export async function getStaticProps() {

  const ambientes = await api.get("ambiente");
  const portais = await api.get("portal");
  const businesslogics = await api.get("businesslogic");


  return {
    props: {
      ambientes: ambientes.data,
      portais: portais.data,
      businesslogics: businesslogics.data
    },
    revalidate: (60 * 60 * 24), //revalidar a cada 24 horas
  }
}