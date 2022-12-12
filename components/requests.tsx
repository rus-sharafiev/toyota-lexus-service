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
        fetch('/requests.php', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {

            data.user == 'unauthorized' 
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

const InfoPage = (props: {logout: (user: string) => void}) => {
    const [data, setData] = useState<{ user: boolean; requests: Object}>({ user: false, requests: Object});
    const [snackbar, setSnackbar] = useState<{[index: string]: any; }>([]);
    const [snackbarHeight, setSnackbarHeight] = useState(0);
    const [reload, setReload] = useState<number>();

    useEffect(() => {    
        fetch('/requests.php')
        .then((response) => response.json())
        .then((data) => {
            setData(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, [reload]);

    const logOut = () => {
        fetch('/requests.php?logout=true')
        .then((response) => response.json())
        .then((data) => {
            props.logout(data.user);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const setStatus = (id: number, newStatus: string, comments: string) => {
        fetch('/set_status.php', {
            method: 'POST',
            body: JSON.stringify({id: id, status: newStatus, comments: comments})
        })
        .then((response) => response.json())
        .then((data) => {
            setSnackbar(data);
            setReload(Math.random());
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }    
    const removeDeleted = () => {
        fetch('/remove_deleted.php')
        .then((response) => response.json())
        .then((data) => {
            setSnackbar(data);
            setReload(Math.random());
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
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

    return(
        <>
            <main className='requests'>
                <div>Заявки
                    <button type='button' className='outlined' onClick={() => logOut()}>Выйти</button>
                </div>
                <div className='requests-container'>
                {data.requests && Object.entries(data.requests).map(([k, request]) =>
                    <div key={k} className={'request ' + request.status} >
                        <div>Заявка {request.id} от {request.timestamp}</div>
                        <div className='status'>
                            <select id={'status' + request.id} defaultValue={request.status}>
                                <option value="new">Новая</option>
                                <option value="confirmed">Подтверждена</option>
                                <option value="delete">На удалении</option>
                            </select>
                            <input type='button' className='material-symbols-rounded' value='save' 
                                onClick={() => setStatus(request.id, (document.getElementById('status' + request.id) as HTMLSelectElement).value, (document.getElementById('text' + request.id) as HTMLTextAreaElement).value)} 
                            />
                            <label>Статус заявки</label>
                        </div>
                        <div className='commments'>
                            <textarea id={'text' + request.id} defaultValue={request.comments}></textarea>
                            <label>Комментарии</label>
                        </div>
                        <div>{request.client} +7{request.phone}</div>
                        <div><span>Авто</span> {request.car}</div>
                        <div><span>Пробег</span> {Math.round(request.mileage).toLocaleString('ru-RU')} км</div>
                        <div>{request.maintenance}</div>
                    </div>
                )}
                </div>
                <button type='button' className='outlined' onClick={() => removeDeleted()}>Удалить помеченные на удаление</button>
                {snackbar.status
                    ? snackbar.status != 'error'
                        ? <div className='snackbar' style={{height: snackbarHeight + 'px'}}><div>Изменения внесены в базу</div></div>
                        : <div className='snackbar' style={{height: snackbarHeight + 'px'}}><div>Произошла ошибка, попробуйте позже</div></div>
                    : null}
            </main>
        </>
    )
}


export const Requests = () => {
    const [user, setUser] = useState('');

    useEffect(() => {    
        fetch('/requests.php')
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
            ? user == 'yes'
                ? <InfoPage logout={setUser} />
                : <LoginPage login={setUser} />
            : <CircularProgressIndicator stroke='#c00017' />
    )
}