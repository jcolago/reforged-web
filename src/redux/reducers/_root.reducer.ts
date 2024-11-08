import { combineReducers } from "@reduxjs/toolkit"
import user from "./user.reducer"
import player from "./player.reducer"
import monster from "./monster.reducer"
import condition from "./condition.reducer"
import playerCondition from "./player_condition.reducer"
import game from "./game.reducer"

const rootReducer = combineReducers({
user,
player,
monster,
condition,
playerCondition,
game
})

export default rootReducer