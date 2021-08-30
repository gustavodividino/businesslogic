import React, { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import { useAppContext } from "../../context/MindmapContext";
import { api } from "../../services/api";

import { FormatNumber } from '../../utils/FormatNumber'

export function Businesslogic() {

  const { ambiente, businesslogic } = useAppContext();
  const [businesslogicInfo, setBusinesslogicInfo] = useState([]);
  const [portalsAssociation, setPortalsAssociation] = useState([]);

  useEffect(() => {
    async function loadBusinesslogicInfo() {

      let response = await api.get(
        "businesslogic/filter?ambiente=" + ambiente + "&businesslogic=" + businesslogic
      );
      setBusinesslogicInfo(response.data);


      response = await api.get(
        "portal/filter/businesslogic?ambiente=" + ambiente + "&businesslogic=" + businesslogic
      );
      setPortalsAssociation(response.data);
    }
    loadBusinesslogicInfo();
  }, [businesslogic]);


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
          {businesslogicInfo.map((row: any) => (
            <tbody>
              <tr>
                <th>Ambiente</th>
                <td>{row.ambiente}</td>
              </tr>
              <tr>
                <th>Nome</th>
                <td>{row.businesslogic}</td>
              </tr>
              <tr>
                <th>Descrição</th>
                <td><div className={styles.infoTeste} title={row.description}>
                  {row.description}
                </div></td>
              </tr>
            </tbody>
          ))}
        </table>
      </section>

      <section className={styles.detailPortal}>
        <table className={styles.detailPortal__table}>
          <thead>
            <tr>
              <th colSpan={3} className={styles.titleTable}>
                Portais Associados
              </th>
            </tr>
          </thead>

          {portalsAssociation.map((row: any) => (
            <tbody>
              <tr>
                <th>Ambiente</th>
                <td>{row.ambiente}</td>
              </tr>
              <tr>
                <th>System</th>
                <td>{row.system}</td>
              </tr>
              <tr>
                <th>Portal</th>
                <td>{row.portal}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{row.status}</td>
              </tr>
              <tr>
                <th>IRPT CDRs/Dia</th>
                <td><FormatNumber format="0.00a" >{row.cdrs}</FormatNumber></td>
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
