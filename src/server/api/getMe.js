const getMe = (req, res) => {
  if (req.isAuthenticated()) {
    res.send({
      id: req.user.id,
      displayName: req.user.displayName,
      photoURL: req.user.photoURL,
      provider: req.user.provider,
    });
  } else {
    res.send({ id: -1 });
  }
};

module.exports = getMe;
