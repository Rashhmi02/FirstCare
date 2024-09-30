// src/Modules/branch/component/Pages/MedicineContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../config';

const MedicineContext = createContext();

const MedicineProvider = ({ children }) => {
    const host = config.host;
    const [medicine, setMedicine] = useState([]);

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));
        axios.get(`${host}/api/medi/getMedicine`, { headers: { 'auth-token': tokens } })
            .then((res) => {
                setMedicine(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <MedicineContext.Provider value={{ medicine }}>
            {children}
        </MedicineContext.Provider>
    );
};

export { MedicineProvider, MedicineContext };
