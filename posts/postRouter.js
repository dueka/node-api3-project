const express = require("express");
const { get, getById, insert, update, remove } = require("./postDb");
const router = express.Router();

router.get("/", (req, res) => {
  // do your magic!
  get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({
        error: "The posts information could not retrieved"
      });
    });
});

router.get("/:id", (req, res) => {
  // do your magic!
  getById(req.params.id)
    .then(posts => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "posts not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the posts"
      });
    });
});

router.delete("/:id", (req, res) => {
  // do your magic!
  remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The posts has been deleted" });
      } else {
        res.status(404).json({ messages: "The posts cannot be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the hub"
      });
    });
});

router.put("/:id", (req, res) => {
  // do your magic!
  const { id } = req.params;
  const post = req.body;

  if (!post.text || !post.post_id) {
    res.status(400).json({
      errorMessage: "Please provide text and post_id for the post."
    });
  } else {
    update(id, post)
      .then(updated => {
        if (updated) {
          res.status(200).json({
            message: "post updates",
            updated
          });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist"
          });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const id = req.params.id;

  getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: "post Not Found." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

module.exports = router;
