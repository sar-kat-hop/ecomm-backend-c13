const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = Category.findAll({
      include: [{ model: Product}],
    });

    res.status(200).json(categoryData);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error getting categories: ', err);
  }
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = Category.findByPk(req.params.id, {
      include: [{ model: Product}],
    });

    if (!categoryData) {
      res.status(400).json({ message: 'Category id not found'});
      return;
    }

    res.status(200).json(categoryData);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error geting category by id: ', err);
  }
});

router.post('/', (req, res) => {
  // create a new category
  try {
    const newCategory = Category.create({
      category_id: req.body.category_id,
    });

      res.status(200).json(newCategory);
      
    } catch (err) {
        res.status(400).json(err);
        console.log('Error posting new category: ', err);
    }
});

router.put('/:id', (req, res) => {
// update a category by its `id` value
  try {
    const categoryData = Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(categoryData);

  } catch (err) {
      res.status(400).json(err);
      console.log('Error updating category by id: ', err);
  };
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(!categoryData) {
      res.status(404).json({ message: 'Category id not found'});
      return;
    }

    res.status(200).json(categoryData);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error deleting category: ', err);
  }
});

module.exports = router;
