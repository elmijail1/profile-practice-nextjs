"use client";
import { useState, useRef, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthFormInput from "./AuthFormInput";
import WideButton from "../components/WideButton";
import ErrorPopup from "../components/ErrorPopup";
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick";
import { authState } from "@/utilities/authState";

export default function LogInTab() {

    const [inputData, setInputData] = useState({ email: "", password: "" })
    function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setInputData(prevData => ({ ...prevData, [name]: value }))
    }

    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [validatedData, setValidatedData] = useState({ email: false, password: false })
    const validatedFull = validatedData.email && validatedData.password
    const regex = {
        email: /\S+@\S+\.\S+/,
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

        // Prevent multiple submissions
        if (isSubmitting) return

        setIsSubmitting(true)

        try {
            const response = await signIn("credentials", {
                redirect: false,
                email: inputData.email,
                password: inputData.password
            })

            if (!response?.ok) {
                setError("Invalid email or password.")
                setIsSubmitting(false)
                return
            }

            const session = await getSession()

            if (!session?.user.id) {
                setError("Login failed. Please try again.")
                setIsSubmitting(false)
                return
            }

            // Set authentication flag after successful login
            authState.setAuthenticated()
            router.push(`/profile/${session.user.id}`)
        } catch (error) {
            console.error("Login error:", error)
            setError("Login failed. Please try again.")
            setIsSubmitting(false)
        }
    }

    const popupWindowRef = useRef<HTMLDivElement>(null)
    useHandleElsewhereClick(popupWindowRef, "popup-window-error", setError)

    const [passwordDisplay, setPasswordDisplay] = useState<"password" | "text">("password")

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
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => registerFocus(event.target.name as "email" | "password")}

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
                        type={passwordDisplay}
                        name="password"
                        value={inputData.password}
                        onChange={handleInput}
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => registerFocus(event.target.name as "email" | "password")}
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
                        passwordAutocomplete={"current-password"}
                    >
                        Password
                    </AuthFormInput>

                    <div className="w-full flex justify-center xl:max-w-[35rem]">
                        <WideButton disabledIf={!validatedFull || isSubmitting || !!error}>
                            {determineButtonText()}
                        </WideButton>
                    </div>
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