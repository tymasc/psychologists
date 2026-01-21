import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import css from "./AuthModal.module.css";
import { FormValuesLogin } from "../../types/auth";
import { Props } from "../../types/auth";
import { useState } from "react";
import { loginUser } from "../../service/authService";
import { FirebaseError } from "firebase/app";

const schema = yup.object({
  email: yup.string().email("Incorrect email!").required("Required"),
  password: yup.string().min(8, "Minimum 8 length").required("Required"),
});

export default function LoginModal({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesLogin>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValuesLogin) => {
    try {
      setLoading(true);
      await loginUser(data);
      onSuccess();
    } catch (e) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case "auth/weak-password":
            setError("Password is too weak");
            break;
          case "auth/invalid-email":
            setError("Invalid email");
            break;
          default:
            setError("Login failed");
        }
      } else {
        setError("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={css.FormContainer}>
      <div className={css.formTextContainer}>
        <h1 className={css.title}>Log In</h1>
        <h2 className={css.desc}>
          Welcome back! Please enter your credentials to access your account and
          continue your search for a psychologist.
        </h2>
      </div>
      <div className={css.formContainerInputs}>
        <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
          <div className={css.labelsContainerForm}>
            <div className={css.labelContainerForm}>
              <label className={css.labelEmail}>
                <input
                  {...register("email")}
                  placeholder="Email"
                  className={css.inputForm}
                />
                {errors.email && (
                  <p className={css.error}>{errors.email.message}</p>
                )}
              </label>
            </div>
            <div className={css.labelContainerFormPassword}>
              <label className={css.labelEmail}>
                <input
                  type={isVisible ? "password" : "text"}
                  {...register("password")}
                  placeholder="Password"
                  className={css.inputForm}
                />
                {errors.password && (
                  <p className={css.error}>{errors.password.message}</p>
                )}
                <button
                  type="button"
                  className={css.buttonHintPassword}
                  onClick={() => setIsVisible((prev) => !prev)}
                >
                  <img
                    src={
                      isVisible
                        ? `${import.meta.env.BASE_URL}/vectors/passwordVisibleOff.svg`
                        : `${import.meta.env.BASE_URL}/vectors/passwordVisibleOn.svg`
                    }
                    alt="Icon Password"
                    width={20}
                    height={20}
                    className={css.iconPasswordHint}
                  />
                </button>
              </label>
            </div>
          </div>
          {error && <p className={css.errorSubmit}>{error}</p>}
          <div className={css.buttonContainerForm}>
            <button type="submit" className={css.buttonForm}>
              Log In
            </button>
          </div>
        </form>
      </div>
      {loading && (
        <div
          className={`${css.loadingContainer} ${css.activeLoader}`}
          id="loaderContainer"
        >
          <div id="loader" className={css.spinner}></div>
        </div>
      )}
    </div>
  );
}
