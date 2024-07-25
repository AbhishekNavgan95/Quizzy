import React from 'react'

const Button = ({
    type = 'button',
    className = '',
    disabled = false,
    children,
    active = true,
    onClick = () => { }
}) => {
    return (
        <button
            disabled={disabled}
            className={`w-full ${active ? " bg-green-700 hover:bg-green-800 focus:bg-green-800" : " bg-red-700 hover:bg-red-800 focus:bg-red-800"} transiiton-all duration-300 py-2 px-3 rounded-lg ${className}`}
            type={type}>{children}</button>

    )
}

export default Button