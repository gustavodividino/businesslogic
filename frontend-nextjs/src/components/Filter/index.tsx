import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


import styles from './styles.module.scss';
import { useAppContext } from '../../context/MindmapContext';

type AmbienteData = {
    id: string;
    name: string;
};

type PortalData = {
    ambiente: string;
    system: string;
    portal: string;
    type: string;
    businesslogic: string;
    path: string;
    server: string;
    recollect: string;
};

type BusinessLogicData = {
    ambiente: string;
    businesslogic: string;
    status: string;
    description: string;
};

export function Filter(props) {

    const [ambiente, setAmbiente] = useState("");

    const [teste, setTeste ] = useState("ATLYS3");

    const { mindmap, clearBreadcrumb, addBreadcrumb } = useAppContext();

    return (
        <div className={styles.filters}>

            <Autocomplete
                className={styles.autocomplete}
                options={props.ambientes}
                getOptionLabel={(option: AmbienteData) => option.name}
                id="ambiente"
                renderInput={(params) => <TextField {...params} label="Escolha um Ambiente" margin="normal" />}
                onChange={(event: any, newValue: AmbienteData | null) => {
                    if(newValue != null)
                        setAmbiente(newValue.id);
                    else
                        setAmbiente("");
                }}
            />

            <Autocomplete
                className={styles.autocomplete}
                options={ambiente == "" ? props.portais : props.portais.filter((objeto: PortalData) => objeto.ambiente === ambiente)}
                getOptionLabel={(option: PortalData) => option.system + "|" + option.portal}
                groupBy={(option: PortalData) => option.ambiente}
                id="portal"
                renderInput={(params) => <TextField {...params} label="System | Portal" margin="normal" />}
                onChange={(event: any, newValue: PortalData | null) => {
                    //setPortal(newValue);
                    if (newValue != null) {
                        const blogic = {
                            "ambiente": newValue.ambiente,
                            "businesslogic": newValue.businesslogic
                        }
                        mindmap(blogic);
                        clearBreadcrumb();
                        addBreadcrumb(blogic);
                    }
                }}

            />

            <Autocomplete
                className={styles.autocomplete}
                options={ambiente == "" ? props.businesslogics : props.businesslogics.filter((objeto: PortalData) => objeto.ambiente === ambiente)}
                getOptionLabel={(option: BusinessLogicData) => option.businesslogic}
                groupBy={(option: BusinessLogicData) => option.ambiente}
                id="businesslogic"
                renderInput={(params) => <TextField {...params} label="BusinessLogics" margin="normal" />}
                onChange={(event: any, newValue: BusinessLogicData | null) => {
                    //setBusinessLogic(newValue);
                    if (newValue != null) {
                        const blogic = {
                            "ambiente": newValue.ambiente,
                            "businesslogic": newValue.businesslogic
                        }
                        mindmap(blogic);
                        clearBreadcrumb();
                        addBreadcrumb(blogic);
                    }
                }}
            />

        </div>

    )
}