import { useEffect } from "react";

export default function useHandleElsewhereClick(
    buttonRef: any,
    buttonClassName: string,
    setButtonActiveState: any
) {
    useEffect(() => {
        function handleElsewhereClick(event: any) {
            if (
                !buttonRef.current?.contains(event.target) &&
                event.target.className !== buttonClassName
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
