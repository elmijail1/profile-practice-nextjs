import React, { SetStateAction } from "react"

type ErrorProps = {
    error: string,
    setError: React.Dispatch<SetStateAction<string>>,
    windowReference?: React.Ref<HTMLDivElement> | null
}

export default function ErrorPopup(
    { error, setError, windowReference }: ErrorProps) {
    return (
        <div
            className="h-full w-full fixed top-[0] left-[0] flex justify-center items-center backdrop-filter backdrop-blur-[2px] bg-[hsl(0,0%,0%,0.3)] z-20"
        >
            <div
                className="w-[90%] bg-red-400 py-4 px-4 text-white font-semibold rounded-xl text-center flex flex-col items-center gap-2 mb-[4rem]"
                ref={windowReference ? windowReference : null}
                id="popup-window-error"
            >
                <p>{error}</p>
                <button
                    className="rounded-xl px-2 py-1 bg-white text-red-400 w-[50%]"
                    onClick={() => setError("")}
                >
                    Close
                </button>
            </div>
        </div>
    )
}