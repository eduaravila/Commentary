import mongoose, { Schema, mongo } from "mongoose";
import bc from "bcrypt";
import moment from "moment";
import { CommentaryModelType, CommentaryModelStaticsType } from "./types";
import mongoose_delete from "mongoose-delete";

const Commentary_schema: Schema = new mongoose.Schema({
  commentary: {
    type: String,
    required: true
  },
  User: {
    type: mongoose.Types.ObjectId
  },
  Challenge: {
    type: mongoose.Types.ObjectId
  },
  created_at: {
    type: String,
    required: true,
    default: moment().format("YYYY-MM-DD/HH:mm:ZZ")
  },
  updated_at: {
    type: String,
    required: true,
    default: moment().format("YYYY-MM-DD/HH:mm:ZZ")
  },
  created_by: {
    type: mongoose.Types.ObjectId
  },
  updated_by: {
    type: mongoose.Types.ObjectId
  }
});

Commentary_schema.plugin(mongoose_delete, {
  deletedAt: true,
  indexFields: true,
  overrideMethods: true,
  deletedBy: true
});

const commentary_model = mongoose.model<
  CommentaryModelType,
  CommentaryModelStaticsType
>("commentary", Commentary_schema);

export default commentary_model;
