"use client";

import { useState, useEffect } from "react"
import ValidationIndicator from "./ValidationIndicator";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WideButton from "../components/WideButton";

export default function SignUpTab() {
    // 1. input
    const [inputData, setInputData] = useState({ email: "", password: "", passwordRepeat: "" })
    function handleInput(event: any) {
        const { name, value } = event.target
        setInputData(prevData => ({ ...prevData, [name]: value }))
    }

    // 2. validation
    const [validatedData, setValidatedData] = useState({ email: false, password: false, passwordRepeat: false })
    const [validatedFull, setValidatedFull] = useState(false)
    const regex = {
        email: /\S+@\S+\.\S+/, // string + @ + string + . + string
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/, // 1+ lowercase alphabet ch; 1+ uppercase alphabet ch; 1+ digit; 1+ special character; total length = 8-15
    }
    useEffect(() => {
        const isEmailValid = regex.email.test(inputData.email)
        const isPasswordValid = regex.password.test(inputData.password)
        const isPasswordRepeatValid =
            inputData.passwordRepeat.length > 0 &&
            inputData.password === inputData.passwordRepeat

        const allValid = isEmailValid && isPasswordValid && isPasswordRepeatValid

        setValidatedData({
            email: isEmailValid,
            password: isPasswordValid,
            passwordRepeat: isPasswordRepeatValid
        })

        setValidatedFull(allValid)
    }, [inputData])


    // 3. focus
    const [lastFocus, setLastFocus] = useState("")
    const [firstFocus, setFirstFocus] = useState({ email: false, password: false, passwordRepeat: false })
    function registerFocus(name: "email" | "password" | "passwordRepeat") {
        setLastFocus(name)
        if (firstFocus[name] === false) {
            setFirstFocus(prevFocus => ({ ...prevFocus, [name]: true }))
        }
    }

    // 4. submission
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const [error, setError] = useState("")

    async function handleSubmission(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)

        // create a user
        try {
            const response = await fetch(`/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputData)
            })

            if (!response.ok) {
                setError("Error creating user")
                const errorData = await response.json()
                console.error("Failed to create a user: ", errorData)
                return
            }

            const createdUser: { email: string } = await response.json()
            console.log(createdUser)
        } catch (error) {
            console.error("Error while creating a user: ", error)
        } finally {
            setIsSubmitting(false)
        }

        // sign in the user
        try {
            const response = await signIn("credentials", {
                redirect: false,
                email: inputData.email,
                password: inputData.password
            })

            if (!response?.ok) {
                console.error("Login failed")
                setError("Invalid email or password")
                return
            }

            const session = await getSession()

            if (!session?.user.id) {
                console.error("Session missing user ID")
                setError("Session missing user ID")
                return
            }

            router.push(`/profile/${session.user.id}`)
        } catch (error) {
            console.error("Error while logging in a user: ", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="auth-tab">

                <h2>Welcome!</h2>
                <form className="auth-form" onSubmit={handleSubmission}>

                    <label className="auth__label">
                        Email
                        <div className="auth__inputwrapper">
                            <input
                                type="email"
                                className="auth__input"
                                name="email"
                                value={inputData.email}
                                onChange={handleInput}
                                onFocus={(event: any) => registerFocus(event.target.name)}
                            />

                            {
                                firstFocus.email
                                && <ValidationIndicator validatedData={validatedData} dataField="email" />
                            }

                        </div>
                        {
                            lastFocus === "email" && !validatedData.email &&
                            <div className="warning">
                                Email must be in the format: something@domain.com
                            </div>
                        }
                    </label>

                    <label className="auth__label">
                        Password
                        <div className="auth__inputwrapper">
                            <input
                                type="password"
                                className="auth__input"
                                name="password"
                                value={inputData.password}
                                onChange={handleInput}
                                onFocus={(event: any) => registerFocus(event.target.name)}
                            />
                            {
                                firstFocus.password
                                && <ValidationIndicator validatedData={validatedData} dataField="password" />
                            }
                        </div>
                        {
                            lastFocus === "password" && !validatedData.password &&
                            <div className="warning">
                                Password must be 8+ symbols long and contain at least one:<br />
                                · uppercase letter (e.g. A, B, C)<br />
                                · lowercase letter (e.g. a, b, c)<br />
                                · digit (e.g. 1, 2, 3)<br />
                                · special symbol (e.g. _, !, ?)<br />
                            </div>
                        }
                    </label>

                    <label className="auth__label">
                        Repeat Password
                        <div className="auth__inputwrapper">
                            <input
                                type="password"
                                className="auth__input"
                                name="passwordRepeat"
                                value={inputData.passwordRepeat}
                                onChange={handleInput}
                                onFocus={(event: any) => registerFocus(event.target.name)}
                            />
                            {
                                firstFocus.passwordRepeat
                                && <ValidationIndicator validatedData={validatedData} dataField="passwordRepeat" />
                            }
                        </div>
                        {
                            lastFocus === "passwordRepeat" && !validatedData.passwordRepeat &&
                            <div className="warning">
                                Passwords must match and be 8+ symbols long.
                            </div>
                        }
                    </label>

                    <WideButton
                        colors={{ backBG: "hsl(300, 25%, 55%)" }}
                        disabledIf={!validatedFull || isSubmitting}
                    >
                        Sign up
                    </WideButton>

                </form>
            </div >
        </>
    )
}