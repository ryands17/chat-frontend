import * as React from 'react'
import { API, Auth } from 'aws-amplify'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import Observable from 'zen-observable-ts'
import { useParams } from 'react-router-dom'
import {
  createMessage,
  listMessagesForRoom,
  onCreateMessageByRoomId,
  deleteMessage,
} from '../queries'

const scrollToRefWithAnimation = (ref: React.MutableRefObject<any>) => {
  if (!ref.current) return
  window.scrollTo({
    top: ref.current.offsetTop,
    behavior: 'smooth',
  })
}

export const Chat = () => {
  const [chats, setChats] = React.useState<any[]>([])
  const [message, setMessage] = React.useState('')
  const [user, setUser] = React.useState<any>(null)
  const params: any = useParams()
  const scroller = React.useRef<any>(null)

  const scrollToLatest = () => scrollToRefWithAnimation(scroller)

  const setUserState = async () => {
    const user = await Auth.currentAuthenticatedUser()
    setUser(user)
  }

  const sendMessage = async () => {
    if (!message) {
      return
    }

    setTimeout(() => {
      scrollToLatest()
    })

    await API.graphql({
      query: createMessage,
      variables: {
        input: { content: message, roomId: params.id },
      },
    })

    setMessage('')
  }

  React.useEffect(() => {
    let subscription = (API.graphql({
      query: onCreateMessageByRoomId,
      variables: {
        roomId: params.id,
      },
    }) as Observable<object>).subscribe({
      next: async (subscriptionData: any) => {
        const {
          value: { data },
        } = subscriptionData

        let chat = data.onCreateMessageByRoomId
        let chatExists = chats.findIndex(current => current.id === chat.id)

        if (chatExists === -1) {
          setChats(chats => [...chats, chat])
        } else {
          let newChats = [...chats]
          newChats.splice(chatExists, 1)
          setChats(newChats)
        }
        scrollToLatest()
      },
    })

    setUserState()

    return () => {
      subscription && subscription.unsubscribe()
    }
  }, [params, chats])

  React.useEffect(() => {
    const listMessages = async () => {
      try {
        const chats: any = await (API.graphql({
          query: listMessagesForRoom,
          variables: {
            roomId: params.id,
            sortDirection: 'ASC',
          },
        }) as Promise<GraphQLResult>)
        setChats(chats.data?.listMessagesForRoom?.items || null)
        scrollToLatest()
      } catch (err) {
        console.log('listMessages:', err)
      }
    }
    listMessages()
  }, [params])

  const deleteChat = async (chatId: string) => {
    await API.graphql({
      query: deleteMessage,
      variables: {
        id: chatId,
      },
    })
  }

  return (
    <div className="mt-14">
      <h2 className="text-3xl text-green-600">Chat</h2>
      <div style={{ overscrollBehavior: 'none' }}>
        <div className="mt-20 mb-16">
          {chats?.map((chat, i) => {
            return (
              <div
                className="flow-root"
                key={chat.id}
                ref={i === chats.length - 1 ? scroller : null}
              >
                <div
                  className={`w-3/4 mx-4 my-2 p-2 rounded-lg flow-root ${
                    chat.owner === user.username
                      ? 'float-right bg-green-400'
                      : 'bg-gray-300'
                  }`}
                >
                  <div className="flex justify-between">
                    <div>{chat.content}</div>
                    {chat.owner === user.username && (
                      <button
                        className="bg-red-500"
                        onClick={() => deleteChat(chat.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div
        className="fixed w-full flex justify-between"
        style={{ bottom: '0px' }}
      >
        <textarea
          className="flex-grow m-2 py-2 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
          rows={1}
          placeholder="Enter message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{ outline: 'none' }}
        />
        <button
          onClick={sendMessage}
          className="m-2"
          style={{ outline: 'none' }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
