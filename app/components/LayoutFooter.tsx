"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function LayoutFooter() {

    const pathname = usePathname()
    const currentPathId = pathname?.split("/")[2]

    const { data: session, status } = useSession()

    const isAuthenticated = !!session
    const isOwnProfile = session?.user?.id?.toString() === currentPathId
    const isOtherProfile = isAuthenticated && !isOwnProfile

    function isActive(route: string) {
        return pathname === route || pathname.includes(route)
    }

    async function logoutUser() {
        try {
            await signOut({ callbackUrl: "/login" })
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }


    if (!status || status === "loading") {
        return <div>Loading...</div>
    }

    return (
        <div className="App__MainAbsolute">
            <div className="footer">
                {/* Login Page */}
                {pathname === "/login" && (
                    <>
                        <Link
                            href="/login"
                            className="footer__link"
                            style={isActive("/login") ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
                        >
                            Login
                        </Link>
                        <Link
                            href="/people"
                            className="footer__link"
                            style={isActive("/people") ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
                        >
                            People
                        </Link>
                    </>
                )}

                {/* People Page, No Session */}
                {pathname === "/people" && !session && (
                    <>
                        <Link
                            href="/login"
                            className="footer__link"
                            style={isActive("/login") ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
                        >
                            Login
                        </Link>
                        <Link
                            href="/people"
                            className="footer__link"
                            style={isActive("/people") ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
                        >
                            People
                        </Link>
                    </>
                )}

                {/* People Page, With Session */}
                {pathname === "/people" && session && (
                    <>
                        <button
                            onClick={logoutUser}
                            className="footer__link"
                        >
                            Logout
                        </button>
                        <Link
                            href={`/profile/${session.user.id}`}
                            className="footer__link"
                            style={isActive("/people") ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
                        >
                            Profile
                        </Link>
                    </>
                )}

                {/* Profile Page, unauthorized */}
                {pathname.startsWith("/profile") && !isAuthenticated && (
                    <>
                        <Link
                            href="/login"
                            className="footer__link"
                            style={isActive("/login") ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
                        >
                            Login
                        </Link>
                        <Link
                            href="/people"
                            className="footer__link"
                            style={isActive("/people") ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
                        >
                            People
                        </Link>
                    </>
                )}

                {/* Profile Page, authorized + not yours */}
                {pathname.startsWith("/profile") && isAuthenticated && isOtherProfile && (
                    <>
                        <button
                            onClick={logoutUser}
                            className="footer__link"
                        >
                            Logout
                        </button>
                        <Link
                            href={`/profile/${session.user.id}`}
                            className="footer__link"
                        >
                            My Profile
                        </Link>
                        <Link
                            href="/people"
                            className="footer__link"
                            style={isActive("/people") ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
                        >
                            People
                        </Link>
                    </>
                )}

                {/* Profile Page, authorized + yours */}
                {pathname.startsWith("/profile") && isAuthenticated && isOwnProfile && (
                    <>
                        <button
                            onClick={logoutUser}
                            className="footer__link"
                        >
                            Logout
                        </button>
                        <Link
                            href="/people"
                            className="footer__link"
                            style={isActive("/people") ? { backgroundColor: "hsl(200,50%,90%)" } : undefined}
                        >
                            People
                        </Link>
                    </>
                )}

            </div>
        </div>
    )
}