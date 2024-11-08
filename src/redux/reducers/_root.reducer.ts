import { combineReducers } from "@reduxjs/toolkit"
import user from "./user.reducer"
import player from "./player.reducer"
import monster from "./monster.reducer"
import condition from "./condition.reducer"

const rootReducer = combineReducers({
user,
player,
monster,
condition
})

export default rootReducer