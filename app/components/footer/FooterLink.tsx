import Link from "next/link"
import { ReactNode } from "react"

type FooterLinkProps = {
    children: ReactNode,
    targetPath: string,
    currentPath: string
}

export default function FooterLink(
    { children, targetPath, currentPath }: FooterLinkProps
) {

    function isActive() {
        return currentPath === targetPath || currentPath.includes(targetPath)
    }

    return (
        <Link
            href={targetPath}
            className="h-full w-1/2 border-none bg-white uppercase no-underline tracking-[0.05rem] font-bold text-[1.1rem] flex justify-center items-center text-black"
            style={isActive() ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
        >
            {children}
        </Link>
    )
}