import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
