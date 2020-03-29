import moment from "moment";
import mongose from "mongoose";
import { ApolloError } from "apollo-server-express";
import validator from "validator";
import commentaryModel from "../models/commentary";
import {
  findInput,
  newCommentary,
  commentarytEditInfo
} from "../schema/CommentarySchema";
import Jwt from "../utils/jwt";
import jwtTicket from "../utils/jwtTicket";

export const addCommentary = async (
  { Challenge, commentary }: newCommentary,
  ctx: any
) => {
  try {
    let token = ctx.req.headers.token;
    let multiplier = 0;
    if (commentary.trim().length > 0) {
      multiplier = 2;
    }

    let localToken = await Jwt.validateToken(
      token,
      ctx.req.body.variables.publicKey
    );

    let tokenData: any = await Jwt.decrypt_data(localToken)();

    if (ctx.req.ipInfo.error) {
      ctx.req.ipInfo = {};
    }

    let newCommentary = new commentaryModel({
      Challenge,
      User: tokenData.userId,
      commentary,
      created_by: tokenData.userId,
      updated_by: tokenData.userId,
      created_at: moment().format("YYYY-MM-DD/HH:mm:ZZ"),
      updated_at: moment().format("YYYY-MM-DD/HH:mm:ZZ")
    });
    await newCommentary.save();

    // * sets the reward for uploading files to the ecolote server
    let ticketToken = new jwtTicket({
      multiplier: multiplier.toString(),
      userId: tokenData.userId,
      _id: newCommentary._id.toString()
    });
    await ticketToken.create_token("1h");

    return Promise.resolve({
      msg: `${newCommentary._id} succesfully created`,
      code: "200",
      token: ticketToken.token
    });
  } catch (error) {
    return new ApolloError(error);
  }
};

export const deleteCommentary = async ({ id }: any, ctx: any) => {
  try {
    let token = ctx.req.headers.token;

    let localToken = await Jwt.validateToken(
      token,
      ctx.req.body.variables.publicKey
    );

    let tokenData: any = await Jwt.decrypt_data(localToken)();

    let deletedCommentary = await commentaryModel.delete(
      { $and: [{ _id: id }, { created_by: tokenData.userId }] },
      tokenData.userId
    );

    return Promise.resolve(`${id.toString()} succesfully deleted`);
  } catch (error) {
    console.log(error);

    new ApolloError(error);
  }
};

export const getCommentarys = async ({
  page = 0,
  size = 0,
  search
}: findInput) => {
  try {
    let offset = page * size;
    let limit = offset + size;

    let result =
      search.length > 0
        ? await commentaryModel
            .find({
              $or: [
                { name: { $regex: ".*" + search + ".*" } },
                { _id: { $regex: ".*" + search + ".*" } }
              ]
            })
            .skip(offset)
            .limit(limit)
        : await commentaryModel
            .find({})
            .skip(offset)
            .limit(limit);

    return Promise.resolve(result);
  } catch (error) {
    new ApolloError(error);
  }
};

export const modifyCommentary = async (
  { Challenge, commentary, id }: commentarytEditInfo,
  ctx: any
) => {
  try {
    let token = ctx.req.headers.token;

    let localToken = await Jwt.validateToken(
      token,
      ctx.req.body.variables.publicKey
    );

    let tokenData: any = await Jwt.decrypt_data(localToken)();

    if (ctx.req.ipInfo.error) {
      ctx.req.ipInfo = {};
    }

    let newCommentary = await commentaryModel.findOneAndUpdate(
      { $and: [{ _id: id }, { created_by: tokenData.userId }] },
      {
        Challenge,
        commentary,
        updated_at: moment().format("YYYY-MM-DD/HH:mm:ZZ")
      },
      { omitUndefined: true }
    );

    return Promise.resolve(`${newCommentary._id} succesfully updated`);
  } catch (error) {
    return new ApolloError(error);
  }
};
