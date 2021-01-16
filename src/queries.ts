export const listRooms = /* GraphQL */ `
  query ListRooms($limit: Int) {
    listRooms(limit: $limit) {
      items {
        id
        name
        createdAt
      }
    }
  }
`

export const listMessagesForRoom = /* GraphQL */ `
  query ListMessagesForRoom($roomId: ID, $sortDirection: Order) {
    listMessagesForRoom(roomId: $roomId, sortDirection: $sortDirection) {
      items {
        id
        content
        owner
        createdAt
        roomId
      }
    }
  }
`

export const onCreateMessageByRoomId = /* GraphQL */ `
  subscription OnCreateMessageByRoomId($roomId: ID) {
    onCreateMessageByRoomId(roomId: $roomId) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`
export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom {
    onCreateRoom {
      id
      name
      createdAt
    }
  }
`

export const createRoom = /* GraphQL */ `
  mutation CreateRoom($name: String!) {
    createRoom(name: $name) {
      id
      name
      createdAt
    }
  }
`

export const createMessage = /* GraphQL */ `
  mutation CreateMessage($input: MessageInput!) {
    createMessage(input: $input) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`
