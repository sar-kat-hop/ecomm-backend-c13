const router = require('express').Router();
const { Tag, Product } = require('../../models');
const { update } = require('../../models/Product');

// The `/api/tags` endpoint

// find all tags
// be sure to include its associated Product data
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
      attributes: { exclude: ['product_id'] }
    });

    res.status(200).json(tagData);
    console.log('Fetched all tags.');

  } catch (err) {
      res.status(500).json(err);
      console.log('Error fetching all tags: ', err);
    }
});

// find a single tag by its `id`
// be sure to include its associated Product data
router.get('/:id', (req, res) => {
  try {
    const tagData = Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
      attributes: { exclude: ['product_id'] },
      returning: true
    });

    if(!tagData) {
      res.status(400).json({ message: 'Tag id not found'});
    }

    res.status(200).json(tagData);
    console.log('Fetched single tag: ' + tagData);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error fetching single tag: ', err);
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body, {
    });

    res.status(200).json(newTag);
    console.log('Created new tag: ' + newTag);

  } catch (err) {
      res.status(400).json(err)
      console.log('Error with POST route to create new tag: ', err);
  }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const [ rowsAffected, updatedTag ] = await Tag.update(req.body, {//note to self: sequelize update method returns array with 2 items: # of affected rows and array of updated instances, so we need to destructure here
        where: { id: req.params.id } },
    );

    res.status(200).json(updatedTag[0]);
    console.log('Updated tag: ' + updatedTag[0]);

  } catch (err) {
      res.status(400).json(err);
      console.log('Error updating tag by id: ', err);
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(!tagData) {
      res.status(404).json({ message: 'Tag id not found'});
    }

    res.status(200).json(tagData);
    console.log('Deleted tag: ' + tagData);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error deleting tag: ', err);
  }
});

module.exports = router;
