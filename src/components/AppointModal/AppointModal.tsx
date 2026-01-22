import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import css from "./AppointModal.module.css";
import { AppointmentFormValues } from "../../types/appointment";
import { createAppointment } from "../../service/appointService";
import { useAuth } from "../../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import TimeSelect from "../TimeSelect/TimeSelect";

type Props = {
  psychologistPhoto: string;
  psychologistId: string;
  psychologistName: string;
  onSuccess: () => void;
};

const schema = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().email("Incorrect email!").required("Required"),
  phone: yup.string().min(6, "Incorrect phone!").required("Required"),
  comment: yup.string().required("Required"),
});

export default function AppointmentModal({
  psychologistPhoto,
  psychologistId,
  psychologistName,
  onSuccess,
}: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [time, setTime] = useState("9:00");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.displayName ?? "",
      email: user?.email ?? "",
      phone: "",
      comment: "",
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      setSubmitError("");
      setLoading(true);

      if (!user) {
        setSubmitError("Only authorized users can make an appointment.");
        return;
      }

      await createAppointment({
        uid: user.uid,
        psychologistId,
        psychologistPhoto,
        psychologistName,
        data,
      });

      onSuccess();
    } catch (e) {
      if (e instanceof FirebaseError) setSubmitError(e.message);
      else if (e instanceof Error) setSubmitError(e.message);
      else setSubmitError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.FormContainer}>
      <div className={css.formTextContainer}>
        <h1 className={css.title}>Make an appointment with a psychologists</h1>
        <h2 className={css.desc}>
          You are on the verge of changing your life for the better. Fill out
          the short form below to book your personal appointment with a
          professional psychologist. We guarantee confidentiality and respect
          for your privacy.
        </h2>
        <div className={css.psychNameContainer}>
          <img
            src={psychologistPhoto}
            alt="Photo Psychologist"
            width={44}
            height={44}
            className={css.photoPsych}
          />
          <div className={css.textsPsychContainer}>
            <p className={css.textPsychName}>Your psychologist</p>
            <p className={css.psychName}> {psychologistName}</p>
          </div>
        </div>
      </div>
      <div className={css.formContainerInputs}>
        <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
          <div className={css.labelsContainerForm}>
            <div className={css.labelContainerForm}>
              <label className={css.labelEmail}>
                <input
                  className={css.inputForm}
                  placeholder="Name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className={css.error}>{errors.name.message}</p>
                )}
              </label>
            </div>
            <div
              className={`${css.labelContainerForm} ${css.labelWithPhoneClock}`}
            >
              <label className={css.labelEmail}>
                <input
                  className={css.inputForm}
                  placeholder="Phone"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className={css.error}>{errors.phone.message}</p>
                )}
              </label>
              <label className={css.labelEmail}>
                <TimeSelect
                  value={time}
                  onChange={setTime}
                  step={30}
                  start="00:00"
                  end="23:30"
                />
              </label>
            </div>
            <div className={css.labelContainerForm}>
              <label className={css.labelEmail}>
                <input
                  className={css.inputForm}
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className={css.error}>{errors.email.message}</p>
                )}
              </label>
            </div>
            <div className={css.labelContainerForm}>
              <label className={css.labelEmail}>
                <textarea
                  className={css.inputForm}
                  placeholder="Comment"
                  {...register("comment")}
                />
                {errors.comment && (
                  <p className={css.error}>{errors.comment.message}</p>
                )}
              </label>
            </div>
          </div>
          {submitError && <p className={css.errorSubmit}>{submitError}</p>}
          <div className={css.buttonContainerForm}>
            <button
              type="submit"
              className={css.buttonForm}
              disabled={loading}
            >Send</button>
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
