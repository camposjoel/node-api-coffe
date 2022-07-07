const validateRoleAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: 'Token not verified, no role validation'
    });
  }

  const { role, name } = req.user;
  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name} is not administrator`
    });
  }

  next();
}

const validateRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'Token not verified, no role validation'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `Service require one valid role: ${roles}`
      });
    }
    next();
  }
}

module.exports = { validateRoleAdmin, validateRoles };
