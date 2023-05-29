import mongoose from "mongoose";

const SocialHandleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
    title: String,
    logo: String,
    baseUrl: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SocialHandle", SocialHandleSchema);
