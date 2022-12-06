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
    return ( 
        <>
            <Routes>
                <Route path="/" element={ <Start /> }/>
                <Route path="/models" element={ <Models /> } />
                <Route path="/models/:carId" element={ <Car /> }/>
                <Route path="/repair" element={ <Repair /> }/>
                <Route path="/contacts" element={ <Contacts /> }/>
            </Routes>
            <header></header>
            <nav>
                <NavButton id='' symbol='Home' name='Главная' />
                <NavButton id='models' symbol='directions_car' name='Модели' />
                <NavButton id='repair' symbol='construction' name='Ремонт' />
                <NavButton id='contacts' symbol='location_on' name='Контакты' />
            </nav>
            <Logo mobile={mobile} />
        </>
    );
}

ReactDOM.createRoot(document.querySelector('root') as HTMLElement).render(<BrowserRouter><App /></BrowserRouter>);