type TEFormProps = {
    children: any,
    windowReference?: any
}

export default function PopupWindow({ children, windowReference = null }: TEFormProps) { //*0.1
    return (
        <div
            className="h-full w-full absolute top-[0] left-[0] flex justify-center items-start pt-[6.5rem] backdrop-filter backdrop-blur-[2px] bg-[hsla(130,_50%,_40%,_0.2)] z-20"
            id="popup-window"
        >
            <div
                className="w-72 px-[0] py-4 bg-[white] rounded-2xl flex flex-col items-center justify-center relative gap-8"
                ref={windowReference ? windowReference : null}
            >
                {children}
            </div>
        </div>
    )
}