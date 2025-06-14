import { ReactNode } from "react"

type AuthTabButtonProps = {
    isActive: boolean,
    onClick: () => void,
    children: ReactNode
}

export default function AuthTabButton(
    { isActive, onClick, children }: AuthTabButtonProps
) {

    const buttonType = children === "Log in" ? "login" : "signup"

    const tabClassMob = `w-1/2 h-full border-none bg-inherit text-white uppercase tracking-wider font-bold text-[1.1rem] cursor-pointer`
    const tabClassDesk = `xl:max-w-[20rem] xl:max-h-[3.5rem] xl:rounded-2xl xl:border-white xl:border-solid xl:border-2`
    const tabClassActive = `inset-shadow-white-1 xl:border-b-4 xl:text-[1.2rem] ${buttonType === "login" ? "xl:bg-[hsl(320,70%,70%)]" : "xl:bg-[hsl(260,70%,35%)]"}`
    const tabClassInactive = `${buttonType === "login" ? "xl:hover:bg-[hsl(320,60%,65%)]" : "xl:hover:bg-[hsl(260,60%,30%)]"}`


    return (
        <button
            className={`${tabClassMob} ${tabClassDesk} ${isActive ? tabClassActive : tabClassInactive}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}