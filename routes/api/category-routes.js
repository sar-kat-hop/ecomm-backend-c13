const router = require('express').Router();
const { Category, Product, ProductTag, Tag } = require('../../models');

// The `/api/categories` endpoint
const app = express();
app.use('/api'); //???

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll(req.params.id); //since using findAll, not sure if req.params.id is approp here... names better?
    
    // const categoryProducts = Product.findAll({
    //   where: {
    //     category_id: 
    //   };
    // })

    if (!categories) {
      res.status(404).json({ message: 'No categories found'});
      return;
    }
    res.status(200).json(categories, categoryProducts);

  } catch (err) {
    res.status(500).json(err);
  };

});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
