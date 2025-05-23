import React, { SetStateAction } from "react";
import SubmitButton from "./SubmitButton";

export default function SuccessMessage(
    { setPasswordWindowOpen }: { setPasswordWindowOpen: React.Dispatch<SetStateAction<boolean>> }
) {
    return (
        <div
            className="w-[90%] text-lg flex flex-col items-center text-center gap-5"

        >
            <p className="text-black">Successfully changed password!</p>
            <SubmitButton
                onClick={() => setPasswordWindowOpen(false)}
            >
                Ok, close the window
            </SubmitButton>
        </div>
    )
}