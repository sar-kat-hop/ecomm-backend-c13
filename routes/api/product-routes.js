const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/products', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const allProducts = await Product.findAll({
      // include: [{ model: Category, Tag, ProductTag}],
      returning: true,
      include: [{ model: Category}],
      attributes: { exclude: ['category_id'] }
    });

    res.status(200).json(allProducts);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error getting all products: ', err);
  }
});

// get one product
router.get('/products/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const singleProduct = await Product.findOne(req.params.id, {
      // include: [{model: Category, Tag, ProductTag}],
      returning: true,
      include: [{ model: Category, Tag }],
      attributes: { exclude: ['category_id'] }
    });

    if(!singleProduct) {
      res.status(400).json({ message: 'No product found with that id'});
      return;
    }

    res.status(200).json(productData);

  } catch (err) {
    res.status(500).json('Error getting single product by id: ', err);
  }
});

// create new product
router.post('/products', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }  */  
    try {
      const { product_name, price, stock, tagIds } = req.body;
      const newProduct = await Product.create(req.body, { 
        returning: true,
        where: { tag_id: tagIds }
      });
      await newProduct.addTags(req.body.tagIds);
      
      res.status(200).json(newProduct);
    } catch (err) {
      res.status(400).json({ message: 'Could not create new product' });
    }
});

// update product
router.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id; //initialize for use throughout code block
    const { product_name, price, stock, category_id } = req.body;
    const [ rowsAffected, [updatedProduct] ] = await Product.update(req.body, {
      returning: true,  //note to self: by default, update method doesn't return records altered, so need to set to true in order for json res msg to include record instead of just the # of rows affected
      where: { id: productId }}
      );
    
    // findAll productTags
    const productTags = await ProductTag.findAll({ 
      where: { product_id: productId }, 
      attributes: ['tag_id'],} );
    
    //map productTags
    const productTagIds = await productTags.map((productTag) => productTag.tag_id );

    //filter and map matching product tags
    const updatedProductTags = req.body.productTagIds
      .filter((productTagId) => productTagIds.includes(productTagId));

    //delete filtered-out product tags
    await ProductTag.destroy({
      where: { product_id: productId, tag_id: { [Op.notIn]: updatedProductTags } },
    });

    //bulkCreate matching product tags
    const productTagData = updatedProductTags.map((productTagId) => ({
      product_id: productId,
      tag_id: productTagId,
    }));
    await ProductTag.bulkCreate(productTagData);

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log('Error updating product: ', err);
    res.status(500).json({message: 'PUT route error while attempting to update product.'});
  }
      
    //filter matching tags
    // const newProductTags = req.body.tagIds
    //   .filter((tag_id) => !productTagIds.includes(tag_id))
    //   .map((tag_id) => {
    //     return { product_id: req.params.id, tag_id, };
    //   });

    // figure out which ones to remove
    // const productTagsToRemove = productTags
    //   .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    //   .map(({ id }) => id);

    // run both actions
      // return Promise.all([
      //   ProductTag.destroy({ where: { id: productTagsToRemove } }),
      //   ProductTag.bulkCreate(newProductTags),
      // ]);
    // })
    //   .then((updatedProductTags) => res.json(updatedProductTags))
    //   .catch((err) => {
    //     // console.log(err);
    //     res.status(400).json(err);
    //   });
});

router.delete('/products/:id', (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(!productData) {
      res.status(404).json({ message: 'Product id not found'});
      return;
    }

  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
