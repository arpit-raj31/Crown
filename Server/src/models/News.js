import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    newstype: {
      type: String,
      enum: ['Crypto', 'Forex', 'Stocks', 'Indices', 'Commodities'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subContent: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: null,
    },
    newsImpact: {
      type: String,
      enum: ['Low', 'Medium', 'High'], 
      required: true,
    },
    newsTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } 
);

const News = mongoose.model("News", newsSchema);
export default News;
