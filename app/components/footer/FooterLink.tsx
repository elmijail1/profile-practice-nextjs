import { ReactNode } from "react"
import ProtectedLink from "@/components/ProtectedLink"

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

    const linkClassMob = `h-full w-1/2 border-none uppercase no-underline tracking-[0.05rem] font-bold text-[1.1rem] flex justify-center items-center text-black ${isActive() ? "bg-[hsl(200,50%,90%)]" : "bg-white"}`
    const linkClassDesk = `xl:cursor-pointer xl:h-[2rem] xl:w-max xl:bg-transparent xl:border-b-1 xl:border-solid ${isActive() ? "xl:border-black" : "xl:border-white"} xl:hover:border-black`

    return (
        <ProtectedLink
            href={targetPath}
            className={`${linkClassMob} ${linkClassDesk}`}
        >
            {children}
        </ProtectedLink>
    )
}