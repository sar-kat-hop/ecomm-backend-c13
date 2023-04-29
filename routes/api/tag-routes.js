const router = require('express').Router();
const { Tag, Product } = require('../../models');

// The `/api/tags` endpoint

router.get('/tags', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = Tag.findAll({
      include: [{ model: Product }],
    });

    res.status(200).json(tagData);

  } catch (err) {
      res.status(500).json(err);
      console.log('Error with GET route fetching all tags: ', err);
    }
});

router.get('/tags/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if(!tagData) {
      res.status(400).json({ message: 'Tag id not found'});
      return;
    }

    res.status(200).json(tagData);

  } catch (err) {
      res.status(500).json(err);
      console.log(err);
  }
});

router.post('/tags', (req, res) => {
  // create a new tag
  try {
    const newTag = Tag.create(
      {
      where: {
        id: req.params.id,
        tag_name: req.params.tag_name,
      },
    });

    res.status(200).json(newTag);

  } catch (err) {
      res.status(400).json(err)
      console.log('Error with POST route to create new tag: ', err);
  }
});

router.put('/tags/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const { tag_name } = req.body;
    const [ rowsAffected, updatedTag ] = await Tag.update(req.body, //note to self: sequelize update method returns array with 2 items: # of affected rows and array of updated instances, so we need to destructure here
      { where: { id: req.params.id }},
    );
      // .then((updatedTag) => {
      //   res.json(updatedTag);
      // })
      res.status(200).json(updatedTag[0]);
  } catch (err) {
    res.status(400).json(err);
    console.log('Error with PUT route updating tag by id: ', err);
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(!tagData) {
      res.status(404).json({ message: 'Tag id not found'});
      return;
    }

  } catch (err) {
      res.status(500).json(err);
      console.log(err);
  }
});

module.exports = router;
