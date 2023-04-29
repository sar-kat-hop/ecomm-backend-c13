const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
// be sure to include its associated Products
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });

    res.status(200).json(categoryData);
    console.log('Fetched all categories.');

  } catch (err) {
      res.status(500).json(err);
      console.log('Error getting categories: ', err);
  }
});

// find one category by its `id` value
// be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
      returning: true
    });

    if (!categoryData) {
      res.status(400).json({ message: 'Category id not found'});
    }

    res.status(200).json(categoryData);
    console.log('Fetched category: ' + categoryData);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error geting category by id: ', err);
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body, {
      returning: true
    });

      res.status(200).json(newCategory);
      console.log('Created new category: ' + newCategory.category_name);
      
    } catch (err) {
        res.status(400).json(err);
        console.log('Error posting new category: ', err);
    }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);

    if(!category) {
      res.status(500).json({ message: 'Category not found. '});
    }
    // console.log('category: ', category);
    console.log('req.body:', req.body)

    await Category.update(
      { category_name: req.body.category_name },
      { where: { id: categoryId } }
    );

    const updatedCategory = await Category.findByPk(categoryId);
    res.status(200).json(updatedCategory);
    console.log('Updated category: ', updatedCategory.category_name);

  } catch (err) {
      res.status(400).json(err);
      console.log('Error updating category by id: ', err);
  };
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);

    if(!category) {
      res.status(500).json({ message: 'Category not found.'});
    }

    await Category.destroy({
      where: { id: categoryId },
      include: Product,
      returning: true
    });

    res.status(200).json({ message: 'Deleted category.'});
    console.log('Deleted category');

  } catch (err) {
      res.status(500).json(err);
      console.log('Error deleting category: ', err);
  }
});

module.exports = router;
