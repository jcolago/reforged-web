import { combineReducers } from "@reduxjs/toolkit"
import user from "./user.reducer"
import player from "./player.reducer"
import monster from "./monster.reducer"

const rootReducer = combineReducers({
user,
player,
monster
})

export default rootReducer