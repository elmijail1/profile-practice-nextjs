"use client";

import React, { useState, useEffect, useRef } from "react"
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WideButton from "../components/WideButton";
import AuthFormInput from "./AuthFormInput";
import ErrorPopup from "../components/ErrorPopup";
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick";

export default function SignUpTab() {
    // 1. input
    const [inputData, setInputData] = useState({ email: "", password: "", passwordRepeat: "" })
    function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
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
                // const errorData = await response.json()
                // console.error("Failed to create a user: ", errorData)
                setError("Our app is curently unavailable. Try again.")
                setIsSubmitting(false)
                return
            }
        } catch (error) {
            console.error("Error while creating a user: ", error)
            setError("Our app is curently unavailable. Try again.")
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
                // console.error("Login failed")
                setError("Our app is curently unavailable. Try again.")
                setIsSubmitting(false)
                return
            }

            const session = await getSession()

            if (!session?.user.id) {
                // console.error("Session missing user ID")
                setError("Our app is curently unavailable. Try again.")
                setIsSubmitting(false)
                return
            }

            router.push(`/profile/${session.user.id}`)
        } catch (error) {
            console.error("Error while logging in a user: ", error)
            setError("Our app is curently unavailable. Try again.")
            setIsSubmitting(false)
        }
    }

    function determineButtonText() {
        if (!validatedFull) {
            return "Enter valid details"
        } else if (validatedFull && !isSubmitting) {
            return "Sign up"
        } else if (validatedFull && isSubmitting) {
            return "Signing up..."
        }
    }

    const popupWindowRef = useRef<HTMLDivElement>(null)
    useHandleElsewhereClick(popupWindowRef, "popup-window-error", setError)

    return (
        <>
            <div className="auth-tab">

                <h2>Welcome!</h2>
                <form className="auth-form" onSubmit={handleSubmission}>

                    <AuthFormInput
                        type="email"
                        name="email"
                        value={inputData.email}
                        onChange={handleInput}
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => registerFocus(event.target.name as "email" | "password" | "passwordRepeat")}
                        validation={{
                            trigger: firstFocus.email,
                            isValid: validatedData.email,
                            lastFocus: lastFocus === "email",
                            errorText: "Email must be in the format: something@domain.com"
                        }}
                    >
                        Email
                    </AuthFormInput>

                    <AuthFormInput
                        type="password"
                        name="password"
                        value={inputData.password}
                        onChange={handleInput}
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => registerFocus(event.target.name as "email" | "password" | "passwordRepeat")}
                        validation={{
                            trigger: firstFocus.password,
                            isValid: validatedData.password,
                            lastFocus: lastFocus === "password",
                            errorText: `
                                Password must be 8+ symbols long and contain at least one:
                                · uppercase letter (e.g. A, B, C)
                                · lowercase letter (e.g. a, b, c)
                                · digit (e.g. 1, 2, 3)
                                · special symbol (e.g. _, !, ?)
                            `
                        }}
                    >
                        Password
                    </AuthFormInput>

                    <AuthFormInput
                        type="password"
                        name="passwordRepeat"
                        value={inputData.passwordRepeat}
                        onChange={handleInput}
                        onFocus={() => registerFocus("passwordRepeat")}
                        validation={{
                            trigger: firstFocus.passwordRepeat,
                            isValid: validatedData.passwordRepeat,
                            lastFocus: lastFocus === "passwordRepeat",
                            errorText: "Passwords must match and be 8+ symbols long."
                        }}
                    >
                        Repeat Password
                    </AuthFormInput>

                    <WideButton
                        colors={{ backBG: "hsl(300, 25%, 55%)" }}
                        disabledIf={!validatedFull || isSubmitting}
                    >
                        {determineButtonText()}
                    </WideButton>

                </form>
                {
                    error &&
                    <ErrorPopup
                        error={error}
                        setError={setError}
                        windowReference={popupWindowRef}
                    />
                }
            </div >
        </>
    )
}