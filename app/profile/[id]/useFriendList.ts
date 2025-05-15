import useSWR from "swr";

async function fetchData(url: string) {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error("Failed to fetch")
    }
    return res.json()

}

export function useFriendList(enabled: boolean) {
    const swr = useSWR<number[]>(
        enabled ? "/api/account/friend-list" : null,
        fetchData
    )

    return {
        friends: swr.data,
        mutate: swr.mutate,
        isLoading: swr.isLoading,
        error: swr.error
    }
}