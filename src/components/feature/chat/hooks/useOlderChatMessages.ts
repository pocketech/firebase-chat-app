import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore'
import useSWRInfinite from 'swr/infinite'

import { db } from '@/libs/firebase'

import type { Message } from '../types'

type Params = {
  chatId: string | undefined
  limit: number
  after: Date
}

export const useOlderChatMessages = (params: Params) => {
  const getKey = (
    pageIndex: number,
    previousPageData: Message[]
  ): (Omit<Params, 'chatId'> & { chatId: string }) | null => {
    console.info('previous', previousPageData)
    console.info('page', pageIndex)

    // previousPageDataが[]のとき
    if (previousPageData && !previousPageData.length) return null

    const after =
      previousPageData && previousPageData.length > 0
        ? previousPageData[previousPageData.length - 1].createdAt
        : params.after

    return after && params.chatId && params.limit
      ? {
          after,
          chatId: params.chatId,
          limit: params.limit,
        }
      : null
  }
  const fetcher = async (params: Omit<Params, 'chatId'> & { chatId: string }) => {
    const snapshot = await getDocs(
      query(
        collection(db, 'chats', params.chatId, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(params.limit),
        startAfter(params.after)
      )
    )

    return snapshot.docs.map((doc) => {
      const data = doc.data({ serverTimestamps: 'estimate' })

      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      }
    }) as Message[]
  }
  const { data, size, setSize, error, mutate } = useSWRInfinite(getKey, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  const messages = data ? data.flatMap((item) => item) : []
  const loadMore = () => {
    setSize(size + 1)
  }

  const isLoadingInitialData = !data && !error
  // const isLoadingMore =
  //   isLoadingInitialData || (size > 0 && !!data && typeof data[size - 1] === 'undefined')

  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (!!data && data[data.length - 1].length < params.limit)

  return {
    messages,
    error,
    isLoadingInitialData,
    isReachingEnd,
    loadMore,
    mutate,
  }
  // const loadMore = () => setAfter(totalMessages[totalMessages.length - 1].createdAt)
  // const [totalMessages, setTotalMessages] = useState<Message[]>([])
  // const [snapshot, isLoading, error] = useCollection(
  //   params.chatId && after
  //     ? query(
  //         collection(db, 'chats', params.chatId, 'messages'),
  //         orderBy('createdAt', 'desc'),
  //         startAfter(after),
  //         limit(params.limit)
  //       )
  //     : undefined
  // )

  // useEffect(() => {
  //   if (snapshot) {
  //     const added: Message[] = []
  //     const modified: Message[] = []
  //     const removed: Message[] = []

  //     snapshot.docChanges().forEach((change) => {
  //       const data = change.doc.data({ serverTimestamps: 'estimate' })
  //       const message = {
  //         ...data,
  //         id: change.doc.id,
  //         createdAt: data.createdAt.toDate(),
  //         updatedAt: data.updatedAt.toDate(),
  //       } as Message

  //       if (change.type === 'added') return added.push(message)
  //       if (change.type === 'modified') return modified.push(message)
  //       if (change.type === 'removed') return removed.push(message)
  //     })

  //     if (added.length > 0) setTotalMessages([...added])
  //     if (modified.length > 0)
  //       setTotalMessages((prev) =>
  //         prev.map((message) => {
  //           const found = modified.find((m) => m.id === message.id)

  //           if (found) return found

  //           return message
  //         })
  //       )
  //     if (removed.length > 0)
  //       setTotalMessages((prev) => prev.filter((message) => !removed.includes(message)))
  //     console.info({ added, modified, removed })
  //   }
  // }, [snapshot])

  // const messages = useMemo(() => {
  //   return snapshot
  //     ? (snapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //         createdAt: doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
  //         updatedAt: doc.data({ serverTimestamps: 'estimate' }).updatedAt.toDate(),
  //       })) as Message[])
  //     : []
  // }, [snapshot])

  // useEffect(() => {
  //   if (messages) {
  //     setTotalMessages((prev) => [...prev, ...messages])
  //   }
  // }, [messages])
}
