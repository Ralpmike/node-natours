// eslint-disable-next-line arrow-body-style
module.exports = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch((err) => next(err));
  };
};
