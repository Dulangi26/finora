export const validateCategory = (
  req,
  res,
  next
) => {

  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({
      success: false,
      message: "Name and type are required",
    });
  }

  if (
    type !== "income" &&
    type !== "expense"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Type must be income or expense",
    });
  }

  next();
};