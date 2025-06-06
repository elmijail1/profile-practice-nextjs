import React, { SetStateAction } from "react"
import ValidationIndicator from "./ValidationIndicator"

type AuthFormInputProps = {
    type: string,
    name: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    children: React.ReactNode,
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void,
    validation?: {
        trigger: boolean,
        isValid: boolean,
        status?: "idle" | "invalid" | "checking" | "available" | "unavailable",
        lastFocus: boolean,
        errorText?: string
    },
    setPasswordDisplay?: React.Dispatch<SetStateAction<"password" | "text">>,
    passwordAutocomplete?: "current-password" | "new-password"
}

export default function AuthFormInput(
    { type = "text", name, value, onChange, children, onFocus, validation, setPasswordDisplay, passwordAutocomplete }: AuthFormInputProps
) {
    const id = `auth-${name}`

    const labelClass = "bg-white min-h-[6.5rem] w-[90%] rounded-[1rem] px-[1.5rem] pt-[1.5rem] pb-[0.5rem] flex flex-col items-start justify-start gap-[0.5rem] font-semibold text-[1.1rem] text-[hsl(0,0%,30%)] relative"
    const inputClass = "block w-full h-[1.8rem] rounded-[1rem] border-[2.5px] border-[hsl(0,0%,90%)] text-[1rem] px-[0.5rem]  pr-[2.4rem]"
    const statusMessageClass = "text-[1rem] font-medium text-[hsl(0,0%,40%)] pb-2 whitespace-pre-line"


    function determineStatusText() {
        const status = validation?.status
        if (status === "idle") {
            return
        } else if (status === "invalid") {
            return `Email must be in the format:
            something@domain.com`
        } else if (status === "checking") {
            return "Checking..."
        } else if (status === "available") {
            return "Available!"
        } else if (status === "unavailable") {
            return `This email is not available.
            Try another.`
        }
    }

    return (
        <label className={labelClass}>
            {children}
            <div className="w-full">
                <div className="relative">
                    <input
                        className={inputClass}
                        id={id}
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onFocus={onFocus}
                        autoComplete={passwordAutocomplete ? passwordAutocomplete : undefined}
                    />

                    {/* an indicator showing if the field is valid */}
                    {
                        validation?.trigger &&
                        <ValidationIndicator
                            isValid={validation.isValid}
                        />
                    }
                </div>
                {
                    name === "password" && value &&
                    <button
                        type="button"
                        onClick={() => {
                            type === "password"
                                ? setPasswordDisplay!("text")
                                : setPasswordDisplay!("password")
                        }}
                        className="text-[1rem] mt-[0.3rem] w-full text-center underline"
                    >
                        {type === "password" ? "Show" : "Hide"} password
                    </button>
                }
            </div>

            {/* error message if the field is invalid */}
            {
                !validation?.isValid && validation?.lastFocus && !validation.status &&
                <div className={statusMessageClass}>
                    {validation.errorText}
                </div>
            }
            {
                validation?.status && validation?.lastFocus &&
                <div className={statusMessageClass}>
                    {determineStatusText()}
                </div>
            }

        </label >
    )
}