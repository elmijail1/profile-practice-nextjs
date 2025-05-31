import React from "react";

export default function SubmitButton(
    { disabledIf, children, onClick }:
        {
            disabledIf?: boolean,
            children: React.ReactNode,
            onClick?: React.MouseEventHandler<HTMLButtonElement>
        }
) {
    return (
        <button
            type={onClick ? "button" : "submit"}
            className="text-white font-semibold bg-gray-700 min-w-[70%] px-5 rounded-2xl disabled:text-gray-400 xl:cursor-pointer xl:hover:bg-gray-600"
            disabled={disabledIf}
            onClick={onClick ?? undefined}
        >
            {children}
        </button>
    )
}