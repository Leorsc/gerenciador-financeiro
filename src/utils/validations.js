export function checkFormPassword(password, passwordConfirmation) {
  if (passwordConfirmation === password) {
    return true;
  }

  return false;
}

export function checkValidForm({ name, email, password }, passwordConfirmation) {
  if (name && email && password && checkFormPassword(password, passwordConfirmation)) {
    return true;
  }

  return false;
}

export function validLenghtPassword(password) {
  if (password.length < 8) {
    return false;
  }

  return true;
}

