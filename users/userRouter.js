const express = require("express");
const {
  get,
  getById,
  getUserPosts,
  insert,
  update,
  remove
} = require("../users/userDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      res.status(500).json({
        message: "There is an error creating the new user"
      });
    });
});

router.post("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  const { post } = req.body;

  getById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else if (!post) {
        res
          .status(400)
          .json({ errorMessage: "Please provide the text for the post." });
      } else {
        insertText({ post, user_id: id }).then(comment => {
          res.status(201).json(post);
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.get("/", (req, res) => {
  // do your magic!
  get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({
        error: "The users information could not retrieved"
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!sql
  getById(req.params.id)
    .then(users => {
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: "Users not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the users"
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieiving the posts for the users"
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The user has been deleted" });
      } else {
        res.status(404).json({ messages: "The user cannot be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the hub"
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  const user = req.body;

  if (!user.text || !user.user_id) {
    res.status(400).json({
      errorMessage: "Please provide text and user_id for the user."
    });
  } else {
    update(id, user)
      .then(updated => {
        if (updated) {
          res.status(200).json({
            message: "user updates",
            updated
          });
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist"
          });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: "The user information could not be modified." });
      });
  }
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;

  getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "User Not Found." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

function validateUser(req, res, next) {
  // do your magic!
  const user = req.body;

  user
    .get(user)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "User Not Found." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
