import '../CSS/models.css';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export const Models = () => {
    const [toyotaModels, setToyotaModels] = useState<{[index: string]: any; }>([]);

    useEffect(() => {
        fetch(`models.php`)
            .then((response) => response.json())
            .then((array) => setToyotaModels(array));
    }, []);

    return (
        <main className='models'>
            <div className='toyota-cars'>
                <span>Модели <span className='arimo'>TOYOTA</span></span>
                <div className='cars-container'>
                    { toyotaModels.length != 0 
                        ? toyotaModels.map((car: any) => 
                            <div key={car.model} className='model-card '>
                                <img src={car.img} alt={car.model}/>
                                <span className='arimo'>TOYOTA</span>
                                <span className='arimo'>{car.model}</span>
                                <div className='gens-container'>
                                    { car.gen.map(gen => 
                                        <Link to={gen.id} key={gen.number} className='gen-card'>
                                            <img src={gen.img} alt={gen.number}/>
                                            <span className='arimo'>{gen.number}</span>
                                            <span>({gen.year})</span>
                                        </Link>
                                    )}
                                </div>
                            </div>)
                        : <div> Загрузка ... </div> }
                </div>
            </div>
        </main>
    )
}