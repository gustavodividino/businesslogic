import React, { useState, useCallback, useEffect } from "react";

import { useAppContext } from "../../context/MindmapContext";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

import ReactFlow, {
  ReactFlowProvider,
  isNode,
  Controls,
} from "react-flow-renderer";
import dagre from "dagre";

import styles from "./styles.module.scss";

import initialElements from "./initial-elements";

import { api } from "../../services/api";

export function Mindmap() {
  const {
    ambiente,
    businesslogic,
    output,
    operationInfo,
    businesslogicInfo,
    breadcrumb,
    mindmap,
    historyBreadcrumb,
  } = useAppContext();
  const [systemOutput, setSystemOutput] = useState("");
  const [portalOutput, setPortalOutput] = useState("");

  function handleClick(element) {
    const blogic = {
      ambiente: element.ambiente,
      businesslogic: element.businesslogic,
    };
    mindmap(blogic);
    historyBreadcrumb(blogic);
  }

  /* Configuracao do MindMap */

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 15;

  const getLayoutedElements = (elements) => {
    dagreGraph.setGraph({ rankdir: "LR" });

    elements.forEach((el) => {
      if (isNode(el)) {
        dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
      } else {
        dagreGraph.setEdge(el.source, el.target);
      }
    });

    dagre.layout(dagreGraph);

    return elements.map((el) => {
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);
        el.targetPosition = "left";
        el.sourcePosition = "right";
        el.position = {
          x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
      }

      return el;
    });
  };

  /* Cria a variavel elements que ira receber as informacoes do mindmap para formatacao */
  const [elements, setElements] = useState(
    getLayoutedElements(initialElements)
  );
  /* Fim - Cria a variavel elements que ira receber as informacoes do mindmap para formatacao */

  /* Recria o MindMap usando CallBack usado sempre que a variavel elements for alterada */
  useCallback(
    (direction) => {
      setElements(getLayoutedElements(elements, direction));
    },
    [elements]
  );
  /* Fim - Recria o MindMap usando CallBack usado sempre que a variavel elements for alterada */

  /* Carga do MindMap sempre que a variavel mindmap for alterado */
  useEffect(() => {
    async function loadMindMap() {
      const response = await api.get(
        "createbusinesslogic?businessLogic=" +
          businesslogic +
          "&ambiente=" +
          ambiente
      );

      setElements(getLayoutedElements(response.data));
    }
    loadMindMap();
  }, [businesslogic]);

  const onElementClick = (event, element) => {
    const tipoElemento = element.type;

    if (tipoElemento == "output" && element.id.indexOf("TERM-") == -1) {
      setSystemOutput(element.id.split("|")[0]);
      setPortalOutput(element.id.split("|")[1]);
      output(element.id.split("|")[0], element.id.split("|")[1]);
    } else if (tipoElemento == "default") {
      operationInfo(element.id);
    } else if (tipoElemento == "input") {
      businesslogicInfo(element.id);
    }
  };


  /*
  TESTE ADD NODE


const addNode = useCallback(() => {
    const newNode = {
      id: `randomnode_${+new Date()}`,
      data: { label: 'Added node' },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setElements((elements) => elements.concat(newNode));
  }, [elements]);
  <button onClick={addNode}>Add New Node</button>
*/

  return (
    <div>
      <div className={styles.navigation}>
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumb.map((element) => (
            <Link
              color="inherit"
              onClick={() => handleClick(element)}
              key={element}
            >
              {element.businesslogic}
            </Link>
          ))}
        </Breadcrumbs>
      </div>
      <div className={styles.mindmap}>
        <ReactFlowProvider>
          <ReactFlow
            elements={elements}
            onElementClick={onElementClick}
            connectionLineType="smoothstep"
            defaultZoom={1.5}
          />
          <Controls
            showInteractive={false}
            showFitView={true}
            showZoom={false}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
