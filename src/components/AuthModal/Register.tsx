import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import css from "./AuthModal.module.css";
import { FormValuesRegister } from "../../types/auth";
import { Props } from "../../types/auth";
import { useState } from "react";
import { registerUser } from "../../service/authService";
import { FirebaseError } from "firebase/app";

const schema = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().email("Incorrect email!").required("Required"),
  password: yup.string().min(8, "Minimum 8 length").required("Required"),
});

export default function RegisterModal({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesRegister>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValuesRegister) => {
    try {
      setLoading(true);
      await registerUser(data);
      onSuccess();
    } catch (e) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case "auth/email-already-in-use":
            setError("Email already exists");
            break;
          case "auth/weak-password":
            setError("Password is too weak");
            break;
          case "auth/invalid-email":
            setError("Invalid email");
            break;
          default:
            setError("Registration failed");
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
        <h1 className={css.title}>Registration</h1>
        <h2 className={css.desc}>
          Thank you for your interest in our platform! In order to register, we
          need some information. Please provide us with the following
          information.
        </h2>
      </div>
      <div className={css.formContainerInputs}>
        <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
          <div className={css.labelsContainerForm}>
            <div className={css.labelContainerForm}>
              <label className={css.labelEmail}>
                <input
                  {...register("name")}
                  placeholder="Name"
                  className={css.inputForm}
                />
                {errors.name && (
                  <p className={css.error}>{errors.name.message}</p>
                )}
              </label>
            </div>
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
              Sign Up
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
