import { ReactNode } from "react"

type AuthTabButtonProps = {
    isActive: boolean,
    onClick: () => void,
    children: ReactNode
}

export default function AuthTabButton(
    { isActive, onClick, children }: AuthTabButtonProps
) {

    const tabClassMob = `w-1/2 h-full border-none bg-inherit text-white uppercase tracking-wider font-bold text-[1.1rem] cursor-pointer`
    const tabClassDesk = `xl:max-w-[20rem] xl:max-h-[3.5rem] xl:rounded-2xl xl:border-white xl:border-solid xl:border-2`
    const tabClassActive = `sm:inset-shadow-white-1 xl:border-b-4 xl:text-[1.2rem] ${children === "Log in" ? "xl:bg-[hsl(320,70%,70%)]" : "xl:bg-[hsl(260,70%,35%)]"}`


    return (
        <button
            className={`${tabClassMob} ${tabClassDesk} ${isActive && tabClassActive}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}