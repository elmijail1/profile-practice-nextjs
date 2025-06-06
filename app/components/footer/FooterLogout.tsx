import { authState } from "@/utilities/authState";
import { signOut } from "next-auth/react";

export default function FooterLogout() {

    async function logoutUser() {
        try {
            authState.clearAuthenticated()
            await signOut({ callbackUrl: "/login" })
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    const linkClassMob = `h-full w-1/2 border-none uppercase no-underline tracking-[0.05rem] font-bold text-[1.1rem] flex justify-center items-center text-black`
    const linkClassDesk = `cursor-pointer xl:h-[2rem] xl:w-max xl:bg-transparent xl:border-b-1 xl:border-solid xl:border-white xl:hover:border-black`



    return (
        <button
            onClick={logoutUser}
            className={`${linkClassMob} ${linkClassDesk}`}
        >
            Logout
        </button>
    )
}