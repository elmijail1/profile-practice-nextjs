import useSWR from "swr";

async function fetchOwnFriends(friendList: number[], page: number, limit: number) {
    const res = await fetch("/api/users/friend-list-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            friends: friendList,
            page: page || 1,
            limit: limit || 5
        })
    })
    if (!res.ok) {
        throw new Error("Failed to fetch")
    }
    return await res.json()
}

export function useOwnFriendList(enabled: boolean, friendList: number[], page: number, limit: number) {
    const shouldFetch = enabled && friendList.length > 0
    const key = shouldFetch ? ["/api/users/friend-list-data", friendList, page, limit] : null
    const swr = useSWR(key, () => fetchOwnFriends(friendList, page, limit))

    return {
        friendsSelf: swr.data?.users,
        totalSelf: swr.data?.total,
        isLoading: swr.isLoading,
        error: swr.error,
        mutate: swr.mutate
    }
}