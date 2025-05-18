import React from "react"

type WideButtonProps = {
    colors?: string,
    disabledIf?: boolean,
    children: React.ReactNode
}

export default function WideButton(
    { colors, disabledIf, children }: WideButtonProps
) {

    const buttonFrontClass = "wide-button-front bg-white disabled:text-[hsl(265,50%,80%)] disabled:bg-[hsl(265,30%,60%)]"
    const buttonBackClass = "wide-button-front bg-[hsl(272,25%,55%)] absolute bottom-[-0.3rem] left-0 z-[-1]"

    return (
        <div className="relative z-0 w-[90%] h-[3rem]">
            <button
                className={`${buttonFrontClass} ${colors}`}
                disabled={disabledIf}
            >
                {children}
            </button>
            <button className={buttonBackClass} disabled></button>
        </div>
    )
}