import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const SendRequestForm = (props: {car: string; maintenance: string}) => {
    const[sendForm, setSendForm] = useState(false);
    const [snackbar, setSnackbar] = useState<{[index: string]: any; }>([]);
    const [snackbarHeight, setSnackbarHeight] = useState(0);
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            mileage: '',
            car: props.car,
            maintenance: props.maintenance
        },
        validationSchema: Yup.object({
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
    const sRequest = (data: any) => {
        fetch('/record_request.php', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
            setSnackbar(data);
        })
        .catch((error) => {
            console.error('Err:', error);
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
        <form onSubmit={formik.handleSubmit} className={'maintenance'}>
            <span>Оправить заявку на выбранное обслуживание</span>
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
            <button type="submit" className='filled'>Отправить</button>              
            {sendForm && <div className='form-sent'>
                <div>
                    <span>Проверьте данные и подтвердите заявку</span>
                    <span>Имя: </span><span>{formik.values.name}</span>
                    <span>Номер телефона: </span><span>{formik.values.phone}</span>
                    <span>Автомобиль: </span><span>{formik.values.car}</span>
                    <span>Обслуживание: </span><span>{formik.values.maintenance}</span>
                    <span>Пробег: </span><span>{formik.values.mileage}</span>
                    <button type="button" className='filled button-submit'
                        onClick={() => {
                        sRequest(formik.values);
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
    );
};