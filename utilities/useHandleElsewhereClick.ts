import { useEffect } from "react";

export default function useHandleElsewhereClick(
    buttonRef: any,
    buttonId: string | string[],
    setButtonActiveState: React.Dispatch<React.SetStateAction<boolean>>
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
                setButtonActiveState(false);
            }
        }

        document.addEventListener("mousedown", handleElsewhereClick);

        return () => {
            document.removeEventListener("mousedown", handleElsewhereClick);
        };
    });
}
