import '../CSS/repair.css';
import '../CSS/m3form.css';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const Repair = () => {
    const[sendForm, setSendForm] = useState(false);
    const[formHasBeenSent, setFormHasBeenSent] = useState(false);
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            date: '',
            vin: '',
            descr: ''
        },
        validationSchema: Yup.object({
            vin: Yup.string()
                .matches(/^[a-zA-Z0-9_.-]+$/, 'Только латинсике буквы и цифры')
                .length(17, 'VIN должен содержать 17 символов')
                .required('Необходимо указать VIN'),
            descr: Yup.string()
                .required('Опишите неисправность'),
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
            console.log(JSON.stringify(values, null, 2));
            formik.resetForm();
            setSendForm(false);
        },
    });

    return (
        <main className='repair'>
            <form onSubmit={formik.handleSubmit} className='repair'>
                <span>Заявка на ремонт</span>
                <div>
                    Для уточнения трудоемкости и метода ремонта, а также для проценки стоимости запасных частей, 
                    необходимо заполнить заявку на ремонт. В заявке необходимо обязательно указать VIN автомобиля. 
                    С его помошью можно будет предварительно составить список работ и запасных частей, что, в свою очередь, 
                    позволит подсчитать приблизительную стоймость ремонта.<br /><br />

                    Мы не работаем с результатами диагностики сторонних сервисных центров, так как зачастую эти заключения 
                    приводят к ремонту, в котором необходимость отсутствует. Поэтому, просим максимально подробно заполнить поле 
                    "Описание неисправности" (Как и где проявляется? При каких условия?)<br /><br />

                    Если неисправность отсутствует, а нужно заменить расходники или технические жидкости, просто 
                    укажите это в причине обращения и обязательно отметьте нужны ли будут материалы 
                    (например "Хочу заменить тормозную жидкость. Не заменил на прошлом обслуживаниии. Расходники ваши")
                </div>
                <div>
                    <input className={formik.touched.vin && formik.errors.vin ? 'error' : undefined}
                        id="vin"
                        name="vin"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.vin}
                        placeholder={' '}
                    />
                    <label htmlFor="vin">VIN</label>
                    {formik.touched.vin && formik.errors.vin ? (
                        <>
                            <div className='error-label'>{formik.errors.vin}</div>
                            <div className='material-symbols-rounded error-icon'>error</div>
                        </>
                    ) : formik.values.vin ? ( <button className='material-symbols-rounded' onClick={() => formik.setFieldValue('vin', '', false)}>cancel</button> ) : null }
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
                <div>
                    <textarea className={formik.touched.descr && formik.errors.descr ? 'error' : undefined}
                        id="descr"
                        name="descr"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.descr}
                        placeholder={' '}
                    />
                    <label htmlFor="descr">Причина обращения / Описание неисправности</label>
                    {formik.touched.descr && formik.errors.descr ? (
                        <>
                            <div className='error-label'>{formik.errors.descr}</div>
                            <div className='material-symbols-rounded error-icon'>error</div>
                        </>
                    ) : formik.values.descr ? ( <button className='material-symbols-rounded' onClick={() => formik.setFieldValue('descr', '', false)}>cancel</button> ) : null }
                </div>
                <button type="button" onClick={() => setSendForm(true)}>Отправить</button>
                {sendForm && <div className='form-sent'>
                    <div>
                        <span>Проверьте данные и подтвердите заявку</span>
                        <span>VIN: </span><span>{formik.values.vin}</span>
                        <span>Имя: </span><span>{formik.values.name}</span>
                        <span>Номер телефона: </span><span>{formik.values.phone}</span>
                        {formik.values.date && <><span>Желаемая дата: </span><span>{formik.values.date}</span></>}
                        <span>Причина обращения: </span><span>{formik.values.descr}</span>
                        <button type="submit">Подтвердить</button>
                    </div>
                </div>}
            </form>
        </main>
    );
};