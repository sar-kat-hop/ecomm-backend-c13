const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/tags', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });

    res.status(200).json(tagData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if(!tagData) {
      res.status(400).json({ message: 'No tag found with that id'});
      return;
    }

    res.status(200).json(tagData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body, {
      where: {
        id: req.params.id,
        tag_name: req.params.tag_name,
      },
    });

    res.status(200).json(newTag);

  } catch (err) {
    res.status(400).json(err)
  };

});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(tagData);

  } catch (err) {
    res.status(400).json(err);
  };

});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
