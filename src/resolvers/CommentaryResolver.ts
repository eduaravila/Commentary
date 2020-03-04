import {
  Resolver,
  Query,
  FieldResolver,
  Root,
  Mutation,
  Arg,
  Ctx,
  ID
} from "type-graphql";
import {
  Commentary,
  SuccessResponse,
  newCommentary,
  findInput,
  commentarytEditInfo,
  SuccessResponseTicket,
  SuccessResponseTicketSingle
} from "../schema/CommentarySchema";

import {
  addCommentary,
  deleteCommentary,
  modifyCommentary,
  getCommentarys
} from "../controllers/commentary";

import mongoose from "mongoose";

@Resolver(of => Commentary)
export class CommentaryResolver {
  @Query(returns => [Commentary])
  async Commentarys(@Arg("findInput", () => findInput) findInput: findInput) {
    let msg = await getCommentarys(findInput);
    return [...msg];
  }

  @Mutation(returns => SuccessResponseTicketSingle)
  async NewCommentary(
    @Arg("newCommentary", () => newCommentary) newCommentary: newCommentary,
    @Ctx() ctx: any
  ) {
    return await addCommentary(newCommentary, ctx);
  }

  @Mutation(returns => SuccessResponse)
  async DeleteCommentary(
    @Arg("id", () => ID) id: mongoose.Types.ObjectId,
    @Ctx() ctx: any
  ) {
    let msg = await deleteCommentary({ id }, ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Mutation(returns => SuccessResponse)
  async ModifyCommentary(
    @Arg("commentarytEditInfo", () => commentarytEditInfo)
    commentarytEditInfo: commentarytEditInfo,
    @Ctx() ctx: any
  ) {
    let msg = await modifyCommentary(commentarytEditInfo, ctx);
    return {
      msg,
      code: "200"
    };
  }
}
