import { useEffect, useState } from "react";

export default function useWindowWidth() {
    const [width, setWidth] = useState<number | null>(null)

    useEffect(() => {
        function updateWidth() {
            setWidth(window.innerWidth)
        }
        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    return width
}