import Express, { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import CategoryController from '../controller/CategoryController';


const categoryRouter = Router();
categoryRouter.use(AuthMiddleware as Express.RequestHandler)

// Get all categories
categoryRouter.get('/', CategoryController.getCategory as Express.RequestHandler)

// Create a new category
categoryRouter.post('/', CategoryController.createCategory as Express.RequestHandler)

// Update a category
categoryRouter.put('/:slug', CategoryController.updateCategory as Express.RequestHandler)

// Delete a category
categoryRouter.delete('/:slug', CategoryController.deleteCategory as Express.RequestHandler)

// Search Filter a category
categoryRouter.get('/search', CategoryController.searchFilter as Express.RequestHandler)

// Get a category based on filter
 categoryRouter.get('/filter', CategoryController.getCategoryFilter as Express.RequestHandler)

export { categoryRouter };