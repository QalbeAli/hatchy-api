import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { BadRequestError } from "../../errors/bad-request-error";
import { MessageResponse } from "../../responses/message-response";
import { ReferralsService } from "./referrals-service";
import { User } from "../users/user";
import * as express from "express";

interface ReferralStats {
  referralCount: number;
  xpPoints: number;
  referrer: User | null;
  recentReferrals: User[];
}

@Route("referrals")
@Tags("Referrals")
export class ReferralsController extends Controller {
  private referralsService: ReferralsService;

  constructor() {
    super();
    this.referralsService = new ReferralsService();
  }

  /**
   * Get the referrer of the authenticated user
   */
  @Security("jwt")
  @Get("referrer")
  public async getReferrer(
    @Request() request: express.Request
  ): Promise<User | null> {
    const userId = (request as any).user.uid;
    return this.referralsService.getReferrer(userId);
  }

  /**
   * Get all users referred by the authenticated user
   */
  @Security("jwt")
  @Get("referred-users")
  public async getReferredUsers(
    @Request() request: express.Request
  ): Promise<User[]> {
    const userId = (request as any).user.uid;
    return this.referralsService.getReferredUsers(userId);
  }

}