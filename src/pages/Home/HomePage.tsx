import { useNavigate } from "react-router-dom";
import css from "./HomePage.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className={css.sectionHero}>
      <div className={css.heroInfoContainer}>
        <div className={css.leftInfo}>
          <h1 className={css.heroText}>
            The road to the{" "}
            <span className={`${css.heroText} ${css.heroTextSpan}`}>
              depths
            </span>{" "}
            of the human soul
          </h1>
          <h2 className={css.heroDesc}>
            We help you to reveal your potential, overcome challenges and find a
            guide in your own life with the help of our experienced
            psychologists.
          </h2>
          <button
            onClick={() => navigate("/psychologists")}
            className={css.buttonHero}
          >
            Get started{" "}
            <img
              src="/src/assets/vectors/Arrow.svg"
              alt="Icon Arrow"
              width={18}
              className={css.iconBtnHero}
            />
          </button>
        </div>
        <div className={css.rightInfo}>
          <div className={css.imageContainerHero}>
            <img
              srcSet="/src/assets/images/heroImage1x.jpg 1x, /src/assets/images/heroImage@2x.jpg 2x"
              src="/src/assets/images/heroImage1x.jpg"
              alt="Photo Hero Section"
              className={css.photoHero}
            />
          </div>
          <div className={css.iconContainerHero1}>
            <img
              src="/src/assets/vectors/people.svg"
              alt="Icon People"
              width={48}
              height={48}
            />
          </div>
          <div className={css.iconContainerHero2}>
            <img
              src="/src/assets/vectors/question.svg"
              alt="Icon People"
              width={40}
              height={40}
            />
          </div>
          <div className={css.cardPhotoHero}>
            <div className={css.iconCardHeroContainer}>
              <img src="/src/assets/vectors/Check.svg" alt="Icon Card Hero"/>
            </div>
            <div className={css.textsCardHero}>
              <h3 className={css.titleCardHero}>Experienced psychologists</h3>
              <p className={css.priceCardHero}>15,000</p>
            </div>
          </div>
        </div>
      </div>
      <div className={css.eclipseShadow}></div>
    </section>
  );
}
