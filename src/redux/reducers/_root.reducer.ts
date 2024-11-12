import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user.reducer";
import playerReducer from "./player.reducer";
import monsterReducer from "./monster.reducer";
import conditionReducer from "./condition.reducer";
import playerConditionReducer from "./player_condition.reducer";
import gameReducer from "./game.reducer";

const rootReducer = combineReducers({
  user: userReducer,
  player: playerReducer,
  monster: monsterReducer,
  condition: conditionReducer,
  playerCondition: playerConditionReducer,
  game: gameReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;