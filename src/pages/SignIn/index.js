import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "./../../services/api";
import Header from "../../components/Header";
import "./styles.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInValidationSchema } from "../../utils/yupValidations";
import { useEffect, useState } from "react";
import { getItem } from "../../utils/storage";

function SignIn() {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInValidationSchema),
  });

  useEffect(() => {
    const token = getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate])

  async function onSubmit(data) {
    try {
      const response = await api.post("/login", {
        email: data.email,
        senha: data.senha,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      if (error.response?.data?.message === "Usuário não encontrado!") {
        setApiError("Usuário não encontrado!");
      } else if (
        error.response?.data?.message === "Usuário ou senha incorreto!"
      ) {
        setApiError("Usuário ou senha incorreto!");
      } else {
        setApiError("Erro interno do servidor");
      }
      reset();
    }
  }

  return (
    <div className="page background">
      <Header only_tittle={false} />
      <div className="page-sign-in flex-row align-center">
        <div className="container-sign-in flex-column justify-between font-rubik">
          <h1>
            Controle suas <strong>finanças</strong>, sem planilha chata.
          </h1>
          <p>
            Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você
            tem tudo num único lugar e em um clique de distância.
          </p>

          <button className="btn width-284">
            <Link to="/sign-up">Cadastre-se</Link>
          </button>
        </div>
        <form className="form-sign-in" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group form-group-sign-in">
            <h2 className="form-group-sign-title">Login</h2>
            <div className="form-control">
              <label htmlFor="email">E-mail</label>
              <input
                className="form-inputs"
                type="text"
                {...register("email")}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>
            <div className="form-control">
              <label htmlFor="senha">Senha</label>
              <input
                className="form-inputs"
                type="password"
                {...register("senha")}
              />
              {errors.senha && (
                <span className="form-error">{errors.senha.message}</span>
              )}
            </div>
            {apiError && <span className="form-error">{apiError}</span>}
          </div>
          <div>
            <button className="btn width-450">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;