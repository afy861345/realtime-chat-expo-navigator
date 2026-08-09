import { create } from 'zustand'
import secure from './secure'
import api from './api';
import utils from '../utils';
const responseSearch = (set, get, data) => {
    set((state) => ({
        searchList: data
    }));
};
function responseMessageType(set, get, data) {
    if (data.username !== messagesUsername) return;
    set((state) => ({
        messageTyping: new Date()
    }))
}
function responseMessageSend(set, get, data) {
    const { messagesList, friendList } = get()

    const newFriendList = friendList.map((item) => {
        if (item.friend.username !== data.friend.username) {
            return item
        }

        return {
            ...item,
            preview: data.message.text,
            updated: data.message.created,
        }
    })

    const friendIndex = newFriendList.findIndex(
        (item) => item.friend.username === data.friend.username
    )

    if (friendIndex >= 0) {
        const friend = newFriendList[friendIndex]

        newFriendList.splice(friendIndex, 1)
        newFriendList.unshift(friend)
    }

    set({
        messagesList: [
            data.message,
            ...messagesList,
        ],
        friendList: newFriendList,
        messageTyping: null,
    })
}
function responseFriendNew(set, get, friend) {
    const friendList = [friend, ...get().friendList]
    set((state) => ({
        friendList: friendList
    }))
}
function responseMessageList(set, get, data) {
    set((state) => ({
        messagesList: [
            ...state.messagesList,
            ...data.messages,
        ],
        messagesUsername: data.friend.username,
        messageNext:data.next,

    }))
}
function responseFriendList(set, get, data) {
    set((state) => ({
        friendList: data
    }))
}
function responseRequestList(set, get, connections) {
    set((state) => ({
        requestList: connections
    }))
}
const responseThumbnail = (set, get, data) => {
    set((state) => ({
        user: {
            ...state.user,
            thumbnail: data.thumbnail
        }
    }));
};
function responseRequestAccept(set, get, connection) {
    const { user, requestList, searchList } = get()

    let newRequestList = requestList
    let newSearchList = searchList

    // Remove from request list
    if (user.username === connection.receiver.username) {
        newRequestList = requestList.filter(
            (request) => request.id !== connection.id
        )
    }

    // Update search list status
    if (searchList) {
        const searchIndex = searchList.findIndex((item) =>
            user.username === connection.receiver.username
                ? item.username === connection.sender.username
                : item.username === connection.receiver.username
        )

        if (searchIndex >= 0) {
            newSearchList = [...searchList]

            newSearchList[searchIndex] = {
                ...newSearchList[searchIndex],
                status: 'connected',
            }
        }
    }

    set({
        requestList: newRequestList,
        searchList: newSearchList,
    })
}
function responseRequestConnect(set, get, connection) {
    const { user, searchList, requestList } = get()

    if (user.username === connection.sender.username) {
        const searchIndex = searchList.findIndex(
            (req) => req.username === connection.receiver.username
        )

        if (searchIndex >= 0) {
            const newSearchList = [...searchList]
            newSearchList[searchIndex] = {
                ...newSearchList[searchIndex],
                status: 'pending_me',
            }

            set({
                searchList: newSearchList,
            })
        }
    } else {
        const exists = requestList.some(
            (request) =>
                request.sender.username === connection.sender.username
        )

        if (!exists) {
            set({
                requestList: [connection, ...requestList],
            })
        }
    }
}

const useGlobal = create((set, get) => ({
    //----------------
    //Auth
    //-----------------
    isAuthenticated: false,
    user: {},
    //func
    login: (user, credentials, tokens) => {
        set((state) => ({
            isAuthenticated: true,
            user: user
        }));
        secure.set("credentials", credentials);
        secure.set('tokens', tokens)
    },
    logout: () => {
        set((state) => ({
            isAuthenticated: false,
            user: {}
        }));
        secure.wipe();
    },
    // init
    initialized: false,
    init: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const credentials = await secure.get('credentials');
        if (credentials) {
            try {
                const response = await api({
                    method: 'POST',
                    url: 'signin/',
                    data: {
                        username: credentials.username,
                        password: credentials.password
                    }
                })
                if (response.status !== 200) {
                    throw new Error('Auth error')
                }
                const user = response.data.user
                const tokens = response.data.tokens
                await secure.set('tokens', tokens)
                set((state) => ({
                    initialized: true,
                    isAuthenticated: true,
                    user: user
                }))
                return
            } catch (error) {
                console.log(error);
                secure.wipe();
            }

        }
        set((state) => ({

            initialized: true,

        }))
    },
    // socket

    socket: null,
    socketConnect: async () => {
        const tokens = await secure.get('tokens');
        // utils.log('TOKENS',tokens)
        const address = "10.181.148.230:8000/"
        const socket = new WebSocket(
            `ws://${address}chat/?token=${tokens.access}`
        )
        socket.onopen = () => {
            utils.log("socket onopen");
            socket.send(JSON.stringify({
                source: 'request.list'
            }));
            socket.send(JSON.stringify({
                source: 'friend.list'
            }));
        }
        socket.onmessage = (evevt) => {
            const parsed = JSON.parse(evevt.data)
            utils.log('parsed', parsed)
            const responses = {
                'thumbnail': responseThumbnail,
                'search': responseSearch,
                'request.connect': responseRequestConnect,
                'request.list': responseRequestList,
                'request.accept': responseRequestAccept,
                'friend.list': responseFriendList,
                'message.list': responseMessageList,
                'message.send': responseMessageSend,
                'friend.new': responseFriendNew,
                'message.type': responseMessageType,

            }
            const res = responses[parsed.source]
            if (!res) {
                utils.log(parsed.source, "notfound")
                return
            }
            res(set, get, parsed.data)

        }
        socket.onerror = () => {

        }
        socket.onclose = () => {

        }
        set((state) => ({
            socket: socket
        }))


    },
    socketClose: () => {
        const socket = get().socket
        if (socket) {
            socket.close()

        }
        set((state) => ({
            socket: null
        }))
    },
    // search
    searchList: null,
    uploadSearch: (query) => {
        if (query) {
            const socket = get().socket
            socket.send(JSON.stringify({
                source: 'search',
                query: query
            }))
        } else {
            set((state) => ({
                searchList: null
            }))
        }
    },
    // message
    messageNext: null,

    messagesUsername: null,
    messageSend: (connectionId, message) => {
        const socket = get().socket
        socket.send(JSON.stringify({
            source: 'message.send',
            connectionId: connectionId,
            message: message
        }))
    },
    messagesList: [],
    messagesRequest: (connectionId, page = 0) => {
        //opening first time
        if (page === 0) {
            set((state) => ({
                messagesList: [],
                messagesUsername: null,
                messageNext: null,
                messageTyping: null,
            }))
        }

        const socket = get().socket
        socket.send(JSON.stringify({
            source: 'message.list',
            connectionId: connectionId,
            page: page
        }))
    },
    // typing
    messageType: (username) => {
        const socket = get().socket
        socket.send(JSON.stringify({
            source: 'message.type',
            username: username
        }))
    },
    messageTyping: null,

    // request
    requestList: [],
    requestConnect: (username) => {
        const socket = get().socket
        socket.send(JSON.stringify({
            source: 'request.connect',
            username: username
        }))
    },
    requestAccept: (username) => {
        const socket = get().socket
        socket.send(JSON.stringify({
            source: 'request.accept',
            username: username
        }))
    },
    // friends
    friendList: null,

    // thumbnail
    uploadThumbnail: (file) => {
        const socket = get().socket
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            utils.log("Socket not connected");
            return;
        }
        socket.send(JSON.stringify({
            source: 'thumbnail',
            base64: file.base64,
            filename: file.fileName
        }))
    },

}))
export default useGlobal;