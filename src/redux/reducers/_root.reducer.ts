import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth.reducer";
import playerReducer from "./player.reducer";
import monsterReducer from "./monster.reducer";
import conditionReducer from "./condition.reducer";
import playerConditionReducer from "./player_condition.reducer";
import gameReducer from "./game.reducer";
import userReducer from "./user.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
  monster: monsterReducer,
  condition: conditionReducer,
  playerCondition: playerConditionReducer,
  game: gameReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;