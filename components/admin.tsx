import '../CSS/form.css';
import '../CSS/requests.css';
import '../CSS/login.css';
import React, { useState, useEffect } from 'react';
import { CircularProgressIndicator } from './cpi';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage = (props: {login: (user: string) => void}) => {
    const [unauthorized, setUnauthorized] = useState(false);

    const formik = useFormik({
        initialValues: {
            login: '',
            pass: ''
        },
        validationSchema: Yup.object({
            login: Yup.string()
                .required('Укажите логин'),
            pass: Yup.string()
                .required('Укажите пароль')
        }),
        onSubmit: values => {
            sCredentials(values);
        },
    });
    const sCredentials = (data: any) => {
        fetch('/api/user/login/', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
            data.user === 'unauthorized' 
                ? setUnauthorized(true) 
                : setUnauthorized(false); props.login(data.user);
        })
        .catch((error) => {
            console.error('Err:', error);
      });
    }
    return(
        <main className='login'>
            <form onSubmit={formik.handleSubmit}>
                <span>Авторизация</span>
                <div>
                    <input className={formik.touched.login && formik.errors.login ? 'error' : undefined}
                        id="login"
                        name="login"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.login}
                        placeholder={' '}
                    />
                    <label htmlFor="login">Логин</label>
                    {formik.touched.login && formik.errors.login ? (
                        <>
                            <div className='error-label'>{formik.errors.login}</div>
                            <div className='material-symbols-rounded error-icon'>error</div>
                        </>
                    ) : formik.values.login ? ( <button className='material-symbols-rounded' onClick={() => formik.setFieldValue('login', '', false)}>cancel</button> ) : null }
                </div>
                <div>
                    <input className={formik.touched.pass && formik.errors.pass ? 'error' : undefined}
                        id="pass"
                        name="pass"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.pass}
                        placeholder={' '}
                    />
                    <label htmlFor="pass">Пароль</label>
                    {formik.touched.pass && formik.errors.pass ? (
                        <>
                            <div className='error-label'>{formik.errors.pass}</div>
                            <div className='material-symbols-rounded error-icon'>error</div>
                        </>
                    ) : formik.values.pass ? ( <button className='material-symbols-rounded' onClick={() => formik.setFieldValue('pass', '', false)}>cancel</button> ) : null }
                </div>
                <button type="submit" className='filled'>Отправить</button> 
                {unauthorized && <div className='unauthorized'>Неверный логин или пароль</div>} 
            </form>
        </main>
    )
}

const AdminPage = (props: {logout: (user: string) => void}) => {
    const [data, setData] = useState<{ user: string; requests: Object}>({ user: '', requests: Object});
    const [prices, setPrices] = useState<{ user: string; prices: Object}>({ user: '', prices: Object});
    const [snackbar, setSnackbar] = useState<{[index: string]: any; }>([]);
    const [snackbarHeight, setSnackbarHeight] = useState(0);
    const [search, setSearch] = useState<string>('');
    const [tab, setTab] = useState('r')

    useEffect(() => {    
        fetch(`/api/requests/?s=${search}`)
        .then((response) => response.json())
        .then((data) => {
            setData(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, [search, snackbar, tab]);

    useEffect(() => {    
        fetch(`/api/prices/`)
        .then((response) => response.json())
        .then((data) => {
            setPrices(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, [snackbar, tab]);
    
    useEffect(() => {
        if (snackbar.status) {
            setTimeout(() => {
                setSnackbarHeight(48);
            }, 10);
        }
    }, [snackbar]);

    useEffect(() => {
        if (snackbarHeight == 48) {
            setTimeout(() => {
                setSnackbarHeight(0);
                setTimeout(() => {
                    setSnackbar([]);
                }, 200);
            }, 3000);
        }
    }, [snackbarHeight]);

    const logOut = () => {
        fetch('/api/user/logout/')
        .then((response) => response.json())
        .then((data) => {
            props.logout(data.user);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const setStatus = (id: number, newStatus: string, comments: string, date: string) => {
        fetch('/api/requests/update/', {
            method: 'POST',
            body: JSON.stringify({id: id, status: newStatus, comments: comments, date: date})
        })
        .then((response) => response.json())
        .then((data) => {
            setSnackbar(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }    
    
    const setPrice = (id: string, name: string, price: string) => {
        fetch('/api/prices/update/', {
            method: 'POST',
            body: JSON.stringify({id: id, name: name, price: price})
        })
        .then((response) => response.json())
        .then((data) => {
            setSnackbar(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const removeDeleted = () => {
        fetch('/api/requests/clear/')
        .then((response) => response.json())
        .then((data) => {
            setSnackbar(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return(
        <>
            <main className='requests'>
                <div>
                    <div className='admin-tabs'>
                        <div className={tab === 'r' ? 'active' : undefined} onClick={() => setTab('r')}>Заявки</div>
                        <div className={tab === 'p' ? 'active' : undefined} onClick={() => setTab('p')}>Цены</div>
                    </div>
                    {tab === 'r' && <div className='requests-search'>
                        <input id='requests-search-input' defaultValue={search} onChange={(e) => setSearch(e.target.value)} placeholder={' '}></input>
                        <label htmlFor='requests-search-input'>Поиск по заявкам</label>
                    </div>}
                </div>
                {tab === 'r' && <><div className='requests-container'>
                    {data.requests && Object.entries(data.requests).map(([k, request]) =>
                        <div key={request.id} className={'request ' + request.status} >
                            <div>Заявка {request.id} от {request.timestamp}</div>
                            <div className='status'>
                                <label htmlFor={'status' + request.id}>Статус заявки</label>
                                <select id={'status' + request.id} defaultValue={request.status}>
                                    <option value="new">Новая</option>
                                    <option value="confirmed">Подтверждена</option>
                                    <option value="work">В работе</option>
                                    <option value="done">Выполнена</option>
                                    <option value="delete">На удалении</option>
                                </select>
                                <input type='button' className='material-symbols-rounded save-btn' value='save' 
                                    onClick={() => setStatus(
                                        request.id, 
                                        (document.getElementById('status' + request.id) as HTMLSelectElement).value,
                                        (document.getElementById('commments' + request.id) as HTMLTextAreaElement).value,
                                        (document.getElementById('date' + request.id) as HTMLInputElement).value)
                                    } 
                                />
                            </div>
                            <div className='repair-date'>
                                <label htmlFor={'date' + request.id}>Дата ремонта</label>
                                <input id={'date' + request.id} type='datetime-local' defaultValue={request.date} />
                            </div>
                            <div className='request-text'>
                                <label htmlFor={'client' + request.id}>Клиент</label>
                                <input id={'client' + request.id} value={request.client} readOnly={true} />
                            </div>
                            <div className='request-text'>
                                <label htmlFor={'phone' + request.id}>Телефон</label>
                                <input id={'phone' + request.id} value={'+7' + request.phone} readOnly={true} />
                            </div>
                            <div className='request-text'>
                                <label htmlFor={'car' + request.id}>Авто</label>
                                <input id={'car' + request.id} value={request.car} readOnly={true} />
                            </div>
                            <div className='request-text'>
                                <label htmlFor={'mileage' + request.id}>Пробег</label>
                                <input id={'mileage' + request.id} value={Math.round(request.mileage).toLocaleString('ru-RU') + ' км'} readOnly={true} />
                            </div>
                            <div className='request-text'>
                                <label htmlFor={'request' + request.id}>Причина обращения</label>
                                <textarea id={'request' + request.id} value={request.maintenance} readOnly={true}></textarea>
                            </div>
                            <div className='request-text'>
                                <label htmlFor={'commments' + request.id}>Комментарии</label>
                                <textarea id={'commments' + request.id} defaultValue={request.comments}></textarea>
                            </div>
                        </div>
                    )}
                </div>
                <div className='buttons'>
                    <button type='button' className='text' onClick={() => logOut()}>Выйти</button>
                    <button type='button' className='text' onClick={() => removeDeleted()}>Удалить отмеченные</button>
                </div></>}
                {tab === 'p' && <><div className='prices-container'>  
                    <div key='0' className='price'>
                        <div className='price-id' >Артикул</div>
                        <div className='price-name' >Название</div>
                        <div className='price-value' >Цена</div>
                        <div></div>
                    </div>   
                    {prices.prices && Object.entries(prices.prices).map(([k, price]) =>
                        <div key={price.id} className='price'>
                            <input className='price-id' value={price.id} readOnly={true} />
                            <input className='price-name' id={'name' + price.id} defaultValue={price.name} />
                            <input className='price-value' id={'price' + price.id} defaultValue={price.price} />
                            <input type='button' className='material-symbols-rounded save-btn' value='save' 
                                onClick={() => setPrice(
                                    price.id, 
                                    (document.getElementById('name' + price.id) as HTMLInputElement).value,
                                    (document.getElementById('price' + price.id) as HTMLInputElement).value)
                                } 
                            />
                        </div>
                    )}
                </div>
                <div className='buttons'>
                    <button type='button' className='text' onClick={() => logOut()}>Выйти</button>
                </div></>}

                {snackbar.status
                    ? snackbar.status != 'error'
                        ? <div className='snackbar' style={{height: snackbarHeight + 'px'}}><div>Изменения внесены в базу</div></div>
                        : <div className='snackbar' style={{height: snackbarHeight + 'px'}}><div>Произошла ошибка, попробуйте позже</div></div>
                    : null}
            </main>
        </>
    )
}


export const Admin = () => {
    const [user, setUser] = useState('');

    useEffect(() => {    
        fetch('/api/user/')
        .then((response) => response.json())
        .then((data) => {
            setUser(data.user);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, []);
    
    return(
        user != ''
            ? user === 'yes'
                ? <AdminPage logout={setUser} />
                : <LoginPage login={setUser} />
            : <CircularProgressIndicator stroke='#c00017' />
    )
}