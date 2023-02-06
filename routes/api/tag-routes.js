const router = require('express').Router();
const { Tag, Product } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = Tag.findAll({
      include: [{ model: Product }],
    });

    res.status(200).json(tagData);

  } catch (err) {
      res.status(500).json(err);
      console.log(err);
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
      res.status(400).json({ message: 'Tag id not found'});
      return;
    }

    res.status(200).json(tagData);

  } catch (err) {
      res.status(500).json(err);
      console.log(err);
  }
});

router.post('/', (req, res) => {
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
      console.log(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  try {
    Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then((updatedTag) => {
        res.json(updatedTag);
      })
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

  // try {
    // const tagData = Tag.update(req.body, {
    //   where: {
    //     id: req.params.id,
    //   },
    // });

//     res.status(200).json(tagData);

//   } catch (err) {
//       res.status(400).json(err);
//       console.log(err);
//   };
// });

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
