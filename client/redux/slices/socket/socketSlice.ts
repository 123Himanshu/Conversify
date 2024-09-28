import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
  message: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  message: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connectSocket(state) {
      state.isConnected = true;
    },
    disconnectSocket(state) {
      state.isConnected = false;
    },
    receiveMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
});

export const { connectSocket, disconnectSocket, receiveMessage } =
  socketSlice.actions;

export default socketSlice.reducer;
