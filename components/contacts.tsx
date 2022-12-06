import '../CSS/contacts.css';
import React, { useEffect } from 'react';
import './map.js';

declare namespace ymaps{
    function ready(successCallback: Function | Object): void;
    function Map(parentElement: Object | string, state: Object, options: Object): void;
    function GeoObject(feature: Object, options: Object): void;
}

export const Contacts = () => {

    useEffect(() => {        
        ymaps.ready(init);
        function init() {
            var myMap = new ymaps.Map("map", {
                center: [55.813399, 49.291979],
                controls: [],
                zoom: 14
            }, { suppressMapOpenBlock: true });
            var myGeoObject = new ymaps.GeoObject({	
                geometry: {
                    type: "Point",
                    coordinates: [55.813399, 49.2919799]
                },		
                properties: {
                    iconContent: "TL Сервис"
                }
            }, {
                preset: 'islands#redStretchyIcon'
            });
            myMap.geoObjects.add(myGeoObject);
            myMap.controls.add('zoomControl', {
                size: 'small',
                float: 'none',
                position: {
                    bottom: '50px',
                    right: '30px'
                }
            });
        }
    }, []);


    return (
        <main className='contacts'>
            <div id='map'></div>
            <div className='contacts-container'>
                <div className='contacts-phone'>
                    <span className='material-symbols-rounded'>call</span>
                    +7 987 220-96-20
                </div>
                <div className='contacts-mail'>
                    <span className='material-symbols-rounded'>mail</span>
                    mail@tlservice-kazan.ru
                </div>
                <div className='contacts-address'>
                    <span className='material-symbols-rounded'>garage_home</span>
                    420083, Россия, Респ. Татарстан, Казань,<br />
                    Садоводческое некоммерческое товарищество Овощник-3, д. 803<br />
                </div>
            </div>
        </main>
    )
}