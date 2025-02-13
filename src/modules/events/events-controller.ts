import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Event } from "./event";
import { EventsService } from "./events-service";
import { CreateEventParams } from "./create-event-params";

@Security("jwt", ["admin"])
@Route("events")
@Tags("Events")
export class EventsController extends Controller {
  @Get("")
  public async getEvents(
  ): Promise<Event[]> {
    const items = await new EventsService().getEvents();
    return items;
  }

  @Post("")
  public async createEvent(
    @Body() body: CreateEventParams,
  ): Promise<Event> {
    const item = await new EventsService().createEvent(body);
    return item;
  }

  @Delete("{uid}")
  public async deleteEvent(
    uid: string,
  ): Promise<void> {
    await new EventsService().deleteEvent(uid);
  }
}