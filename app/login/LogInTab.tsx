"use client";
import { useState, useRef, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthFormInput from "./AuthFormInput";
import WideButton from "../components/WideButton";
import ErrorPopup from "../components/ErrorPopup";
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick";

export default function LogInTab() {

    const [inputData, setInputData] = useState({ email: "", password: "" })
    function handleInput(event: any) {
        const { name, value } = event.target
        setInputData(prevData => ({ ...prevData, [name]: value }))
    }

    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [validatedData, setValidatedData] = useState({ email: false, password: false })
    const validatedFull = validatedData.email && validatedData.password
    const regex = {
        email: /\S+@\S+\.\S+/, // string + @ + string + . + string
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/, // 1+ lowercase alphabet ch; 1+ uppercase alphabet ch; 1+ digit; 1+ special character; total length = 8-15
    }

    useEffect(() => {
        const isEmailValid = regex.email.test(inputData.email)
        const isPasswordValid = regex.password.test(inputData.password)

        setValidatedData({
            email: isEmailValid,
            password: isPasswordValid,
        })
    }, [inputData])


    function determineButtonText() {
        if (!validatedFull) {
            return "Enter valid Email & Password"
        } else if (validatedFull && !isSubmitting) {
            return "Log in"
        } else if (validatedFull && isSubmitting) {
            return "Logging in..."
        }
    }

    const [lastFocus, setLastFocus] = useState("")
    const [firstFocus, setFirstFocus] = useState({ email: false, password: false })
    function registerFocus(name: "email" | "password") {
        setLastFocus(name)
        if (firstFocus[name] === false) {
            setFirstFocus(prevFocus => ({ ...prevFocus, [name]: true }))
        }
    }

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await signIn("credentials", {
                redirect: false,
                email: inputData.email,
                password: inputData.password
            })

            if (!response?.ok) {
                // console.error("Login failed")
                setError("Invalid email or password. Try again.")
                setIsSubmitting(false)
                return
            }

            const session = await getSession()

            if (!session?.user.id) {
                // console.error("Session missing user ID")
                setError("The app is unavailable. Try again later.")
                setIsSubmitting(false)
                return
            }

            router.push(`/profile/${session.user.id}`)
        } catch (error) {
            // console.error("Error while logging in a user: ", error)
            setError("The app is unavailable. Try again later.")
            setIsSubmitting(false)
        }
    }

    let popupWindowRef = useRef<HTMLDivElement>(null)
    useHandleElsewhereClick(popupWindowRef, "popup-window-error", setError)

    return (
        <>
            <div className="auth-tab">

                <h2>Welcome back!</h2>
                <form className="auth-form" onSubmit={handleLogin}>

                    <AuthFormInput
                        type="email"
                        name="email"
                        value={inputData.email}
                        onChange={handleInput}
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => registerFocus(event.target.name)}

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
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => registerFocus(event.target.name)}
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
                        }}>
                        Password
                    </AuthFormInput>

                    <WideButton disabledIf={!validatedFull || isSubmitting}>
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