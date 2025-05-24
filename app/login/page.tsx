"use client";
import AuthTabButton from "./AuthTabButton";
import LogInTab from "./LogInTab"
import SignUpTab from "./SignUpTab"
import { useState } from "react"

export default function Auth() {
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

    const tabButtonsMob = `h-20 w-full flex justify-center items-center border-solid border-b-[0.2rem] border-white fixed z-20 ${activeTab === "login" ? "bg-auth-login" : "bg-auth-signup"}`
    const tabButtonsDesk = `xl:max-w-[30rem] xl:gap-[1rem] xl:items-end xl:border-none`

    return (
        <main>
            <div className={
                `w-full min-h-max h-[calc(100vh-80px)] flex flex-col items-center relative pb-20
                ${activeTab === "login" ? "bg-auth-login" : "bg-auth-signup"}`}
            >
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
        </main>
    )
}