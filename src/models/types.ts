import mongoose, { Model } from "mongoose";
import {
  SoftDeleteDocument,
  SoftDeleteInterface,
  SoftDeleteModel
} from "mongoose-delete";

export interface CommentaryModelType
  extends mongoose.Document,
    SoftDeleteDocument {
  commentary: string;
  User: {
    _id: mongoose.Types.ObjectId;
  };
  Challenge: {
    _id: mongoose.Types.ObjectId;
  };
  created_at: string;
  updated_at: string;
  created_by: mongoose.Types.ObjectId;
  updated_by: mongoose.Types.ObjectId;
}

export interface CommentaryModelStaticsType
  extends SoftDeleteModel<CommentaryModelType> {}
