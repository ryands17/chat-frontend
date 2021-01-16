import * as React from 'react'
import { API } from 'aws-amplify'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import Observable from 'zen-observable-ts'
import { listRooms, onCreateRoom, createRoom } from '../queries'
import { useHistory } from 'react-router-dom'

export const Rooms = () => {
  const history = useHistory()
  const [newRoom, setNewRoom] = React.useState('')
  const [rooms, setRooms] = React.useState<any[] | null>(null)

  React.useEffect(() => {
    fetchRooms()
    let subscription = (API.graphql({
      query: onCreateRoom,
    }) as Observable<object>).subscribe({
      next: (roomData: any) => {
        setRooms(roomData?.data?.listRooms?.items || null)
      },
    })
    return () => subscription && subscription.unsubscribe()
  }, [])

  async function createARoom() {
    if (!newRoom) return
    try {
      const room: any = await (API.graphql({
        query: createRoom,
        variables: {
          name: newRoom,
        },
      }) as Promise<GraphQLResult>)
      history.push(`/chat/${room.data.createRoom.id}`, {
        name: room.data.createRoom.id,
      })
    } catch (err) {
      console.log('error creating room: ', err)
    }
  }

  async function fetchRooms() {
    try {
      const roomData: any = await (API.graphql({
        query: listRooms,
        variables: { limit: 100 },
      }) as Promise<GraphQLResult>)
      setRooms(roomData?.data?.listRooms?.items || null)
    } catch (err) {
      console.log('list rooms:', err)
    }
  }

  return (
    <div className="mt-14 px-2">
      <div>
        <h2 className="text-3xl text-blue-600">Create Room</h2>
        <input
          placeholder="Room name"
          onChange={e => setNewRoom(e.target.value)}
        />
        <button onClick={createARoom} className="mx-2">
          Create Room
        </button>
      </div>

      <h2 className="text-3xl text-green-600">Available rooms</h2>
      <ul>
        {rooms?.map(room => (
          <li
            className="py-4 px-2 text-2xl cursor-pointer text-blue-600"
            key={room.id}
            onClick={() => {
              history.push(`/chat/${room.id}`, { name: room.name })
            }}
          >
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
