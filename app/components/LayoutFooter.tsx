"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";
import { useLoggedUser } from "../context/LoggedUserProvider";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LayoutFooter() {

    const currentRoute = usePathname()

    const [isSessionLoading, setIsSessionLoading] = useState(true)
    const [error, setError] = useState("")

    const { data: session } = useSession()

    useEffect(() => {
        if (session) {
            setIsSessionLoading(false)
            setError("No errors")
        } else if (!session) {
            setIsSessionLoading(false)
            setError("No session")
        } else if (!session.user) {
            setError("No user object in the session")
        } else if (!session.user.id) {
            setError("No user ID in the session")
        } else {
            setError("Unpredicted error with the session")
        }
    }, [session])

    if (error) {
        console.log(error)
        setError("")
    }

    async function logoutUser() {
        try {
            await signOut({ callbackUrl: "/login" })
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    function LoginLink() {
        return (
            <Link
                href="/login"
                className="footer__link"
                style={currentRoute === "/login"
                    ? {
                        backgroundColor: "hsl(200,50%,90%)"
                    }
                    : undefined
                }
            >
                Login
            </Link>
        )
    }

    function ProfileLink() {
        return (
            <Link
                href={`/profile/${session?.user.id}`}
                className="footer__link"
                style={currentRoute.includes("/profile")
                    ? {
                        backgroundColor: "hsl(200,50%,90%)"
                    }
                    : undefined
                }
            >
                Profile
            </Link>
        )
    }

    function PeopleLink() {
        return (
            <Link
                href="/people"
                className="footer__link"
                style={currentRoute === "/people"
                    ? {
                        backgroundColor: "hsl(200,50%,90%)"
                    }
                    : undefined
                }
            >
                People
            </Link>
        )
    }

    function LogOutLink() {
        return (
            <button
                onClick={logoutUser}
                className="footer__link"
            >
                Log Out
            </button>
        )
    }


    function DetermineButtons() {
        if (currentRoute === "/login") {
            return (<><LoginLink /><PeopleLink /></>)
        } else if (currentRoute === "/people" && !session) {
            return (<><LoginLink /><PeopleLink /></>)
        } else if (currentRoute === "/people" && session) {
            return (<><LogOutLink /><ProfileLink /></>)
        } else if (currentRoute.includes("/profile")) {
            return (<><LogOutLink /><PeopleLink /></>)
        }
    }

    if (isSessionLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="App__MainAbsolute">
            <div className="footer">
                {DetermineButtons()}
            </div >
        </div >
    )
}