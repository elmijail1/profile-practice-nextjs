"use client";

import { useState, useEffect } from "react"

export default function SignUpTab() {
    const [inputData, setInputData] = useState({ email: "", password: "", passwordRepeat: "" })
    function handleInput(event: any) {
        const { name, value } = event.target
        setInputData(prevData => ({ ...prevData, [name]: value }))
    }

    const regex = {
        email: /\S+@\S+\.\S+/, // string + @ + string + . + string
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/, // 1+ lowercase alphabet ch; 1+ uppercase alphabet ch; 1+ digit; 1+ special character; total length = 8-15
    }

    useEffect(() => {
        let resultEmail = regex.email.test(inputData.email)
        if (resultEmail) {
            setValidatedData(prevData => ({ ...prevData, email: true }))
        } else {
            setValidatedData(prevData => ({ ...prevData, email: false }))
        }
    }, [inputData])

    useEffect(() => {
        let resultPassword = regex.password.test(inputData.password)
        if (resultPassword) {
            setValidatedData(prevData => ({ ...prevData, password: true }))
        } else {
            setValidatedData(prevData => ({ ...prevData, password: false }))
        }
    }, [inputData])

    useEffect(() => {
        if (inputData.passwordRepeat.length > 0 && inputData.password === inputData.passwordRepeat) {
            setValidatedData(prevData => ({ ...prevData, passwordRepeat: true }))
        } else {
            setValidatedData(prevData => ({ ...prevData, passwordRepeat: false }))
        }
    }, [inputData])


    const [validatedData, setValidatedData] = useState({ email: false, password: false, passwordRepeat: false })

    const [validatedFull, setValidatedFull] = useState(false)
    useEffect(() => {
        if (validatedData.email === true && validatedData.password === true && validatedData.passwordRepeat === true) {
            setValidatedFull(true)
        }
        if (validatedData.email === false || validatedData.password === false || validatedData.passwordRepeat === false) {
            setValidatedFull(false)
        }
    })

    const [lastFocus, setLastFocus] = useState("")
    const [firstFocus, setFirstFocus] = useState({ email: false, password: false, passwordRepeat: false })

    function registerFocus(name: "email" | "password" | "passwordRepeat") {
        setLastFocus(name)
        if (firstFocus[name] === false) {
            setFirstFocus(prevFocus => ({ ...prevFocus, [name]: true }))
        }
    }

    return (
        <>
            <div className="auth__sectionform__signup">
                <h2>Welcome!</h2>
                <form className="auth__form">
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
                            {/* 
                            {
                                firstFocus.email
                                && <ValidationIndicator validatedData={validatedData} dataField="email" />
                            }
                            */}
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
                            {/* 
                            {
                                firstFocus.password
                                && <ValidationIndicator validatedData={validatedData} dataField="email" />
                            }
                            */}
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
                            {/* 
                            {
                                firstFocus.passwordRepeat
                                && <ValidationIndicator validatedData={validatedData} dataField="email" />
                            }
                            */}
                        </div>
                        {
                            lastFocus === "passwordRepeat" && !validatedData.passwordRepeat &&
                            <div className="warning">
                                Passwords must match and be 8+ symbols long.
                            </div>
                        }
                    </label>

                    <div className="auth__formbuttondiv">
                        <button
                            className="auth__formbutton"
                            disabled={!validatedFull && true}
                        >
                            Sign up
                        </button>
                        <button className="auth__formbuttonback__signup" disabled></button>
                    </div>
                </form>
            </div>
        </>
    )
}