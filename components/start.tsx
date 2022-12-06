import '../CSS/start.css';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export const Start = () => {

    return (
        <main className='start'>
            <div className='start-title-container'>
                <div className='start-title'>
                    <span className='arimo'>TL</span> Service Kazan
                </div>
                <div className='start-title-text'>
                    Профессиональное техническое<br />
                    и сервисное обслуживание <br />
                    <span className='arimo'>TOYOTA</span> и <span className='arimo'>LEXUS</span> <br />
                    в Казани <br />
                </div>
            </div>
            <div className='start-about-container'>
                <div className='start-about'>
                    Более 10 лет опыта
                </div>
                <div className='start-about-text'>
                    технического обслуживания, мелкосрочного<br />
                    и агрегатного ремонта автомобилей<br />
                    согласно регламенту изготовителя<br />
                    и подтверженного сертификатами
                </div>
            </div>
            <div className='start-work-container'>
                <div className='start-work'>
                    Мы выполняем:
                </div>
                <ul className='start-work-text'>
                    <li>Регламентное техническое обслуживание</li>
                    <li>Компьютерную диагностику</li>
                    <li>Агрегатный ремонт бензиновых и дизельных двигателей,<br />
                        механических и автоматических коробок переключения передач</li>
                    <li>Мелкосрочный ремонт узлов и элементов подвески,<br />
                        выхлопной системы, системы охлаждения и т.п.
                    </li>
                </ul>
            </div>
            <Link to={'/models'} className='start-cars-container'>
                <div className='start-cars'>
                    Выберите свой автомобиль
                </div>
                <div className='start-cars-text'>
                    что-бы узнать стоймость технического<br />
                    обслуживания и оставить заявку
                </div>
            </Link>            
            <Link to={'/repair'} className='start-repair-container'>
                <div className='start-repair'>
                    Заполните заявку
                </div>
                <div className='start-repair-text'>
                    если нужно провести ремонт<br />
                    или замену запасных частей
                </div>
            </Link>
            <div className='start-footer-container'>
                <div>
                    <img src='IMG/footer-logo.svg' alt='footer logo' />
                    <div>
                        @&nbsp;2022 TL&nbsp;Service&nbsp;Kazan
                        <span>
                            Дизайн и разработка&nbsp;
                            <a href='https://github.com/rus-sharafiev' target="_blank" rel="noopener noreferrer">rus-sharafiev</a>
                        </span>
                    </div>
                </div>
                <div>
                    <div>
                        ИП ЮСУПОВА Н.И.<br />
                        ИНН 165607722543<br />
                        ОГРН 321169000197262<br />
                    </div>
                    <div>
                        Юридический адрес организации<br />
                        420083, РОССИЯ, РЕСП ТАТАРСТАН,<br />
                        Г КАЗАНЬ, ТЕР СНТ ОВОЩНИК-3, -, Д 803<br />
                    </div>
                </div>
            </div>
        </main>
    )
}