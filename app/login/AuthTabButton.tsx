import { ReactNode } from "react"

type AuthTabButtonProps = {
    isActive: boolean,
    onClick: () => void,
    children: ReactNode
}

export default function AuthTabButton(
    { isActive, onClick, children }: AuthTabButtonProps
) {

    const baseClass = "w-1/2 h-full border-none bg-inherit text-white uppercase tracking-wider font-bold text-[1.1rem] cursor-pointer"

    return (
        <button
            className={
                `${baseClass} ${isActive ? "inset-shadow-white-1" : ""}`
            }
            onClick={onClick}
        >
            {children}
        </button>
    )
}