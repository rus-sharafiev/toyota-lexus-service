declare global {
    interface Navigator {
        windowControlsOverlay: any;
    }
}

import './CSS/main.css';
import './CSS/styles.css';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import { Logo } from './components/logo';
import { Start } from './components/start';
import { Models } from './components/models';
import { Car } from './components/car';
import { Contacts } from './components/contacts';
import { Repair } from './components/repair';
import { Admin } from './components/admin';

import {Workbox} from 'workbox-window';
// if ('serviceWorker' in navigator) {
//     const wb = new Workbox('/sw.js');
//     wb.register();
// }

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    var mobile = true;
}

const NavButton = (props: { id: string; symbol: string; name: string}) => {
    const [fontsLoaded, SetFontsLoaded] = useState(false);

    useEffect(() => {
        document.fonts.load("24px Material Symbols Rounded").then(() => SetFontsLoaded(true));
    }, [fontsLoaded]);

    return (
        <NavLink to={`/${props.id}`} className={ ({ isActive }) => isActive ? 'nav-active' : undefined }>
            <span className='material-symbols-rounded'>{ fontsLoaded ? props.symbol : null }</span>
            {props.name}
        </NavLink> 
    )
}

const App = () => {

    const [windowCtlOvrlVisible, setWindowCtlOvrlVisible] = useState(false);
    if (!mobile && ('windowControlsOverlay' in navigator)) {
        setWindowCtlOvrlVisible(true);
        navigator.windowControlsOverlay.addEventListener('geometrychange', (event: any) => {
            if (event.visible) {
                setWindowCtlOvrlVisible(true)
            } else {setWindowCtlOvrlVisible(false)}
        });
    }

    return ( 
        <>
            <Routes>
                <Route path="/" element={ <Start /> }/>
                <Route path="/cars" element={ <Models /> } />
                <Route path="/cars/:carId" element={ <Car /> }/>
                <Route path="/repair" element={ <Repair /> }/>
                <Route path="/contacts" element={ <Contacts /> }/>
                <Route path="/admin" element={ <Admin /> }/>
            </Routes>
            <header></header>
            <nav>
                <NavButton id='' symbol='Home' name='Главная' />
                <NavButton id='cars' symbol='directions_car' name='Модели' />
                <NavButton id='repair' symbol='construction' name='Ремонт' />
                <NavButton id='contacts' symbol='location_on' name='Контакты' />
            </nav>
            <Logo mobile={mobile} />
            {windowCtlOvrlVisible && <div id='pseudo-title-bar'><span className='arimo'>TOYOTA LEXUS </span> Сервис Казань</div>}
        </>
    );
}

ReactDOM.createRoot(document.querySelector('root') as HTMLElement).render(<BrowserRouter><App /></BrowserRouter>);