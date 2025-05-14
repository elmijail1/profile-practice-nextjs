import useSWR from "swr";

async function fetchData(url: string) {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error("Failed to fetch")
    }
    return res.json()

}

export function useFriendList() {
    const { data: friends, mutate, isLoading, error } = useSWR<number[]>(
        "/api/account/friend-list",
        fetchData
    )
    return { friends, mutate, isLoading, error }
}