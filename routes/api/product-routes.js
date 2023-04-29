const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
// be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      returning: true,
      include: [{ model: Category, ProductTag }],
      attributes: { exclude: ['category_id'] }
    });

    res.status(200).json(allProducts);
    console.log('Fetched all products.');

  } catch (err) {
      res.status(500).json(err);
      console.log('Error fetching all products: ', err);
  }
});

// find a single product by its `id`
// be sure to include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const productId = await Product.findByPk(req.params.id, { include: Category, Tag });

    if(!productId) {
      res.status(400).json({ message: 'No product found with that id'});
    }

    res.status(200).json(productId);
    console.log('Fetched single product: ' + productId.product_name);

  } catch (err) {
    res.status(500).json('Error getting single product by id: ', err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }  */  
    try {
      const { product_name, price, stock } = req.body;
      const newProduct = await Product.create(req.body, { 
        returning: true,
      });
      // await newProduct.addTags(req.body.tagIds);
      
      res.status(200).json(newProduct);
      console.log('Created new product: ', newProduct.product_name);
      
    } catch (err) {
      res.status(400).json({ message: 'Could not create new product' });
    }
});

// starter code alternative for creating new product, saving for testing
// router.post('/products', async (req, res) => {
//   await Product.create(req.body)
//   .then((product) => {
//     // if there's product tags, we need to create pairings to bulk create in the ProductTag model
//     if (req.body.tagIds.length) {
//       const productTagIdArr = req.body.tagIds.map((tag_id) => {
//         return {
//           product_id: product.id,
//           tag_id,
//         };
//       });
//       return ProductTag.bulkCreate(productTagIdArr);
//     }
//     // if no product tags, just respond
//     res.status(200).json(product);
//   })
//   .then((productTagIds) => res.status(200).json(productTagIds))
//   .catch((err) => {
//     console.log(err);
//     res.status(400).json(err);
//   });
// });

// update product
router.put('/:id', async (req, res) => {
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

// non-async update product route alternative, saving for testing
// router.put('/categories/:id', (req, res) => {
//   Product.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((product) => {
//       // find all associated tags from ProductTag
//       return ProductTag.findAll({ where: { product_id: req.params.id } });
//     })
//     .then((productTags) => {
//       // get list of current tag_ids
//       const productTagIds = productTags.map(({ tag_id }) => tag_id);
//       // create filtered list of new tag_ids
//       const newProductTags = req.body.tagIds
//         .filter((tag_id) => !productTagIds.includes(tag_id))
//         .map((tag_id) => {
//           return {
//             product_id: req.params.id,
//             tag_id,
//           };
//         });
//       // figure out which ones to remove
//       const productTagsToRemove = productTags
//         .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//         .map(({ id }) => id);

//       // run both actions
//       return Promise.all([
//         ProductTag.destroy({ where: { id: productTagsToRemove } }),
//         ProductTag.bulkCreate(newProductTags),
//       ]);
//     })
//     .then((updatedProductTags) => res.json(updatedProductTags))
//     .catch((err) => {
//       // console.log(err);
//       res.status(400).json(err);
//     });
// });

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(!productData) {
      res.status(404).json({ message: 'Product id not found'});
    }

    res.status(200).json(productData);
    console.log('Deleted product: ' + productData);

  } catch (err) {
    res.status(500).json(err);
    console.log('Error deleting product: ' + err);
  }

});

module.exports = router;
