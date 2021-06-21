import React, { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import { useAppContext } from "../../context/MindmapContext";
import { api } from "../../services/api";


export function Output() {
  const { ambiente, systemOutput, portalOutput, mindmap, addBreadcrumb } = useAppContext();
  const [outputPortal, setOutputPortal] = useState([]);
  const [recollectPortals, setRecollectPortals] = useState([]);

  useEffect(() => {
    async function loadPortalInfo() {
      let response = await api.get(
        "portal/filter?ambiente=" +
        ambiente +
        "&system=" +
        systemOutput +
        "&portal=" +
        portalOutput
      );
      setOutputPortal(response.data);

      response = await api.get(
        "portal/recollect?systemportal=" + systemOutput + "|" + portalOutput
      );

      setRecollectPortals(response.data);
    }
    loadPortalInfo();
  }, [systemOutput, portalOutput]);

  function handleOpenFluxo(businesslogic : string, ambiente : string){
    const blogic = {
      "ambiente" : ambiente,
      "businesslogic" : businesslogic
    }
    mindmap(blogic);
    addBreadcrumb(blogic);
  }

  return (
    <div className={styles.infoPortal}>
      <section className={styles.detailPortal}>
        <table className={styles.detailPortal__table}>
          <thead>
            <tr>
              <th colSpan={3} className={styles.titleTable}>
                Informações
              </th>
            </tr>
          </thead>
          {outputPortal.map((row: any) => (
            <tbody key={row.ambiente + "|" + row.system + "|" + row.portal}>
              <tr>
                <th>Ambiente</th>
                <td>{row.ambiente}</td>
              </tr>
              <tr>
                <th>System|Portal</th>
                <td>{row.system + "|" + row.portal}</td>
              </tr>
              <tr>
                <th>Server</th>
                <td>{row.server}</td>
              </tr>
              <tr>
                <th>Path</th>
                <td><div className={styles.infoTeste} title={row.path}>
                  {row.path}
                </div></td>
              </tr>
              <tr>
                <th>Script</th>
                <td>{row.script}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </section>

      <section className={styles.detailPortal}>
        <table className={styles.detailPortal__table}>
          <thead>
            <tr>
              <th colSpan={4} className={styles.titleTable}>
                Recoletas
              </th>
            </tr>
          </thead>

          {recollectPortals.map((row: any) => (
            <tbody key={row.ambiente + "|" + row.system + "|" + row.portal}>
              <tr>
                <th>Ambiente</th>
                <td>{row.ambiente}</td>
              </tr>
              <tr>
                <th>System|Portal</th>
                <td>{row.system + "|" + row.portal}</td>
              </tr>
              <tr>
                <th>Server</th>
                <td>{row.server}</td>
              </tr>
              <tr>
                <th>BusinessLogic</th>
                <td>{row.businesslogic}
                  <button className={styles.button} onClick={() => handleOpenFluxo(row.businesslogic, row.ambiente)}>Abrir fluxo</button>
                </td>
              </tr>
              <tr className={styles.firstLine}>
                <th></th>
                <td></td>
              </tr>
            </tbody>
          ))}
        </table>
      </section>
    </div>
  );
}
