import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const SendRequestForm = (props: {car: string; maintenance: string}) => {
    const[sendForm, setSendForm] = useState(false);
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            date: '',
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
            date: Yup
                .date(),
        }),
        onSubmit: values => {
            setSendForm(true);
        },
    });

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
                <input className={formik.touched.date && formik.errors.date ? 'error' : undefined}
                    id="date"
                    name="date"
                    type="date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.date}
                    placeholder={' '}
                />
                <label htmlFor="date">Желаемая дата</label>
                {formik.touched.date && formik.errors.date ? (
                    <>
                        <div className='error-label'>{formik.errors.date}</div>
                        <div className='material-symbols-rounded error-icon'>error</div>
                    </>
                ) : null }
            </div>
            <button type="submit">Отправить</button>              
            {sendForm && <div className='form-sent'>
                <div>
                    <span>Проверьте данные и подтвердите заявку</span>
                    <span>Имя: </span><span>{formik.values.name}</span>
                    <span>Номер телефона: </span><span>{formik.values.phone}</span>
                    <span>Автомобиль: </span><span>{formik.values.car}</span>
                    <span>Обслуживание: </span><span>{formik.values.maintenance}</span>
                    {formik.values.date && <><span>Желаемая дата: </span><span>{formik.values.date}</span></>}
                    <button type="button" onClick={() => {
                        console.log(JSON.stringify(formik.values, null, 2));
                        formik.resetForm();
                        setSendForm(false);
                    }}>Подтвердить</button>
                    <button type="button" onClick={() => setSendForm(false)}>Отменить</button>
                </div>
            </div>}
        </form>
    );
};