import useSWR from "swr";

async function fetchOwnFriends(friendList: number[]) {
    const res = await fetch("/api/users/friend-list-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friends: friendList })
    })
    if (!res.ok) {
        throw new Error("Failed to fetch")
    }
    return await res.json()
}

export function useOwnFriendList(enabled: boolean, friendList: number[]) {
    const shouldFetch = enabled && friendList.length > 0
    const key = shouldFetch ? ["/api/users/friend-list-data", friendList] : null
    const swr = useSWR(key, () => fetchOwnFriends(friendList))

    return {
        friendsSelf: swr.data,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate
    }
}