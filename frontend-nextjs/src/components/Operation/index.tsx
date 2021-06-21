import React, { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import { useAppContext } from "../../context/MindmapContext";
import { api } from "../../services/api";

export function Operation() {
    const { ambiente, operation, mindmap, addBreadcrumb } = useAppContext();

    const [operationsList, setOperationsList] = useState([]);
    const [association, setAssociation] = useState([]);

    useEffect(() => {
        async function loadOperationInfo() {
            let response = await api.get(
                "operation/filter?ambiente=" +
                ambiente +
                "&operation=" +
                operation
            );
            setOperationsList(response.data);
            response = await api.get("operation/filter/script/association?ambiente=" + ambiente + "&operation=" + operation);
            setAssociation(response.data);
        }
        loadOperationInfo();
    }, [operation]);

    function handleOpenFluxo(businesslogic: string, ambiente: string) {
        console.log(businesslogic + ambiente);
        const blogic = {
            "ambiente": ambiente,
            "businesslogic": businesslogic
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
                    {operationsList.map((row: any) => (
                        <tbody key={row.ambiente + "_" + row.operation}>
                            <tr>
                                <th>Ambiente</th>
                                <td>{row.ambiente}</td>
                            </tr>
                            <tr>
                                <th>Nome</th>
                                <td>{row.operation}</td>
                            </tr>

                            <tr>
                                <th>Descrição</th>
                                <td>{row.description}</td>
                            </tr>
                            <tr>
                                <th>Script</th>
                                <td>{row.script}</td>
                            </tr>
                            <tr>
                                <th>Script Desc.</th>
                                <td><div className={styles.infoTeste} title={row.scriptDescription}>
                                    {row.scriptDescription}
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
                            <th colSpan={4} className={styles.titleTable}>
                                Associações ao Script
                            </th>
                        </tr>
                    </thead>
                    {association.map((row: any) => (
                        <tbody key={row.ambiente + "|" + row.system + "|" + row.portal + "|" + row.businesslogic}>
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
                                <th>Operator</th>
                                <td>{row.operator}</td>
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
