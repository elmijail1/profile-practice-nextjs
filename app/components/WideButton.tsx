import React from "react"

type WideButtonProps = {
    colors?: {
        frontText?: string,
        frontBG?: string,
        backBG?: string,
        border?: string
    },
    disabledIf?: boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    children: React.ReactNode,
}

export default function WideButton(
    { colors, disabledIf, onClick, children }: WideButtonProps
) {

    const buttonFrontClass = "wide-button-front bg-white disabled:text-[hsl(265,50%,80%)] disabled:bg-[hsl(265,30%,60%)] xl:hover:brightness-95"
    const buttonBackClass = "wide-button-front bg-[hsl(272,25%,55%)] absolute bottom-[-0.3rem] left-0 z-[-1]"

    return (
        <div className="relative z-0 w-[90%] h-[2.5rem] xl:h-[3.5rem]">
            <button
                type={onClick ? "button" : "submit"}
                className={buttonFrontClass}
                style={{
                    color: colors?.frontText,
                    backgroundColor: colors?.frontBG,
                    border: colors?.border && `1px solid ${colors?.border}`
                }}
                disabled={disabledIf}
                onClick={onClick}
            >
                {children}
            </button>
            <button
                className={buttonBackClass}
                style={{ backgroundColor: colors?.backBG }}
                disabled
            >
            </button>
        </div >
    )
}