import { ReactNode, RefObject } from "react"

type TEFormProps = {
    children: ReactNode,
    windowReference?: RefObject<HTMLDivElement | null> | null
}

export default function PopupWindow({ children, windowReference = null }: TEFormProps) {
    const blurredBGClass = "h-full w-full fixed top-[0] left-[0] flex justify-center items-start pt-[5rem] backdrop-filter backdrop-blur-[2px] bg-[hsla(130,_50%,_40%,_0.2)] z-20 min-h-650\:no-padding"
    const windowClassNormal = "w-72 px-[0] py-4 bg-[white] rounded-2xl flex flex-col items-center justify-center relative gap-8 min-h-650:full-screen"

    return (
        <div className={blurredBGClass}>
            <div
                className={windowClassNormal}
                ref={windowReference ? windowReference : null}
                id="popup-window"
            >
                {children}
            </div>
        </div >
    )
}