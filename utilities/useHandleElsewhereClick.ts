import { useEffect } from "react";

export default function useHandleElsewhereClick(
    buttonRef: any,
    buttonId: string,
    setButtonActiveState: any
) {
    useEffect(() => {
        function handleElsewhereClick(event: any) {
            if (
                !buttonRef.current?.contains(event.target) &&
                event.target.id !== buttonId
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
