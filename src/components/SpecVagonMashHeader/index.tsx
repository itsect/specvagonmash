import {Fragment, useRef} from 'react'
import {Popover, Menu, Transition} from '@headlessui/react'

import {useStore} from '@nanostores/react';
import {isModalOpened} from '../../store';

import SpecVagonMashButton from "../SpecVagonMashButton";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SpecVagonMashHeader({categories, logo}) {

    const buttonRef = useRef(null)
    const dropdownRef = useRef(null)
    const timeoutDuration = 200
    let timeout

    const openMenu = () => buttonRef?.current.click()
    const closeMenu = () =>
        dropdownRef?.current?.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true,
                cancelable: true,
            })
        )

    const onMouseEnter = closed => {
        clearTimeout(timeout)
        closed && openMenu()
    }
    const onMouseLeave = open => {
        open && (timeout = setTimeout(() => closeMenu(), timeoutDuration))
    }

    const $isModalOpened = useStore(isModalOpened);

    return (
        <Popover className="relative bg-white border-b-2 border-gray-100 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div
                    className="flex justify-between items-center py-4 lg:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <a href={new URL('https://itsect.github.io/specvagonmash/')}>
                            <span className="sr-only">Workflow</span>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 476.4 89.2" className={'w-auto h-12 lg:h-16 text-3xl'}>
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
                        </a>
                    </div>
                    <div className="-mr-2 -my-2 lg:hidden">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open menu</span>
                            <svg className="h-6 w-6" x-description="Heroicon name: outline/menu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </Popover.Button>
                    </div>
                    <div className={'hidden lg:flex space-x-10 items-center'}>
                        <Menu>
                            {({open}) => (
                                <>
                                    <div
                                        className={'relative'}
                                        onClick={openMenu}
                                        onMouseEnter={() => onMouseEnter(!open)}
                                        onMouseLeave={() => onMouseLeave(open)}
                                    >
                                        <Menu.Button
                                            ref={buttonRef}
                                            className={'group bg-white rounded-md inline-flex items-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-blue-500 hover:text-blue-700'}
                                            as={'a'}
                                            href={null}
                                        >
                                            <span>Продукция</span>
                                            <svg className="text-blue-500 ml-2 h-5 w-5 group-hover:text-gray-500"
                                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true">
                                                <path fillRule="evenodd"
                                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                      clipRule="evenodd"></path>
                                            </svg>
                                        </Menu.Button>
                                        <Transition
                                            show={open}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                            as={Fragment}
                                        >
                                            <Menu.Items
                                                ref={dropdownRef}
                                                onMouseEnter={() => onMouseEnter()}
                                                onMouseLeave={() => onMouseLeave(open)}
                                                className={'absolute z-30 -ml-4 mt-4 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2 outline-none'}
                                            >
                                                <div
                                                    className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                                                        {categories.map((category) => (
                                                            <Menu.Item key={category.id}>
                                                                {({active}) => (
                                                                    <a
                                                                        href={new URL('https://itsect.github.io/specvagonmash/products/' + category.slug)}
                                                                        className={'-m-3 p-3 flex items-start rounded-lg hover:bg-gray-100'}
                                                                    >
                                                                        <p className="mt-1 text-sm text-gray-500">{category.data.title}</p>
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                        ))}
                                                    </div>
                                                    <div
                                                        className="px-5 py-5 bg-gray-50 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                                                        <div className="flow-root">
                                                            <a href={new URL('https://itsect.github.io/specvagonmash/products')}
                                                               className="-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
                                                                <svg className="flex-shrink-0 h-6 w-6 text-blue-500"
                                                                     viewBox="0 0 1024 1024"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M170.666667 298.666667m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z"/>
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M170.666667 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z"/>
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M170.666667 725.333333m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z"/>
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M298.666667 469.333333m40.106666 0l517.12 0q40.106667 0 40.106667 40.106667l0 5.12q0 40.106667-40.106667 40.106667l-517.12 0q-40.106667 0-40.106666-40.106667l0-5.12q0-40.106667 40.106666-40.106667Z"/>
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M298.666667 682.666667m40.106666 0l517.12 0q40.106667 0 40.106667 40.106666l0 5.12q0 40.106667-40.106667 40.106667l-517.12 0q-40.106667 0-40.106666-40.106667l0-5.12q0-40.106667 40.106666-40.106666Z"/>
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M298.666667 256m40.106666 0l517.12 0q40.106667 0 40.106667 40.106667l0 5.12q0 40.106667-40.106667 40.106666l-517.12 0q-40.106667 0-40.106666-40.106666l0-5.12q0-40.106667 40.106666-40.106667Z"/>
                                                                </svg>
                                                                <span className="ml-3">Вся продукция</span>
                                                            </a>
                                                        </div>
                                                        <div className="flow-root">
                                                            <a href={new URL('https://itsect.github.io/specvagonmash/certificates')}
                                                               className="-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">
                                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" >
                                                                    <g>
                                                                        <g fill="currentColor" transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M362.6,3846.9c-120.1-56.2-204.5-150.8-240.3-281.2c-20.4-61.3-25.6-1037.8-20.4-3024.1c7.7-2914.1,7.7-2932,61.3-3001c28.1-38.3,84.4-94.6,122.7-122.7c69-53.7,84.4-53.7,3111-61.3l3039.4-5.1v204.5v204.5H3471H505.7l5.1,2857.9l7.7,2855.4l4493.9,7.7l4491.4,5.1v-2863v-2863H9197h-306.7v-207.1v-204.5l380.9,7.7c416.7,7.7,455,20.4,575.2,184.1c53.7,69,53.7,79.2,53.7,3082.8c0,3003.6,0,3013.8-53.7,3082.9c-28.1,38.3-84.4,94.6-122.7,122.7l-69,53.7l-4593.6,5.1C633.5,3895.4,464.8,3892.9,362.6,3846.9z"/><path d="M1323.7,2668.4v-204.5h3681h3681v204.5v204.5h-3681h-3681V2668.4z"/><path d="M1323.7,1441.4v-204.5h3681h3681v204.5v204.5h-3681h-3681V1441.4z"/><path d="M7548.2,597.9c-28.1-10.2-92-63.9-140.6-115l-89.5-92l-173.8,15.3c-135.5,15.3-184.1,10.2-235.2-23c-92-61.3-143.1-148.3-161-288.9c-17.9-115-25.6-127.8-153.4-194.3c-74.1-40.9-153.4-99.7-173.8-135.5c-58.8-89.5-48.6-237.8,25.6-368.1l63.9-109.9l-66.5-127.8c-117.6-235.2-76.7-373.2,150.8-495.9c130.4-69,135.5-76.7,153.4-207.1c38.3-253.1,143.1-329.8,406.4-301.6l155.9,17.9l127.8-120.1c120.2-112.5,132.9-117.6,242.9-104.8c92,10.2,138,33.2,222.4,117.6l107.3,104.8l184.1-15.3l181.5-17.9l89.5,89.5c71.6,71.6,89.5,115,104.8,230.1c17.9,140.6,20.4,143.1,148.3,201.9c222.4,104.8,281.2,288.9,158.5,498.5L8811-731.4l66.5,125.3c117.6,232.6,69,386-153.4,495.9c-132.9,63.9-135.5,66.5-153.4,209.6c-12.8,107.4-35.8,166.1-89.5,224.9c-69,79.2-79.2,81.8-278.6,81.8c-194.3,0-207.1,5.1-288.9,79.2C7773.2,620.9,7673.5,651.5,7548.2,597.9z M8023.7-15.6c143.2,0,150.8-2.5,163.6-69c28.1-135.5,99.7-242.9,196.8-296.5c63.9-35.8,94.6-69,86.9-94.6c-76.7-232.6-79.2-255.6-30.7-388.6c43.4-127.8,43.4-130.4-2.6-155.9c-102.2-58.8-209.6-194.3-237.7-301.6l-28.1-112.5l-132.9,7.7c-117.6,7.7-150.8-2.5-265.9-79.2c-132.9-89.5-132.9-89.5-178.9-38.3c-79.2,86.9-184.1,127.8-319.5,120.2l-130.4-7.7l-30.7,120.2c-33.2,135.5-109.9,227.5-219.8,273.5c-84.4,35.8-86.9,40.9-35.8,127.8c48.6,84.3,48.6,288.8,0,380.9c-35.8,71.6-33.2,74.1,58.8,132.9c115,76.7,209.6,212.2,209.6,304.2c0,69,2.5,71.6,178.9,81.8c161,7.7,189.2,17.9,258.2,89.5l81.8,79.2l112.5-86.9C7857.5-5.4,7890.8-15.6,8023.7-15.6z"/><path d="M1323.7,214.4V9.9H3471h2147.3v204.5v204.5H3471H1323.7V214.4z"/><path d="M1323.7-1012.6v-204.5H3471h2147.3v204.5v204.5H3471H1323.7V-1012.6z"/><path d="M6691.9-2853.1c0-449.9,7.7-818,15.3-818c7.7,0,219.9,166.2,470.4,370.7s467.8,370.7,483.1,370.7c12.8,0,217.3-155.9,455-347.6c235.2-191.7,444.8-360.4,462.7-375.8c23-17.9,30.7,143.1,30.7,797.5v820.6h-204.5h-204.5v-396.2v-396.2l-268.4,219.8c-189.2,153.4-278.6,212.2-301.6,194.3c-17.9-12.8-140.6-112.5-273.5-219.9l-242.9-196.8l-7.7,398.8l-7.7,396.2h-202h-204.5V-2853.1z"/></g>
                                                                    </g>
                                                                </svg>
                                                                <span className="ml-3">Cертификаты</span>
                                                            </a>
                                                        </div>

                                                    </div>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Menu>
                        <a href={new URL('https://itsect.github.io/specvagonmash/about')}
                           className="whitespace-nowrap inline-flex items-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-blue-500 hover:text-blue-700">
                            О компании
                        </a>

                        <a href={new URL('https://itsect.github.io/specvagonmash/contacts')}
                           className="inline-flex items-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-blue-500 hover:text-blue-700">
                            Контакты
                        </a>
                        <SpecVagonMashButton />
                    </div>

                </div>
            </div>

            <Transition
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden z-30">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                        <div className="pt-5 pb-6 px-5 border-b-2 border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <a href={new URL('https://itsect.github.io/specvagonmash/')} className={'focus:outline-none'}>
                                        <span className="sr-only">Workflow</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 476.4 89.2" className={'w-auto h-12 lg:h-16 text-3xl'}>
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
                                    </a>
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="sr-only">Close menu</span>
                                        <svg className="h-6 w-6" x-description="Heroicon name: outline/x" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </Popover.Button>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 bg-gray-50 py-6">
                            {false &&
                                <div className={'py-6'}>
                                    <p className={'ml-3 text-xl font-medium'}>
                                        Наша продукция:
                                    </p>
                                </div>
                            }
                            <nav className="grid gap-y-8">
                                {categories.map((category) => (
                                    <a
                                        key={'popover' + category.id}
                                        href={new URL('https://itsect.github.io/specvagonmash/products/' + category.slug)}
                                        className="flex items-center rounded-md hover:bg-gray-50"
                                    >
                                        <span className="ml-3 text-base font-medium text-gray-900">{category.data.title}</span>
                                    </a>
                                ))}
                            </nav>
                        </div>
                        <div className="py-6 px-5 space-y-6 ">
                            <div className={'grid grid-cols-2 gap-4'}>
                                <div
                                    className="py-1">
                                    <div className="flow-root">
                                        <a href={new URL('https://itsect.github.io/specvagonmash/products')}
                                           className="inline-flex items-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-blue-500 hover:text-blue-700">
                                            Вся продукция
                                        </a>
                                    </div>
                                </div>
                                <div className={'py-1'}>
                                    <a href={new URL('https://itsect.github.io/specvagonmash/about')}
                                       className="inline-flex items-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-blue-500 hover:text-blue-700">
                                        О компании
                                    </a>
                                </div>
                                <div className={'py-1'}>
                                    <a href={new URL('https://itsect.github.io/specvagonmash/contacts')}
                                       className="inline-flex items-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-blue-500 hover:text-blue-700">
                                        Контакты
                                    </a>
                                </div>
                            </div>

                            <div>
                                <p className="mt-6 text-center text-base font-medium text-gray-500">
                                    <SpecVagonMashButton />
                                </p>
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
