import { createContext, ReactNode, useContext, useState } from 'react';

type MindmapContextData = {
  mindmap: (businesslogic: BusinessLogic) => void;
  output: (systemOutput: string, portalOutput: string) => void;
  operationInfo: (p_operation: string) => void;
  businesslogicInfo: (p_businesslogic: string) => void;
  addBreadcrumb: (businesslogic: BusinessLogic) => void;
  historyBreadcrumb: (businesslogic: BusinessLogic) => void;
  clearBreadcrumb: () => void;
  ambiente: string;
  businesslogic: string;
  portalOutput: string;
  systemOutput: string;
  operation: string,
  isOutput: boolean,
  isOperation: boolean,
  isBusinessLogic: boolean,
  breadcrumb: BusinessLogic[];
};

type BusinessLogic = {
  ambiente: string;
  businesslogic: string;
}

/**
 * Export do Context para ser utilizada no projeto
 */
export const MindmapContext = createContext({} as MindmapContextData);

type MindmapContextProviderProps = {
  children: ReactNode;
};

/**
 * //Pega o conteudo(children) que está na TAG <MindmapProvider> para enviar no return
 * @param children 
 * @returns 
 */
export function MindmapProvider({ children }: MindmapContextProviderProps) {

  const [ambiente, setAmbiente] = useState("");
  const [businesslogic, setBusinesslogic] = useState("");
  const [portalOutput, setPortalOutput] = useState("");
  const [systemOutput, setSystemOutput] = useState("");
  const [operation, setOperation] = useState("");

  const [isOutput, setIsOutput] = useState(false);
  const [isOperation, setIsOperation] = useState(false);
  const [isBusinessLogic, setIsBusinessLogic] = useState(false);

  const [breadcrumb, setBreadcrumb] = useState([]);


  /**
   * Função para informar o Ambiente e Businesslogic do Mindmap
   * @param ambiente 
   * @param businesslogic 
   */
  function mindmap(businesslogic: BusinessLogic) {
    setAmbiente(businesslogic.ambiente);
    setBusinesslogic(businesslogic.businesslogic);
    setPortalOutput("");
    setSystemOutput("");

    setIsOperation(false);
    setIsOutput(false);
    setIsBusinessLogic(false);

  }

  function output(p_systemOutput: string, p_portalOutput: string) {
    setSystemOutput(p_systemOutput);
    setPortalOutput(p_portalOutput);
    setIsOutput(true);
    setIsOperation(false);
    setIsBusinessLogic(false);
  }

  function operationInfo(p_operation: string) {
    setOperation(p_operation);
    setIsOperation(true);
    setIsOutput(false);
    setIsBusinessLogic(false);
  }

  function businesslogicInfo(p_businesslogic: string) {
    setIsOperation(false);
    setIsOutput(false);
    setIsBusinessLogic(true);
  }


  /**
   * Adiciona um novo valor ao historico de navegação
   */
  function addBreadcrumb(businesslogic: BusinessLogic) {
    const result = breadcrumb.findIndex(blogic => blogic.businesslogic === businesslogic.businesslogic);
    if (result == -1) {
      breadcrumb.push(businesslogic);
    }

  }

  function historyBreadcrumb(businesslogic: BusinessLogic) {
    const result = breadcrumb.findIndex(blogic => blogic.businesslogic === businesslogic.businesslogic);
    breadcrumb.splice(result + 1, Number.MAX_VALUE);
  }

  /**
   * Limpa todo o array de navegação
   */
  function clearBreadcrumb() {
    breadcrumb.splice(0, Number.MAX_VALUE);
  }

  return (
    /**
     * Passa os valores de Ambiente, Businesslogic e a função para o contexto
     */
    <MindmapContext.Provider value={{ mindmap, operationInfo, businesslogicInfo, output, ambiente, businesslogic, portalOutput, systemOutput, breadcrumb, operation, isOutput, isOperation, isBusinessLogic, addBreadcrumb, clearBreadcrumb, historyBreadcrumb }}>
      {children}
    </MindmapContext.Provider>
  );

}

/**
 * Export do Context
 * @returns 
 */
export function useAppContext() {
  return useContext(MindmapContext);
}