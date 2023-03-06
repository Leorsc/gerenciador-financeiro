export const ValidationError = ({ name, email, password, confirmPassword }) => {
  return (
    <>
      {name && <span className="error">{name}</span>}
      {email && <span className="error">{email}</span>}
      {password && <span className="error">{password}</span>}
      {confirmPassword && <span className="error">{confirmPassword}</span>}
    </>
  );
};

export const signInValidationError = ({ email, password }) => {
  return (
    <>
      {email && <span className="error">{email}</span>}
      {password && <span className="error">{password}</span>}
    </>
  );
};