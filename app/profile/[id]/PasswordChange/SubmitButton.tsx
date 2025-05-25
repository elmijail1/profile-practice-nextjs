import React from "react";

export default function SubmitButton(
    { disabledIf, children, onClick }:
        { disabledIf?: boolean, children: React.ReactNode, onClick?: any }
) {
    return (
        <button
            type={onClick ? "button" : "submit"}
            className="text-white font-semibold bg-gray-700 w-[70%] rounded-2xl disabled:text-gray-300 xl:cursor-pointer xl:hover:bg-gray-600"
            disabled={disabledIf}
            onClick={onClick ? onClick : null}
        >
            {children}
        </button>
    )
}