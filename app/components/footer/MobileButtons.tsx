import { Session } from "next-auth"
import FooterLink from "./FooterLink"
import FooterLogout from "./FooterLogout"

type MobileButtonsProps = {
    pathname: string,
    session: Session | null,
    isAuthenticated: boolean,
    isOwnProfile: boolean,
    isOtherProfile: boolean
}

export default function MobileButtons(
    { pathname, session, isAuthenticated, isOwnProfile, isOtherProfile }: MobileButtonsProps) {
    return (
        <>
            {/* Login Page */}
            {
                pathname === "/login" && (
                    <>
                        <FooterLink targetPath="/login" currentPath={pathname}>
                            Login
                        </FooterLink>
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )
            }

            {/* People Page, No Session */}
            {
                pathname === "/people" && !session && (
                    <>
                        <FooterLink targetPath="/login" currentPath={pathname}>
                            Login
                        </FooterLink>
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )
            }

            {/* People Page, With Session */}
            {
                pathname === "/people" && session && (
                    <>
                        <FooterLogout />
                        <FooterLink targetPath={`/profile/${session.user.id}`} currentPath={pathname}>
                            Profile
                        </FooterLink>
                    </>
                )
            }

            {/* Profile Page, unauthorized */}
            {
                pathname.startsWith("/profile") && !isAuthenticated && (
                    <>
                        <FooterLink targetPath="/login" currentPath={pathname}>
                            Login
                        </FooterLink>
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )
            }

            {/* Profile Page, authorized + not yours */}
            {
                pathname.startsWith("/profile") && isAuthenticated && isOtherProfile && (
                    <>
                        <FooterLogout />
                        <FooterLink targetPath={`/profile/${session?.user.id}`} currentPath={pathname}>
                            My Profile
                        </FooterLink>
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )
            }

            {/* Profile Page, authorized + yours */}
            {
                pathname.startsWith("/profile") && isAuthenticated && isOwnProfile && (
                    <>
                        <FooterLogout />
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )
            }
        </>
    )
}