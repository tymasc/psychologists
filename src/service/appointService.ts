import { ref, push, set } from "firebase/database";
import { db } from "./firebase";
import { AppointmentFormValues } from "../types/appointment";

export const createAppointment = async (args: {
  uid: string;
  psychologistId: string;
  psychologistPhoto: string;
  psychologistName: string;
  data: AppointmentFormValues;
}) => {
  const { uid, psychologistId, psychologistPhoto, psychologistName, data } =
    args;

  const appointmentRef = push(ref(db, `users/${uid}/appointments`));

  await set(appointmentRef, {
    psychologistId,
    psychologistPhoto,
    psychologistName,
    ...data,
    createdAt: Date.now(),
  });

  return appointmentRef.key;
};
