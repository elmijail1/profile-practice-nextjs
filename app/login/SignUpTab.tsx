"use client";

import React, { useState, useEffect, useRef } from "react"
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WideButton from "../components/WideButton";
import AuthFormInput from "./AuthFormInput";
import ErrorPopup from "../components/ErrorPopup";
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick";
import debounce from "lodash.debounce"
import { authState } from "@/utilities/authState";

export default function SignUpTab() {
    // 1. input
    const [inputData, setInputData] = useState({ email: "", password: "", passwordRepeat: "" })
    function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setInputData(prevData => ({ ...prevData, [name]: value }))
    }

    // 2. validation
    const [validatedData, setValidatedData] = useState({
        email: false,
        password: false,
        passwordRepeat: false
    })
    const [validatedFull, setValidatedFull] = useState(false)
    const regex = {
        email: /\S+@\S+\.\S+/, // string + @ + string + . + string
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/, // 1+ lowercase alphabet ch; 1+ uppercase alphabet ch; 1+ digit; 1+ special character; total length = 8-15
    }

    const [emailStatus, setEmailStatus] = useState<"idle" | "invalid" | "checking" | "available" | "unavailable">("idle")
    const lastValidEmailRef = useRef<string | null>(null)
    const checkEmailRef = useRef(debounce(checkEmailUniqueness, 1000))

    async function checkEmailUniqueness(emailToCheck: string) {
        if (!emailToCheck || !regex.email.test(emailToCheck)) return
        try {
            const res = await fetch("/api/users/check-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: emailToCheck })
            })

            const data = await res.json()

            if (lastValidEmailRef.current === emailToCheck) {
                setEmailStatus(data.isTaken ? "unavailable" : "available")
            }
        } catch (error) {
            console.error("Failed to check email", error)
            if (lastValidEmailRef.current === emailToCheck) {
                setEmailStatus("unavailable")
            }
        }
    }

    useEffect(() => {
        checkEmailRef.current = debounce(checkEmailUniqueness, 1000)
        return () => checkEmailRef.current.cancel()
    }, [inputData.email])

    useEffect(() => {
        const email = inputData.email
        if (!email) {
            setEmailStatus("idle")
            return
        }

        const emailIsValid = regex.email.test(inputData.email)
        if (!emailIsValid) {
            setEmailStatus("invalid")
            lastValidEmailRef.current = null
            return
        }

        setEmailStatus("checking")
        lastValidEmailRef.current = email
        checkEmailRef.current(email)

    }, [inputData.email])

    useEffect(() => {
        const isEmailValid = !["invalid", "unavailable", "checking", "idle"].includes(emailStatus)
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
    }, [inputData, emailStatus])


    // 3. focus
    const [lastFocus, setLastFocus] = useState("")
    const [firstFocus, setFirstFocus] = useState({ email: false, password: false, passwordRepeat: false })
    function registerFocus(name: "email" | "password" | "passwordRepeat") {
        setLastFocus(name)
        if (firstFocus[name] === false) {
            setFirstFocus(prevFocus => ({ ...prevFocus, [name]: true }))
            if (name === "email") {
                setEmailStatus("invalid")
            }
        }
    }


    // 4. submission
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const [error, setError] = useState("")

    async function handleSubmission(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        
        // Prevent multiple submissions
        if (isSubmitting) return
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
                setError("Registration failed. Please try again.")
                setIsSubmitting(false)
                return
            }

            // sign in the user
            try {
                const response = await signIn("credentials", {
                    redirect: false,
                    email: inputData.email,
                    password: inputData.password
                })

                if (!response?.ok) {
                    setError("Login after registration failed. Please try logging in manually.")
                    setIsSubmitting(false)
                    return
                }

                const session = await getSession()

                if (!session?.user.id) {
                    setError("Session creation failed. Please try logging in manually.")
                    setIsSubmitting(false)
                    return
                }

                // Set authentication flag after successful signup and login
                authState.setAuthenticated()
                router.push(`/profile/${session.user.id}`)
            } catch (error) {
                console.error("Login after registration error:", error)
                setError("Registration successful but login failed. Please try logging in manually.")
                setIsSubmitting(false)
            }
        } catch (error) {
            console.error("Registration error:", error)
            setError("Registration failed. Please try again.")
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

    const [passwordDisplay, setPasswordDisplay] = useState<"password" | "text">("password")

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
                            status: emailStatus,
                            lastFocus: lastFocus === "email"
                        }}
                    >
                        Email
                    </AuthFormInput>

                    <AuthFormInput
                        type={passwordDisplay}
                        name="password"
                        value={inputData.password}
                        onChange={handleInput}
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => registerFocus(event.target.name as "email" | "password" | "passwordRepeat")}
                        validation={{
                            trigger: firstFocus.password,
                            isValid: validatedData.password,
                            lastFocus: lastFocus === "password",
                            errorText: `Password must be 8+ symbols long and contain at least one:
                                · uppercase letter (e.g. A, B, C)
                                · lowercase letter (e.g. a, b, c)
                                · digit (e.g. 1, 2, 3)
                                · special symbol (e.g. _, !, ?)
                            `
                        }}
                        setPasswordDisplay={setPasswordDisplay}
                        passwordAutocomplete={"new-password"}
                    >
                        Password
                    </AuthFormInput>

                    <AuthFormInput
                        type={passwordDisplay}
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
                        setPasswordDisplay={setPasswordDisplay}
                        passwordAutocomplete={"new-password"}
                    >
                        Repeat Password
                    </AuthFormInput>

                    <WideButton
                        colors={{ backBG: "hsl(300, 25%, 55%)" }}
                        disabledIf={!validatedFull || isSubmitting || !!error}
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