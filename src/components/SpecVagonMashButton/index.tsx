import {Fragment, useRef} from 'react'
import {Popover, Menu, Transition} from '@headlessui/react'

import {useStore} from '@nanostores/react';
import {isModalOpened} from '../../store';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SpecVagonMashButton({categories, logo}) {

    const $isModalOpened = useStore(isModalOpened);

    return (
        <a href="#" onClick={(e) => {
            e.preventDefault()
            isModalOpened.set(!$isModalOpened)
        }}
           className="order-call w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-700">
            Заказать звонок
        </a>
    )
}
