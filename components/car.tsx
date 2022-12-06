import '../CSS/car.css';
import '../CSS/m3form.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SendRequestForm } from './submit_form';
import { object } from 'yup';

const compareTO = (a: any, b : any) => {
    return a[0].split(',')[0] - b[0].split(',')[0];
}

export const Car = () => {
    let { carId } = useParams();
    const [car, setCar] = useState<{[index: string]: any; }>([]);
    const [engine, setEngine] = useState<{[index: string]: any; }>([]);
    const [transmission, setTransmission] = useState<{[index: string]: any; }>([]);
    const [drive, setDrive] = useState<{[index: string]: any; }>([]);
    const [maintenance, setMaintenance] = useState<{[index: string]: any; }>([]);

    const [activeEng, SetActiveEng] = useState('');
    const [activeTrsm, SetActiveTrsm] = useState('');
    const [activeDrv, SetActiveDrv] = useState('');
    const [activeMtn, SetActiveMtn] = useState('');

    useEffect(() => {
        fetch(`/car.php?id=${carId}`)
            .then((response) => response.json())
            .then((array) => setCar(array));
    }, []);

    useEffect(() => {
        setTransmission([]);
        SetActiveTrsm('');
    }, [engine]);

    useEffect(() => {
        setDrive([]);
        SetActiveDrv('');
    }, [engine, transmission]);

    useEffect(() => {
        setMaintenance([]);
        SetActiveMtn('');
    }, [engine, transmission, drive]);

    if (car.length === 0) return null;
    let sum = 0;
    return (
        <main className='car'>
            <img className='car-title-img' src={car.img} alt={car.gen} />
            <div className='car-title'>
                <span className='arimo'>{car.brand} {car.model}</span>
                <span>{car.gen} ({car.year})</span>
            </div>
            <div className='car-options'>
                <span className='car-options-title'>Объем двигателя:</span>
                {Object.entries(car.options).map(([key, value]) =>
                    <div
                        key={key}
                        onClick={() => {value && setEngine(value); SetActiveEng(key)}}
                        className={activeEng == key ? 'active' : undefined}
                    >{key}</div>
                )}
            </div>
            <div className='car-options'>
                <span className='car-options-title'>Тип коробки:</span>
                {engine.length === 0  ? <span className='car-options-chose'>Выберите двигатель</span>
                : Object.entries(engine).map(([key, value]) => 
                    <div
                        key={key}
                        onClick={() => {value && setTransmission(value); SetActiveTrsm(key)}}
                        className={activeTrsm == key ? 'active' : undefined}
                    >{key}</div>
                )}
            </div>
            <div className='car-options'>
                <span className='car-options-title'>Привод:</span>
                {transmission.length === 0 ? <span className='car-options-chose'>Выберите тип КПП</span>
                : Object.entries(transmission).map(([key, value]) => 
                    <div
                        key={key}
                        onClick={() => {value && setDrive(value); SetActiveDrv(key)}}
                        className={activeDrv == key ? 'active' : undefined}
                    >{key}</div>
                )}
            </div>
            <div className='car-options car-maintenances'>
                <span className='car-options-title'>Обслуживание:</span>
                {drive.length === 0 ? <span className='car-options-chose'>Выберите тип привода</span>
                : Object.entries(drive).sort(compareTO).map(([key, value]) => 
                    <div
                        key={key}
                        onClick={() => {value && setMaintenance(value); SetActiveMtn(key)}}
                        className={activeMtn == key ? 'active' : undefined}
                    >ТО {key}</div>
                )}
            </div>
            <div className='car-maintenance'>
                {Object.entries(maintenance).length != 0 ? 
                <>  
                    {Object.values(maintenance).map( (v) => { sum += Math.round(v)} ) }
                    <div>
                        <span>Предварительная стоимость обслуживания</span>
                        <table>
                            <thead>
                                <tr><th>Работы/Материалы</th><th>Цена</th></tr>
                            </thead>
                            <tbody>
                                {Object.entries(maintenance).map(([k, v]) =>
                                    v && <tr key={k}><td>{k}</td><td>{Math.round(v).toLocaleString('ru-RU')} ₽</td></tr>
                                )}
                            </tbody>
                        </table>
                        
                        <div>Сумма <span>{sum.toLocaleString('ru-RU')} ₽</span></div>
                        <span>Также на каждом обслуживании выполняются:
                            <ul>
                                <li>Проверка уровня тормозной и охлаждающей жидкостей</li>
                                <li>Состояние и целостность шлангов и патрубков</li>
                                <li>Общее состояние подвески и ступичных подшипников</li>
                            </ul>
                        </span>
                    </div>
                    <SendRequestForm car={`${car.model} ${activeEng} ${activeTrsm} ${activeDrv}`} maintenance={`ТО - ${activeMtn}`}/>
                </>
                : null}
            </div>
        </main>
    )
}