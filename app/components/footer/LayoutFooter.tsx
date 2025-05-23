"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import FooterLink from "./FooterLink";
import FooterLogout from "./FooterLogout";

export default function LayoutFooter() {

    const pathname = usePathname()
    const currentPathId = pathname?.split("/")[2]

    const { data: session, status } = useSession()

    const isAuthenticated = !!session
    const isOwnProfile = session?.user?.id?.toString() === currentPathId
    const isOtherProfile = isAuthenticated && !isOwnProfile

    if (!status || status === "loading") {
        return <div>Loading...</div>
    }

    return (
        <footer className="flex justify-center relative">
            <div className="fixed bottom-0 w-full h-20 bg-white border-t-[0.1rem]
             border-gray-300 z-30 flex justify-center items-center sm:w-[360px] sm:absolute"
            >
                {/* Login Page */}
                {pathname === "/login" && (
                    <>
                        <FooterLink targetPath="/login" currentPath={pathname}>
                            Login
                        </FooterLink>
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )}

                {/* People Page, No Session */}
                {pathname === "/people" && !session && (
                    <>
                        <FooterLink targetPath="/login" currentPath={pathname}>
                            Login
                        </FooterLink>
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )}

                {/* People Page, With Session */}
                {pathname === "/people" && session && (
                    <>
                        <FooterLogout />
                        <FooterLink targetPath={`/profile/${session.user.id}`} currentPath={pathname}>
                            Profile
                        </FooterLink>
                    </>
                )}

                {/* Profile Page, unauthorized */}
                {pathname.startsWith("/profile") && !isAuthenticated && (
                    <>
                        <FooterLink targetPath="/login" currentPath={pathname}>
                            Login
                        </FooterLink>
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )}

                {/* Profile Page, authorized + not yours */}
                {pathname.startsWith("/profile") && isAuthenticated && isOtherProfile && (
                    <>
                        <FooterLogout />
                        <FooterLink targetPath={`/profile/${session.user.id}`} currentPath={pathname}>
                            My Profile
                        </FooterLink>
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )}

                {/* Profile Page, authorized + yours */}
                {pathname.startsWith("/profile") && isAuthenticated && isOwnProfile && (
                    <>
                        <FooterLogout />
                        <FooterLink targetPath="/people" currentPath={pathname}>
                            People
                        </FooterLink>
                    </>
                )}

            </div>
        </footer >
    )
}