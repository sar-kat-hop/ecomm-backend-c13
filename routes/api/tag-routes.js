const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const { update } = require('../../models/Product');

// The `/api/tags` endpoint

// find all tags
// be sure to include its associated Product data
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
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
router.get('/:id', async (req, res) => {
  try {
    const tagId = await Tag.findByPk(req.params.id, { include: Product });

    if(!tagId) {
      res.status(400).json({ message: 'Could not find tag id.'});
    }

    res.status(200).json(tagId);
    console.log('Fetched single tag: ' + tagId);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error fetching single tag: ', err);
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const { tag_name } = req.body;
    const newTag = await Tag.create(req.body, {
      returning: true,
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
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);

    if(!tag) {
      res.status(500).json({ message: 'Tag not found.'});
    }

    // const [ rowsAffected, updatedTag ] = await Tag.update(req.body, {//note to self: sequelize update method returns array with 2 items: # of affected rows and array of updated instances, so we need to destructure here
    //     where: { id: req.params.id } },
    // );
    await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: tagId} },
    );

    const updatedTag = await Tag.findByPk(tagId);

    res.status(200).json(updatedTag);
    console.log('Updated tag: ' + updatedTag);

  } catch (err) {
      res.status(400).json(err);
      console.log('Error updating tag by id: ', err);
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);

    if(!tag) {
      res.status(500).json({ message: 'Tag not found.'});
    }

    await Tag.destroy({
      where: { id: tagId },
      include: ProductTag,
      returning: true
    });

    res.status(200).json({ message: 'Deleted tag.'});
    console.log('Deleted tag');

  } catch (err) {
      res.status(500).json(err);
      console.log('Error deleting tag: ', err);
  }
});

module.exports = router;
