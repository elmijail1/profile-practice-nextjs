"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";
import { useLoggedUser } from "../context/LoggedUserProvider";

export default function LayoutFooter() {

    const { loggedUser, setLoggedUser } = useLoggedUser()
    const currentRoute = usePathname()

    function AuthLink() {
        return (
            <Link
                href="/auth"
                className="footer__link"
                style={currentRoute === "/auth"
                    ? {
                        backgroundColor: "hsl(200,50%,90%)"
                    }
                    : undefined
                }
            >
                Auth
            </Link>
        )
    }

    function ProfileLink() {
        return (
            <Link
                href="/profile"
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
        // setLoggedInUser(null) ?? add it outside this element
        return (
            <Link
                href="/auth"
                onClick={() => setLoggedUser(false)}
                className="footer__link"
            >
                Log Out
            </Link>
        )
    }


    function DetermineButtons() {
        if (currentRoute === "/auth" || currentRoute === "/") {
            return (<><AuthLink /><PeopleLink /></>)
        } else if (currentRoute === "/people" && !loggedUser) {
            return (<><AuthLink /><PeopleLink /></>)
        } else if (currentRoute === "/people" && loggedUser) {
            return (<><LogOutLink /><ProfileLink /></>)
        } else if (currentRoute.includes("/profile")) {
            return (<><LogOutLink /><PeopleLink /></>)
        }
    }


    return (
        <div className="App__MainAbsolute">
            <div className="footer">
                {DetermineButtons()}
            </div >
        </div >
    )
}