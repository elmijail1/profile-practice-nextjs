import { signOut } from "next-auth/react";

export default function FooterLogout() {

    async function logoutUser() {
        try {
            await signOut({ callbackUrl: "/login" })
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    return (
        <button
            onClick={logoutUser}
            className="h-full w-1/2 border-none bg-white uppercase no-underline tracking-[0.05rem] font-bold text-[1.1rem] flex justify-center items-center text-black"
        >
            Logout
        </button>
    )
}