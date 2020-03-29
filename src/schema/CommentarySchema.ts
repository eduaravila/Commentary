import { ObjectType, Field, Int, ID, InputType, Directive } from "type-graphql";
import {
  Trim,
  SanitizerConstraint,
  SanitizerInterface,
  Sanitize
} from "class-sanitizer";
import { Type } from "class-transformer";
import mongoose from "mongoose";

import commentary_model from "../models/commentary";
import { MaxLength } from "class-validator";

@SanitizerConstraint()
export class toLowerCase implements SanitizerInterface {
  sanitize(text: string): string {
    return text.toLowerCase();
  }
}

@Directive("@extends")
@Directive(`@key(fields: "_id")`)
@ObjectType()
export class User {
  @Directive("@external")
  @Field(type => ID)
  _id: mongoose.Types.ObjectId;
}

@Directive("@extends")
@Directive(`@key(fields: "_id")`)
@ObjectType()
export class Challenge {
  @Directive("@external")
  @Field(type => ID)
  _id: mongoose.Types.ObjectId;
}

@ObjectType()
export class SuccessResponse {
  @Field(type => String)
  msg?: string;

  @Field(type => String)
  code?: string;
}

@ObjectType()
export class SuccessResponseTicket {
  @Field(type => [String])
  msg?: [string];

  @Field(type => String)
  token?: string;

  @Field(type => String)
  code?: string;
}

@ObjectType()
export class SuccessResponseTicketSingle {
  @Field(type => String)
  msg?: string;

  @Field(type => String)
  token?: string;

  @Field(type => String)
  code?: string;
}

@InputType()
export class findInput {
  @Field(type => Int, { nullable: true })
  page: number;

  @Field(type => Int, { nullable: true })
  size: number;

  @Field(type => String, { nullable: true, defaultValue: "" })
  @Trim()
  @Sanitize(toLowerCase)
  search: string;
}

@Directive(`@key(fields:"_id")`)
@ObjectType()
export class Commentary {
  @Field(type => String, { nullable: false })
  _id: string;

  @Field(type => String, { nullable: true })
  commentary: string;

  @Type(() => User)
  @Field()
  User: User;

  @Type(() => Challenge)
  @Field()
  Challenge: Challenge;

  @Field(type => String, { nullable: true })
  created_at: string;

  @Field(type => String, { nullable: true })
  updated_at: string;

  @Field(type => ID, { nullable: true })
  updated_by: mongoose.Types.ObjectId;

  @Field(type => ID, { nullable: true })
  created_by: mongoose.Types.ObjectId;
}

@InputType()
export class newCommentary {
  @Field(type => String, { nullable: true })
  @MaxLength(280)
  commentary: string;

  @Field(type => ID)
  Challenge: mongoose.Types.ObjectId;
}

@InputType()
class editCommentary {
  @Field(type => String, { nullable: true })
  commentary: string;

  @Field(type => ID, { nullable: true })
  User: mongoose.Types.ObjectId;

  @Field(type => ID, { nullable: true })
  Challenge: mongoose.Types.ObjectId;
}

@InputType()
export class commentarytEditInfo extends editCommentary {
  @Field(type => ID)
  id: mongoose.Types.ObjectId;
}

export async function resolveCommentaryReference(
  reference: Pick<Commentary, "_id">
): Promise<Commentary> {
  let result = await commentary_model.findOne({ _id: reference._id });

  return result;
}
