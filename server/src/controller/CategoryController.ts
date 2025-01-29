import { Request, Response } from 'express';
import CategoryModel from '../model/CategoryModel';
import { categorySchema, updateCategorySchema } from '../zod/categorySchema';

const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.find({});
    res.json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error fetching categories',
    });
  }
};

const getCategoryFilter = async (req: Request, res: Response) => {
  const { sortBy, order, limit, page } = req.query;

  // Set default values for limit and page
  const limitValue = parseInt(limit as string) || 10; // Default limit is 10
  const pageValue = parseInt(page as string) || 1; // Default page is 1
  const skipValue = (pageValue - 1) * limitValue; // Calculate the number of documents to skip

  // Initialize the sort object
  const sortObject: any = {};

  // Check for sorting parameters and set defaults
  if (sortBy === 'createdAt') {
    sortObject.createdAt = order === 'desc' ? -1 : 1; // Sort by creation date
  } else if (sortBy === 'name') {
    sortObject.name = order === 'desc' ? -1 : 1; // Sort by name
  } else {
    // If no sorting parameters are provided, default to ascending order by name
    sortObject.name = 1; // Default to ascending order
  }

  try {
    // Get the total number of documents
    const totalDocuments = await CategoryModel.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalDocuments / limitValue);

    // Query the database with filters and sorting
    const categories = await CategoryModel.find()
      .sort(sortObject)
      .limit(limitValue)
      .skip(skipValue);

    // Return the found categories
    res.status(200).json({
      status: 'success',
      data: {
        categories,
        totalPages
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end. Please try again later.',
    });
  }
};

const createCategory = async (req: Request, res: Response) => {
  const body = req.body;

  const validateBody = categorySchema.safeParse(req.body);

  if (!validateBody.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input data',
      errors: validateBody.error.errors, // Include detailed validation errors
    });
  }

  const slug = body.name
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  try {
    const categoryExist = await CategoryModel.findOne({ slug });
    if (categoryExist) {
      return res.status(409).json({
        status: 'error',
        message: 'Category already exists',
      });
    }
    await CategoryModel.create({
      name: body.name,
      description: body.description,
      slug,
    });
    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end. Please try again later.',
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;
  // console.log(req.params);

  try {
    const category = await CategoryModel.findOneAndDelete({ slug });
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }
    res.json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end. Please try again later.',
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const body = req.body;

  const validateBody = updateCategorySchema.safeParse(req.body);

  if (!validateBody.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input data',
      errors: validateBody.error.errors, // Include detailed validation errors
    });
  }

  if (body.name) {
    body.slug = body.name.trim().toLowerCase().replaceAll(' ', '_');
  }

  try {
    // Use findOneAndUpdate to update the category by slug, using $set for dynamic updates
    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { slug },
      {
        $set: body, // Only updates the fields provided in the request body
      },
      { new: true, runValidators: true }, // Return the updated document and apply validation
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
    });
  } catch (error: any) {
    if (error.code === 11000) {
      // Handle MongoDB duplicate key error
      return res.status(409).json({
        status: 'error',
        message: 'Category already exists',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end. Please try again later.',
    });
  }
};

const searchFilter = async (req: Request, res: Response) => {
  const { name } = req.query;

  // Check if name query parameter is provided
  if (!name) {
    const categories = await CategoryModel.find();
    return res.status(200).json({
      status: 'success',
      data: categories,
    });
  }

  try {
    // Perform a case-insensitive search using a regular expression
    const categories = await CategoryModel.find({
      name: { $regex: new RegExp(name as string, 'i') }, // 'i' for case-insensitive search
    });

    // Check if categories were found
    if (categories.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No categories found',
      });
    }

    // Return the found categories
    res.status(200).json({
      status: 'success',
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end. Please try again later.',
    });
  }
};

const CategoryController = {
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  searchFilter,
  getCategoryFilter,
};

export default CategoryController;
