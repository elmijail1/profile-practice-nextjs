"use client";
import AuthTabButton from "./AuthTabButton";
import LogInTab from "./LogInTab"
import SignUpTab from "./SignUpTab"
import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick";
import ErrorPopup from "../components/ErrorPopup";

const pageClassMob = `w-full min-h-max h-[calc(100vh-80px)] flex flex-col items-center relative pb-20`
const pageClassDesk = `xl:h-screen xl:pt-[3rem] xl:pb-5`

export function AuthContent() {
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
    const [expiredRedirect, setExpiredRedirect] = useState(false)

    const params = useSearchParams()

    useEffect(() => {
        const reason = params.get("reason")
        if (reason && reason === "expired") {
            setExpiredRedirect(true)
        }
    }, [params])

    const popupWindowRef = useRef<HTMLDivElement>(null)
    useHandleElsewhereClick(popupWindowRef, "popup-window-error", setExpiredRedirect)

    const router = useRouter()

    function setErrorAndClearParams(newStateValue: boolean) {
        router.replace("/login", { scroll: false })
        setExpiredRedirect(newStateValue)
    }

    const tabButtonsMob = `h-20 w-full flex justify-center items-center border-solid border-b-[0.2rem] border-white fixed z-20 ${activeTab === "login" ? "bg-auth-login" : "bg-auth-signup"}`
    const tabButtonsDesk = `xl:max-w-[30rem] xl:gap-[1rem] xl:items-end xl:border-none xl:absolute`

    return (
        <main>
            <div className={`${pageClassMob} ${pageClassDesk} ${activeTab === "login" ? "bg-auth-login" : "bg-auth-signup"}`}>
                <section className={`${tabButtonsMob} ${tabButtonsDesk}`}>
                    <AuthTabButton
                        isActive={activeTab === "login"}
                        onClick={() => setActiveTab("login")}
                    >
                        Log in
                    </AuthTabButton>
                    <AuthTabButton
                        isActive={activeTab === "signup"}
                        onClick={() => setActiveTab("signup")}
                    >
                        Sign up
                    </AuthTabButton>
                </section>
                {
                    activeTab === "login"
                        ? <LogInTab />
                        : <SignUpTab />
                }
            </div>
            {
                expiredRedirect &&
                <ErrorPopup
                    error={"You were logged out due to inactivity. Please log in again"}
                    setError={setErrorAndClearParams}
                    windowReference={popupWindowRef}
                />
            }
        </main>
    )
}

export function AuthLoading() {
    return (
        <main>
            <div className={`${pageClassMob} ${pageClassDesk}`}>
                <div className="text-white text-lg">Loading...</div>
            </div>
        </main>
    )
}

export default function Auth() {
    return (
        <Suspense fallback={<AuthLoading />}>
            <AuthContent />
        </Suspense>
    )
}