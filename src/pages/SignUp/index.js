import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "./../../services/api";

import Header from "../../components/Header";
import "./styles.css";
import { signUpValidationSchema } from "../../utils/yupValidations";

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpValidationSchema),
  });
  const [apiError, setApiError] = useState(null);

  async function onSubmit(data) {
    try {
      await api.post("/usuario", {
        nome: data.name,
        email: data.email,
        senha: data.password,
        confirmarSenha: data.confirmPassword,
      });
      navigate("/");
    } catch (error) {
      if (error.response?.data?.message === "O email já existe") {
        setApiError("Este email já está cadastrado.");
      } else {
        setApiError("Erro ao realizar cadastro.");
      }
    }
  }

  return (
    <div className="page background">
      <Header only_tittle={false} />
      <form className="form-sign-up" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group form-group-sign-up">
          <h2 className="form-group-sign-title">Cadastre-se</h2>
          <div className="form-control">
            <label htmlFor="name">Nome</label>
            <input className="form-inputs" type="text" {...register("name")} />
            {errors.name && (
              <span className="form-error">{errors.name.message}</span>
            )}
          </div>
          <div className="form-control">
            <label htmlFor="email">E-mail</label>
            <input className="form-inputs" type="text" {...register("email")} />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </div>
          <div className="form-control">
            <label htmlFor="password">Senha</label>
            <input
              className="form-inputs"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>
          <div className="form-control">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              className="form-inputs"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="form-error">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          {apiError && <span className="form-error">{apiError}</span>}
        </div>
        <div className="form-group-btn-sign">
          <button className="btn width-450">Cadastrar</button>
          <span className="span-sign font-lato font-weight-700">
            Já tem cadastro?<Link to="/"> Clique aqui!</Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default SignUp;