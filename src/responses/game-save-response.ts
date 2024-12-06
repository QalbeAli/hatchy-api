import { GameSave } from "../modules/games/game-save";
import { MessageResponse } from "./message-response";

export interface GameSaveResponse extends MessageResponse {
  gameSave: GameSave
}