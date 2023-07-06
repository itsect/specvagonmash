/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { useStore } from '@nanostores/react';
import {isModalOpened} from '../../store';


export default function SpecVagonMashModal({
    categories
                                           }) {

    const $isModalOpened = useStore(isModalOpened);

    return (
        <Transition.Root show={$isModalOpened} as={Fragment}>
            <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto" onClose={() => {
                isModalOpened.set(!$isModalOpened)
            }}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                  </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-0 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-0 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="max-w-7xl relative inline-block align-center bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-80 sm:w-full sm:p-6 opacity-100 translate-y-0 sm:scale-100">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={() => {
                                    isModalOpened.set(!$isModalOpened)
                                }}>
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                                <div className="mx-auto w-100 max-w-100 lg:w-100">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 476.4 89.2" className={'w-auto h-8 lg:h-12 text-3xl'}>
                                            <path fill={'#A5282D'} fillRule={'evenodd'} clipRule={'evenodd'} d="M75.2,53l1.9-6.8l4.2-0.3l4.5-1.4v-3l0,0C85.8,18.6,66.5,0,42.9,0S0,18.5,0,41.4l0,0v0.1l0,0v3.1l4.5,1.4
	l4.3,0.4l1.9,6.8l-3.5,2.3l-3.2,3.3l3.7,6.1l4.6-1l3.9-1.8l5.1,5l-1.8,3.7l-1,4.4l6.3,3.6l3.5-3l2.5-3.4l7,1.8l0.3,4.1l1.4,4.3h7.3
	l1.4-4.3l0.4-4.1l7-1.8l2.4,3.4l3.4,3.1l6.3-3.6l-1-4.4L64.8,67l5.1-4.9l3.8,1.8l4.6,1l3.6-6.1l-3.1-3.4L75.2,53L75.2,53z
	 M42.9,67.5c-15.1,0-27.3-11.8-27.3-26.4s12.2-26.6,27.3-26.6s27.3,12,27.3,26.5S58,67.5,42.9,67.5z M71.8,41.5c0-0.1,0-0.2,0-0.3
	l0,0v-0.1c0-15.5-13-28-28.9-28S14,25.7,14,41.1v0.1l0,0c0,0.1,0,0.2,0,0.2H4C4,20.6,21.4,3.7,42.9,3.7s38.9,17,38.9,37.8H71.8
	L71.8,41.5z M63.1,30.4c-2.7-4.5-7.6-7.2-12.8-7.2c-2.5,0-5,0.6-7.2,1.8c-4.5-2.3-9.9-2.2-14.4,0.2c-3.4,1.9-5.8,5-6.9,8.7
	c-1,3.7-0.5,7.6,1.5,10.9c1.2,2.1,2.9,3.8,5,5c0.1,2.4,0.8,4.7,2,6.7c2.7,4.5,7.6,7.2,12.8,7.2c2.6,0,5.1-0.7,7.4-1.9
	c4.4-2.4,7.2-7,7.4-12c3.3-1.9,5.7-5,6.7-8.6C65.6,37.5,65.1,33.6,63.1,30.4L63.1,30.4z M49.5,38c-0.1,4.3-2.5,8.3-6.2,10.6
	c-1.9-1.1-3.4-2.7-4.6-4.6c-1.1-1.9-1.7-4-1.8-6.2C40.9,35.9,45.6,36,49.5,38z M24.5,44.1c-1.8-3-2.3-6.5-1.3-9.8
	c0.9-3.4,3.2-6.2,6.3-7.9c3.8-2.1,8.4-2.3,12.3-0.5c-3.7,2.6-6,6.7-6.2,11.2l0,0c-4.1,2.3-6.7,6.5-7.2,11.2
	C26.8,47.2,25.5,45.8,24.5,44.1L24.5,44.1z M49.8,60.6c-2,1.1-4.3,1.7-6.7,1.7c-4.7,0-9.1-2.4-11.6-6.5c-1-1.6-1.6-3.4-1.7-5.3
	c2,0.9,4.2,1.4,6.3,1.4l0,0c2.5,0,5-0.6,7.2-1.8l0,0c4.1,2.1,8.9,2.3,13.1,0.4C56,54.8,53.5,58.6,49.8,60.6L49.8,60.6z M63.2,40.9
	c-0.8,3-2.8,5.7-5.4,7.4c-0.2-2.1-0.8-4.2-1.9-6c-1.2-2.1-2.9-3.8-5-5l0,0c-0.1-2.4-0.8-4.7-2-6.7c-1.1-1.9-2.6-3.4-4.4-4.6
	c6.3-3,13.8-0.8,17.4,5.2C63.7,34,64.2,37.6,63.2,40.9z"/>
                                            <g>
                                                <path d="M126.7,44.4l6.8,2.1c-0.5,1.9-1.2,3.5-2.2,4.8c-1,1.3-2.2,2.3-3.7,2.9c-1.5,0.7-3.3,1-5.6,1c-2.7,0-5-0.4-6.7-1.2
		c-1.7-0.8-3.2-2.2-4.5-4.2c-1.3-2-1.9-4.6-1.9-7.7c0-4.2,1.1-7.4,3.3-9.6s5.4-3.4,9.4-3.4c3.2,0,5.7,0.6,7.5,1.9
		c1.8,1.3,3.2,3.3,4.1,5.9l-6.9,1.5c-0.2-0.8-0.5-1.3-0.8-1.7c-0.4-0.6-1-1.1-1.6-1.4c-0.6-0.3-1.3-0.5-2.1-0.5
		c-1.8,0-3.1,0.7-4.1,2.1c-0.7,1.1-1.1,2.7-1.1,5c0,2.8,0.4,4.7,1.3,5.7c0.8,1,2,1.6,3.6,1.6c1.5,0,2.6-0.4,3.4-1.3
		C125.8,47.2,126.4,46,126.7,44.4z"/>
                                                <path d="M161.5,54.8h-7.8v-19h-8.6v19h-7.8V29.5h24.1V54.8z"/>
                                                <path d="M166.7,29.5h20.9v5.4h-13.1v4h12.1v5.1h-12.1v5h13.5v5.7h-21.3V29.5z"/>
                                                <path d="M219,60.2h-6.3v-5.5h-20.6V29.5h7.8v19h8.6v-19h7.8v19.4h2.7V60.2z"/>
                                                <path d="M222.4,29.5H237c2.4,0,4.3,0.6,5.6,1.8s2,2.7,2,4.5c0,1.5-0.5,2.8-1.4,3.8c-0.6,0.7-1.5,1.3-2.7,1.7c1.8,0.4,3.1,1.2,4,2.2
		s1.3,2.4,1.3,4c0,1.3-0.3,2.5-0.9,3.5s-1.4,1.9-2.5,2.5c-0.7,0.4-1.6,0.7-3,0.8c-1.8,0.2-2.9,0.3-3.5,0.3h-13.5V29.5z M230.3,39.4
		h3.4c1.2,0,2.1-0.2,2.5-0.6c0.5-0.4,0.7-1,0.7-1.8c0-0.7-0.2-1.3-0.7-1.7c-0.5-0.4-1.3-0.6-2.5-0.6h-3.4V39.4z M230.3,49.3h4
		c1.3,0,2.3-0.2,2.8-0.7c0.6-0.5,0.8-1.1,0.8-1.9c0-0.7-0.3-1.3-0.8-1.8c-0.5-0.5-1.5-0.7-2.9-0.7h-4V49.3z"/>
                                                <path d="M265.3,50.6h-8.8l-1.2,4.2h-8l9.5-25.2h8.5l9.5,25.2h-8.2L265.3,50.6z M263.7,45.1l-2.8-9.1l-2.8,9.1H263.7z"/>
                                                <path d="M277.3,29.5h7.8v8.8h8.5v-8.8h7.8v25.2h-7.8V44.6h-8.5v10.2h-7.8V29.5z"/>
                                                <path d="M326.6,35.7h-12.2v19h-7.8V29.5h20V35.7z"/>
                                                <path d="M329.1,42.2c0-4.1,1.1-7.3,3.4-9.6c2.3-2.3,5.5-3.4,9.6-3.4c4.2,0,7.4,1.1,9.7,3.4c2.3,2.3,3.4,5.4,3.4,9.5
		c0,2.9-0.5,5.4-1.5,7.3s-2.4,3.4-4.3,4.4s-4.2,1.6-7,1.6c-2.8,0-5.2-0.5-7.1-1.4s-3.4-2.3-4.5-4.3
		C329.7,47.6,329.1,45.1,329.1,42.2z M336.9,42.2c0,2.5,0.5,4.4,1.4,5.5c0.9,1.1,2.2,1.7,3.9,1.7c1.7,0,3-0.5,3.9-1.6
		c0.9-1.1,1.4-3,1.4-5.9c0-2.4-0.5-4.1-1.4-5.2c-1-1.1-2.3-1.6-3.9-1.6c-1.6,0-2.8,0.6-3.8,1.7C337.4,37.8,336.9,39.6,336.9,42.2z"
                                                />
                                                <path d="M376.3,44.4l6.8,2.1c-0.5,1.9-1.2,3.5-2.2,4.8c-1,1.3-2.2,2.3-3.7,2.9c-1.5,0.7-3.3,1-5.6,1c-2.7,0-5-0.4-6.7-1.2
		c-1.7-0.8-3.2-2.2-4.5-4.2c-1.3-2-1.9-4.6-1.9-7.7c0-4.2,1.1-7.4,3.3-9.6c2.2-2.2,5.4-3.4,9.4-3.4c3.2,0,5.7,0.6,7.5,1.9
		c1.8,1.3,3.2,3.3,4.1,5.9l-6.9,1.5c-0.2-0.8-0.5-1.3-0.8-1.7c-0.4-0.6-1-1.1-1.6-1.4s-1.3-0.5-2.1-0.5c-1.8,0-3.1,0.7-4.1,2.1
		c-0.7,1.1-1.1,2.7-1.1,5c0,2.8,0.4,4.7,1.3,5.7s2,1.6,3.6,1.6c1.5,0,2.6-0.4,3.4-1.3C375.4,47.2,375.9,46,376.3,44.4z"/>
                                                <path d="M386.9,29.5h7.8v8.8h8.5v-8.8h7.8v25.2h-7.8V44.6h-8.5v10.2h-7.8V29.5z"/>
                                                <path d="M431.7,50.6h-8.8l-1.2,4.2h-8l9.5-25.2h8.5l9.5,25.2H433L431.7,50.6z M430.1,45.1l-2.8-9.1l-2.8,9.1H430.1z"/>
                                                <path d="M451.4,39.3h4.2c3.8,0,6.7,0.7,8.5,2c1.8,1.3,2.8,3.4,2.8,6.3c0,2.3-0.8,4.1-2.5,5.3c-1.7,1.2-4.1,1.8-7.3,1.8h-13.4V29.5
		h21.2v5.1h-13.5V39.3z M451.4,49.3h4c2.4,0,3.7-0.9,3.7-2.6c0-1.5-1.2-2.3-3.7-2.3h-4V49.3z"/>
                                            </g>
                                        </svg>
                                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Получите <span className={'text-blue-500'}>индивидуальное коммерческое предложение</span> для вашего проекта</h2>
                                    </div>

                                    <div className="mt-8">
                                        <div>
                                            <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-1">
                                                <div>
                                                    <dt className={'flex items-top'}>
                                                        <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        <p className="ml-3 font-medium text-gray-900">Нефтегазовое оборудования
                                                            ведущего производителя оборудования</p>
                                                    </dt>
                                                </div>
                                                <div>
                                                    <dt className={'flex items-top'}>
                                                        <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        <p className="ml-3 font-medium text-gray-900">На 30% дешевле, чем зарубежные аналоги без потери качества</p>
                                                    </dt>
                                                </div>
                                                <div>
                                                    <dt className={'flex items-top'}>
                                                        <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        <p className="ml-3 font-medium text-gray-900">Срок поставки от 30 дней, в зависимости от сложности изделия
                                                        </p>
                                                    </dt>
                                                </div>
                                                <div>
                                                    <dt className={'flex items-top'}>
                                                        <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        <p className="ml-3 font-medium text-gray-900">Соблюдение гарантийных обязательств производителя</p>
                                                    </dt>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="mt-6">
                                            <form action="#" method="POST" className="space-y-6" name="modal">
                                                <div className={'grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3'}>
                                                    <div>
                                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                            Ваше имя:
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-700 block w-full sm:text-sm border-gray-300 rounded-md"
                                                                placeholder="Иван Иванов"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">
                                                            Тип оборудования
                                                        </label>
                                                        <select
                                                            id="equipment"
                                                            name="equipment"
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                            defaultValue="Canada"
                                                        >
                                                            {categories.map((category) => {
                                                                return (
                                                                    <option value={category.title}>{category.title}</option>
                                                                )
                                                            })}

                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                            Ваш email:
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                id="email"
                                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                                placeholder="you@example.com"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                                                    <div className={'md:col-span-1'}>
                                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                            Ваш телефон:
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                id="phone"
                                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                                placeholder="+7-000-000-00-00"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Способ оповещения</label>
                                                        <fieldset className="mt-4">
                                                            <legend className="sr-only">Метод оповещения</legend>
                                                            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                                                <div className="flex items-center">
                                                                    <input
                                                                        name="notification-method"
                                                                        type="radio"
                                                                        id="send_by_email"
                                                                        defaultChecked={true}
                                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                                    />
                                                                    <label htmlFor={'send_by_email'} className="ml-3 block text-sm font-medium text-gray-700">
                                                                        Email
                                                                    </label>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <input
                                                                        id={'send_by_whatsapp'}
                                                                        name="notification-method"
                                                                        type="radio"
                                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                                    />
                                                                    <label htmlFor={'send_by_whatsapp'} className="ml-3 block text-sm font-medium text-gray-700">
                                                                        WhatsApp
                                                                    </label>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <input
                                                                        id={'send_by_telegram'}
                                                                        name="notification-method"
                                                                        type="radio"
                                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                                    />
                                                                    <label htmlFor={'send_by_telegram'} className="ml-3 block text-sm font-medium text-gray-700">
                                                                        Telegram
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                </div>

                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-700"
                                                    >
                                                        Отправить
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
