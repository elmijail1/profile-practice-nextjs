import React from "react"

type AuthFormInputProps = {
    type: string,
    name: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    children: React.ReactNode

}

export default function AuthFormInput(
    { type = "text", name, value, onChange, children }: AuthFormInputProps
) {
    const id = `auth-${name}`

    const labelClass = "bg-white min-h-[6.5rem] w-[90%] rounded-[1rem] px-[1.5rem] pt-[1.5rem] pb-[0.5rem] flex flex-col items-start justify-start gap-[0.5rem] font-semibold text-[1.1rem] text-[hsl(0,0%,30%)] relative"
    const inputClass = "  block w-full h-[1.8rem] rounded-[1rem] border-[2.5px] border-[hsl(0,0%,90%)] text-[1rem] px-[0.5rem]  pr-[2.4rem]"

    return (
        <label className={labelClass}>
            {children}
            <input
                className={inputClass}
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
            />
        </label>
    )
}