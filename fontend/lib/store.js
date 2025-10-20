import { configureStore } from "@reduxjs/toolkit"
import chatReducer from "./slices/chat-slice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      chat: chatReducer,
    },
  })
}

export const store = makeStore()
