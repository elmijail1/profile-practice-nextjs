"use client";
import AuthTabButton from "./AuthTabButton";
import LogInTab from "./LogInTab"
import SignUpTab from "./SignUpTab"
import { useState } from "react"

export default function Auth() {
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

    return (
        <main>
            <div className={
                `w-full min-h-[45rem] flex flex-col items-center relative pb-20 sm:w-[360px] sm:h-[600px]
                ${activeTab === "login" ? "bg-auth-login" : "bg-auth-signup"}`}
            >
                <section className="
                    h-20 w-full flex justify-center items-center border-solid border-b-[0.2rem] border-white fixed z-20 sm:w-[360px]
                ">
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