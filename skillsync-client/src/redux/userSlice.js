import { createSlice } from "@reduxjs/toolkit"

function setDataDef(state, action) {
  return { loggedIn: true, data: action.payload }
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedIn: false,
    data: undefined,
  },
  reducers: {
    setData: setDataDef,
  }  
})

export const { setData } = userSlice.actions
export default userSlice.reducer
