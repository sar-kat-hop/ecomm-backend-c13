const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
// be sure to include its associated Products
router.get('/categories', async (req, res) => {
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
router.get('/categories/:id', async (req, res) => {
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
router.post('/categories', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body, {
      returning: true
    });

      res.status(200).json(newCategory);
      console.log('Created new category: ' + newCategory);
      
    } catch (err) {
        res.status(400).json(err);
        console.log('Error posting new category: ', err);
    }
});

// update a category by its `id` value
router.put('/categories/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true
    });

    res.status(200).json(categoryData);
    console.log('Updated category: ' + categoryData);

  } catch (err) {
      res.status(400).json(err);
      console.log('Error updating category by id: ', err);
  };
});

router.delete('/categories/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
      returning: true
    });

    if(!categoryData) {
      res.status(404).json({ message: 'Category id not found'});
    }

    res.status(200).json(categoryData);
    console.log('Deleted category: ' + categoryData);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error deleting category: ', err);
  }
});

module.exports = router;
