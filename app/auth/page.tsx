"use client";
// import LogInTab from "../components/Auth/LogInTab"
// import SignUpTab from "../components/Auth/SignUpTab"
import { useState } from "react"

export default function Auth() {
    const [activeTab, setActiveTab] = useState("login")

    return (
        // ADD THIS BELOW AS A SIBLING TO THE SECTION
        //         {
        //             activeTab === "login"
        //                 ? <LogInTab />
        //                 : <SignUpTab />
        //         }

        <main className="App_Main">
            <div className={`screen ${activeTab === "login" ? "screen__purple" : "screen__pink"}`}>
                <section className={`auth__sectionbuttons ${activeTab === "login" ? "screen__purple" : "screen__pink"}`}>
                    <button
                        className={activeTab === "login" ? "auth__topbuttonactive" : "auth__topbutton"}
                        onClick={() => setActiveTab("login")}
                    >
                        Log in
                    </button>
                    <button
                        className={activeTab === "signup" ? "auth__topbuttonactive" : "auth__topbutton"}
                        onClick={() => setActiveTab("signup")}
                    >
                        Sign up
                    </button>
                </section>
            </div>
        </main>
    )
}