import { Event } from "./event";

export type CreateEventParams = Omit<Event, "uid">;