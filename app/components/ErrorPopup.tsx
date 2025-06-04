import React, { SetStateAction } from "react"

type SetError<T> = React.Dispatch<React.SetStateAction<T>>

type ErrorProps<T extends boolean | string> = {
    error: string,
    setError: SetError<T>,
    windowReference?: React.Ref<HTMLDivElement> | null
}

export default function ErrorPopup<T extends boolean | string>(
    { error, setError, windowReference }: ErrorProps<T>) {

    const backgroundClass = "h-full w-full fixed top-[0] left-[0] flex justify-center items-center backdrop-filter backdrop-blur-[2px] bg-[hsl(0,0%,0%,0.3)] z-20"
    const popupClass = "w-[90%] xl:max-w-[30rem] bg-red-400 py-4 px-4 text-white font-semibold rounded-xl text-center flex flex-col items-center gap-2 mb-[4rem]"
    const buttonClass = "rounded-xl px-2 py-1 bg-white text-red-400 w-[50%] xl:hover:cursor-pointer xl:hover:brightness-90"

    return (
        <div className={backgroundClass}>
            <div
                className={popupClass}
                ref={windowReference ? windowReference : null}
                id="popup-window-error"
            >
                <p>{error}</p>
                <button
                    className={buttonClass}
                    onClick={() => {
                        if (typeof (false as T) === "boolean") {
                            setError(false as T)
                        } else if (typeof ("" as T) === "string") {
                            setError("" as T)
                        }
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    )
}