import * as yup from "yup";

export const signUpValidationSchema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  email: yup
    .string()
    .email("Informe um email válido! ex: email@email.com")
    .required("O email é obrigatório"),
  password: yup
    .string()
    .required("Informe a senha")
    .min(8, "A senha deve ter pelo menos 8 caracteres"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas não coincidem")
    .required("Confirme a senha"),
});

export const signInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("O email deve ser válido")
    .required("O email é obrigatório"),
  senha: yup.string().required("Informe a senha"),
});