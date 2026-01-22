import css from "./PsychologistCard.module.css";
import { useState } from "react";
import { Props } from "../../types/psychologist";
import Modal from "../Modal/Modal";
import AppointmentModal from "../AppointModal/AppointModal";

export default function PsychologistCard({
  psychologist,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  return (
    <div className={css.cardContainer}>
      <div className={css.photoContainer}>
        <img
          src={psychologist.avatar_url}
          alt={`Photo ${psychologist.name}`}
          className={css.photoPsychologist}
          width={96}
          height={96}
        />
        <div className={css.onlineStatusContainer}>
          <div className={css.onlineStatus}></div>
        </div>
      </div>
      <div className={css.infoPsychologistContainer}>
        <div className={css.nameContainer}>
          <p className={css.typePsychologist}>Psychologist</p>
          <h1 className={css.namePsychologist}>{psychologist.name}</h1>
        </div>
        <div className={css.blocksPsychologist}>
          <div className={css.blockPsychologist}>
            <h2 className={css.textBlockPsychologist}>
              Experience:{" "}
              <span
                className={`${css.textBlockPsychologist} ${css.textInfoPsych}`}
              >
                {psychologist.experience}
              </span>
            </h2>
          </div>
          <div className={css.blockPsychologist}>
            <h2 className={css.textBlockPsychologist}>
              License:{" "}
              <span
                className={`${css.textBlockPsychologist} ${css.textInfoPsych}`}
              >
                {psychologist.license}
              </span>
            </h2>
          </div>
          <div className={css.blockPsychologist}>
            <h2 className={css.textBlockPsychologist}>
              Specialization:{" "}
              <span
                className={`${css.textBlockPsychologist} ${css.textInfoPsych}`}
              >
                {psychologist.specialization}
              </span>
            </h2>
          </div>
          <div className={css.blockPsychologist}>
            <h2 className={css.textBlockPsychologist}>
              Initial_consultation:{" "}
              <span
                className={`${css.textBlockPsychologist} ${css.textInfoPsych}`}
              >
                {psychologist.initial_consultation}
              </span>
            </h2>
          </div>
        </div>
        <div className={css.aboutPsychologistContainer}>
          <p className={css.aboutPsychologist}>{psychologist.about}</p>
        </div>
        <div className="buttonReadMoreContainer">
          <button
            onClick={() => setIsOpen(true)}
            className={css.buttonReadMore}
          >
            {isOpen ? "" : "Read more"}
          </button>
        </div>
        {isOpen && (
          <div className="infoReadMore">
            <div className={css.reviewersContainer}>
              {psychologist.reviews.map((review, index) => (
                <div key={index} className={css.reviewerContainer}>
                  <div className={css.firstBlock}>
                    <div className={css.reviewerImageContainer}>
                      {review.reviewer.charAt(0)}
                    </div>
                    <div className={css.infoReviewer}>
                      <p className={css.nameReviewerPsyc}>{review.reviewer}</p>
                      <div className={css.reviewerRatingContainer}>
                        <img
                          src={`${import.meta.env.BASE_URL}/vectors/Star.svg`}
                          alt="Icon Star"
                          width={16}
                          height={16}
                        />
                        {review.rating}
                      </div>
                    </div>
                  </div>
                  <div className={css.reviewerTexts}>
                    <div className={css.reviewerDescContainer}>
                      <p className={css.textReviewer}>{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={css.buttonPsychologistContainer}>
              <button
                type="button"
                className={css.buttonMakeAppointment}
                onClick={() => setIsAppointmentOpen(true)}
              >
                Make an appointment
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={css.ratingPsychologistContainer}>
        <div className={css.starContainer}>
          <img
            src={`${import.meta.env.BASE_URL}/vectors/Star.svg`}
            alt="Icon Star"
          />
        </div>
        <div className={css.numberRatingContainer}>
          <p className={css.numberRating}>Rating: {psychologist.rating}</p>
        </div>
        <div className={css.lineBetween}></div>
        <div className={css.pricePsychologistContainer}>
          <p className={css.pricePsychologist}>
            Price / 1 hour:{" "}
            <span
              className={`${css.pricePsychologist} ${css.pricePsychologistNumb}`}
            >
              {psychologist.price_per_hour}$
            </span>
          </p>
        </div>
        <button
          type="button"
          className={css.buttonFavorite}
          onClick={() => onToggleFavorite(psychologist.id)}
        >
          <img
            src={
              isFavorite
                ? `${import.meta.env.BASE_URL}/vectors/FavoriteFull.svg`
                : `${import.meta.env.BASE_URL}/vectors/FavoriteEmpty.svg`
            }
            alt="Icon Favorite"
          />
        </button>
      </div>
      {isAppointmentOpen && (
        <Modal onClose={() => setIsAppointmentOpen(false)}>
          <AppointmentModal
            psychologistId={psychologist.id}
            psychologistPhoto={psychologist.avatar_url}
            psychologistName={psychologist.name}
            onSuccess={() => setIsAppointmentOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
