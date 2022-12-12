import '../CSS/form.css';
import '../CSS/repair.css';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const Repair = () => {
    const [sendForm, setSendForm] = useState(false);
    const [snackbar, setSnackbar] = useState<{[index: string]: any; }>([]);
    const [snackbarHeight, setSnackbarHeight] = useState(0);
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            mileage: '',
            car: '',
            maintenance: ''
        },
        validationSchema: Yup.object({
            car: Yup.string()
                .matches(/^[a-zA-Z0-9_.-]+$/, 'Только латинсике буквы и цифры')
                .length(17, 'VIN должен содержать 17 символов')
                .required('Необходимо указать VIN'),
            maintenance: Yup.string()
                .required('Опишите неисправность'),
            name: Yup.string()
                .max(20, 'Не более 20 символов')
                .matches(/^[?!,.а-яА-ЯёЁ\s]+$/, 'Только русские буквы')
                .required('Необходимо указать имя'),
            phone: Yup.string()
                .length(10, 'Номер телефона без +7, только 10 цифр')
                .required('Необходимо указать номер телефона'),
            mileage: Yup.number()
                .required('Укажите хотя бы примерный пробег')
        }),
        onSubmit: values => {
            setSendForm(true);
        },
    });
    
    const sendRequest = (data: any) => {
        fetch('/record_request.php', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
            setSnackbar(data);
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

    return (
        <main className='repair'>
            <form onSubmit={formik.handleSubmit} className='repair'>
                <span>Заявка на ремонт</span>
                <div>
                    Для уточнения трудоемкости и метода ремонта, а также для проценки стоимости запасных частей, 
                    необходимо заполнить заявку на ремонт. В заявке необходимо обязательно указать VIN автомобиля. 
                    С его помощью можно будет предварительно составить список работ и запасных частей, что, в свою очередь, 
                    позволит подсчитать приблизительную стоимость ремонта.<br /><br />

                    Мы не работаем с результатами диагностики сторонних сервисных центров, так как зачастую эти заключения 
                    приводят к ремонту, в котором необходимость отсутствует. Поэтому, просим максимально подробно заполнить поле 
                    "Описание неисправности" (Как и где проявляется? При каких условия?)<br /><br />

                    Если неисправность отсутствует, а нужно заменить расходники или технические жидкости, просто 
                    укажите это в причине обращения и обязательно отметьте нужны ли будут материалы 
                    (например "Хочу заменить тормозную жидкость. Не заменил на прошлом обслуживании. Расходники ваши")
                </div>
                <div>
                    <input className={formik.touched.car && formik.errors.car ? 'error' : undefined}
                        id="car"
                        name="car"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.car}
                        placeholder={' '}
                    />
                    <label htmlFor="car">VIN</label>
                    {formik.touched.car && formik.errors.car ? (
                        <>
                            <div className='error-label'>{formik.errors.car}</div>
                            <div className='material-symbols-rounded error-icon'>error</div>
                        </>
                    ) : formik.values.car ? ( <button className='material-symbols-rounded' onClick={() => formik.setFieldValue('car', '', false)}>cancel</button> ) : null }
                </div>
                <div>
                    <input className={formik.touched.name && formik.errors.name ? 'error' : undefined}
                        id="name"
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        placeholder={' '}
                    />
                    <label htmlFor="name">Имя</label>
                    {formik.touched.name && formik.errors.name ? (
                        <>
                            <div className='error-label'>{formik.errors.name}</div>
                            <div className='material-symbols-rounded error-icon'>error</div>
                        </>
                    ) : formik.values.name ? ( <button className='material-symbols-rounded' onClick={() => formik.setFieldValue('name', '', false)}>cancel</button> ) : null }
                </div>
                <div>
                    <input className={formik.touched.phone && formik.errors.phone ? 'error' : undefined}
                        id="phone"
                        name="phone"
                        type="tel"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        placeholder={' '}
                    />
                    <label htmlFor="phone">Номер телефона</label>
                    {formik.touched.phone && formik.errors.phone ? (
                        <>
                            <div className='error-label'>{formik.errors.phone}</div>
                            <div className='material-symbols-rounded error-icon'>error</div>
                        </>
                    ) : formik.values.phone ? ( <button className='material-symbols-rounded' onClick={() => formik.setFieldValue('phone', '', false)}>cancel</button> ) : null }
                </div>
                <div>
                    <input className={formik.touched.mileage && formik.errors.mileage ? 'error' : undefined}
                        id="mileage"
                        name="mileage"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.mileage}
                        placeholder={' '}
                    />
                    <label htmlFor="mileage">Пробег</label>
                    {formik.touched.mileage && formik.errors.mileage ? (
                        <>
                            <div className='error-label'>{formik.errors.mileage}</div>
                            <div className='material-symbols-rounded error-icon'>error</div>
                        </>
                    ) : formik.values.mileage ? ( <button className='material-symbols-rounded' onClick={() => formik.setFieldValue('mileage', '', false)}>cancel</button> ) : null }
                </div>
                <div>
                    <textarea className={formik.touched.maintenance && formik.errors.maintenance ? 'error' : undefined}
                        id="maintenance"
                        name="maintenance"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.maintenance}
                        placeholder={' '}
                    />
                    <label htmlFor="maintenance">Причина обращения / Описание неисправности</label>
                    {formik.touched.maintenance && formik.errors.maintenance ? (
                        <>
                            <div className='error-label'>{formik.errors.maintenance}</div>
                            <div className='material-symbols-rounded error-icon'>error</div>
                        </>
                    ) : formik.values.maintenance ? ( <button className='material-symbols-rounded' onClick={() => formik.setFieldValue('maintenance', '', false)}>cancel</button> ) : null }
                </div>
                <button type="submit" className='filled'>Отправить</button>
                {sendForm && <div className='form-sent'>
                    <div>
                        <span>Проверьте данные и подтвердите заявку</span>
                        <span>VIN: </span><span>{formik.values.car}</span>
                        <span>Имя: </span><span>{formik.values.name}</span>
                        <span>Номер телефона: </span><span>{formik.values.phone}</span>
                        <span>Пробег: </span><span>{formik.values.mileage}</span>
                        <span>Причина обращения: </span><span>{formik.values.maintenance}</span>
                        <button type="button" className='filled button-submit'
                            onClick={() => {
                            sendRequest(formik.values);
                            formik.resetForm();
                            setSendForm(false);
                            }
                        }>Подтвердить</button>
                        <button type="button" className='outlined button-cancel' onClick={() => setSendForm(false)}>Отменить</button>
                    </div>
                </div>}
                {snackbar.status
                    ? snackbar.status != 'error'
                        ? <div className='snackbar' style={{height: snackbarHeight + 'px'}}><div>Заявка №{snackbar.data.id} отправлена</div></div>
                        : <div className='snackbar' style={{height: snackbarHeight + 'px'}}><div>Произошла ошибка, попробуйте позже</div></div>
                    : null}
            </form>
        </main>
    );
};