import { Session } from "next-auth"
import FooterLink from "./FooterLink"
import FooterLogout from "./FooterLogout"

type DesktopButtonsProps = {
    pathname: string,
    session: Session | null,
    isAuthenticated: boolean
}

export default function DesktopButtons(
    { pathname, session, isAuthenticated }: DesktopButtonsProps) {
    return (
        <>
            <div className="text-gray-600 flex flex-col justify-center leading-4 italic">
                <span>Profile</span>
                <span>Practice</span>
            </div>

            <div className="flex gap-5">
                {
                    !isAuthenticated && (
                        <FooterLink targetPath="/login" currentPath={pathname}>
                            Login
                        </FooterLink>
                    )
                }
                {
                    isAuthenticated && (
                        <>
                            <FooterLogout />
                            <FooterLink targetPath={`/profile/${session?.user.id}`} currentPath={pathname}>
                                Profile
                            </FooterLink>
                        </>
                    )
                }

                <FooterLink targetPath="/people" currentPath={pathname}>
                    People
                </FooterLink>
            </div>
        </>
    )
}