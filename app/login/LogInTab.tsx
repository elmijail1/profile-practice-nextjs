"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogInTab() {

    const [inputData, setInputData] = useState({ email: "", password: "" })
    function handleInput(event: any) {
        const { name, value } = event.target
        setInputData(prevData => ({ ...prevData, [name]: value }))
    }

    const [error, setError] = useState("")

    const router = useRouter()

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const response = await signIn("credentials", {
            redirect: false,
            email: inputData.email,
            password: inputData.password
        })

        if (!response?.ok) {
            setError("Invalid email or password")
        } else {
            console.log(response)
            router.push(`/people`)
        }
    }

    return (
        <>
            <div className="auth__sectionform">
                <h2>Welcome back!</h2>
                <form className="auth__form" onSubmit={handleLogin}>
                    <label className="auth__label">
                        Email
                        <input
                            type="email"
                            className="auth__input"
                            name="email"
                            value={inputData.email}
                            onChange={handleInput}
                        />
                    </label>
                    <label className="auth__label">
                        Password
                        <input
                            type="password"
                            className="auth__input"
                            name="password"
                            value={inputData.password}
                            onChange={handleInput}
                        />
                    </label>
                    <div className="auth__formbuttondiv">
                        <button className="auth__formbutton">
                            Log in
                        </button>
                        <button className="auth__formbuttonback" disabled></button>
                    </div>
                </form>
            </div>
        </>
    )
}