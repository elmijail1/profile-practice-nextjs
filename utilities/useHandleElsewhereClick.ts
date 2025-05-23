import { useEffect } from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export default function useHandleElsewhereClick
    <T extends boolean | string>
    (
        buttonRef: any,
        buttonId: string | string[],
        setButtonActiveState: SetState<T>
    ) {

    function clickingAtCurrentRef(event: any) {
        return buttonRef.current?.contains(event.target)
    }

    function clickingAtThisButton(event: any) {
        if (typeof buttonId === "string") {
            return event.target.id === buttonId
        } else if (Array.isArray(buttonId)) {
            return buttonId.includes(event.target.id)
        }
    }

    useEffect(() => {
        function handleElsewhereClick(event: any) {
            if (
                !clickingAtCurrentRef(event) &&
                !clickingAtThisButton(event)
            ) {
                if (typeof (false as T) === "boolean") {
                    setButtonActiveState(false as T);
                } else if (typeof ("" as T) === "string") {
                    setButtonActiveState("" as T)
                }
            }
        }

        document.addEventListener("mousedown", handleElsewhereClick);

        return () => {
            document.removeEventListener("mousedown", handleElsewhereClick);
        };
    });
}
