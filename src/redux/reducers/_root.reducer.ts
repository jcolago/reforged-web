import { combineReducers } from "@reduxjs/toolkit"
import user from "./user.reducer"
import player from "./player.reducer"

const rootReducer = combineReducers({
user,
player
})

export default rootReducer