const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, password, emailId } = req.body;
  if (!firstName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a strong password");
  }
};

const validateProfileEditData = (req) => {
  const ALLOWED_EDITS = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const { body } = req;
  const isEditAllowed = Object.keys(body).every((item) =>
    ALLOWED_EDITS.includes(item)
  );
  if (!isEditAllowed) {
    throw new Error("edit request failed");
  }
};

const validateCurrentPassword = async (req) => {
  const {
    user,
    body: { currentPassword },
  } = req;
  const ALLOWED_FIELDS = ["currentPassword", "newPassword"];
  const isEditAllowed = Object.keys(req.body).every((item) =>
    ALLOWED_FIELDS.includes(item)
  );

  if (!isEditAllowed) {
    throw new Error("extra fields present");
  }
  const isValid = await user.validatePassword(currentPassword);
  if (!isValid) throw new Error("invalid credentials");
};
module.exports = {
  validateSignUpData,
  validateProfileEditData,
  validateCurrentPassword,
};
