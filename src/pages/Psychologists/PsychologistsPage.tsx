import css from "./PsychologistsPage.module.css";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import { useState, useEffect } from "react";
import { FilterType } from "../../types/filters";
import { fetchPsychologists } from "../../service/getPsychologists";
import { Psychologist } from "../../types/psychologist";
import { useAuth } from "../../hooks/useAuth";
import {
  getFavoritesMap,
  addFavorite,
  removeFavorite,
} from "../../service/favoritesService";
import { toast } from "react-toastify";

export default function Psychologists() {
  const [filter, setFilter] = useState<FilterType>("AZ");
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Record<string, true>>({});

  useEffect(() => {
    let ignore = false;

    const loadFavs = async () => {
      if (!user) {
        setFavorites({});
        return;
      }

      const map = await getFavoritesMap(user.uid);
      if (!ignore) setFavorites(map);
    };

    loadFavs();

    return () => {
      ignore = true;
    };
  }, [user]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const data = await fetchPsychologists();
        if (ignore) return;

        setPsychologists(data);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const filters: { label: string; value: FilterType }[] = [
    { label: "A to Z", value: "AZ" },
    { label: "Z to A", value: "ZA" },
    { label: "Less than 100$", value: "PRICE_LOW" },
    { label: "Greater than 100$", value: "PRICE_HIGH" },
    { label: "Popular", value: "POPULAR" },
    { label: "Not popular", value: "NOT_POPULAR" },
    { label: "Show all", value: "ALL" },
  ];

  const getFilteredPsychologists = () => {
    const result = [...psychologists];

    switch (filter) {
      case "AZ":
        return result.sort((a, b) => a.name.localeCompare(b.name));

      case "ZA":
        return result.sort((a, b) => b.name.localeCompare(a.name));

      case "PRICE_LOW":
        return result.filter((p) => p.price_per_hour < 100);

      case "PRICE_HIGH":
        return result.filter((p) => p.price_per_hour > 100);

      case "POPULAR":
        return result.sort((a, b) => b.rating - a.rating);

      case "NOT_POPULAR":
        return result.sort((a, b) => a.rating - b.rating);

      case "ALL":
      default:
        return psychologists;
    }
  };

  const filteredPsychologists = getFilteredPsychologists();

  return (
    <section className={css.sectionPsychologists}>
      <div className={css.filterContainer}>
        <div className={css.textFilterContainer}>
          <p className={css.titleFilter}>Filters</p>
        </div>
        <div className={css.filterOptions}>
          <button
            type="button"
            className={css.filterButton}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <p className={css.filterSee}>
              {filters.find((f) => f.value === filter)?.label}
            </p>
            <span className={css.arrow}>
              <img
                src={`${import.meta.env.BASE_URL}/vectors/arrow-select.svg`}
                alt="Icon Arrow"
                className={
                  isOpen ? `${css.iconArrow} ${css.activeIcon}` : css.iconArrow
                }
              />
            </span>
          </button>
          {isOpen && (
            <ul className={css.filterDropdown}>
              {filters.map((item) => (
                <li
                  key={item.value}
                  className={`${css.filterItem} ${
                    filter === item.value ? css.active : ""
                  }`}
                  onClick={() => {
                    setFilter(item.value);
                    setIsOpen(false);
                    setVisibleCards(3);
                  }}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={css.cardsContainer}>
        {filteredPsychologists.slice(0, visibleCards).map((psychologist) => (
          <PsychologistCard
            key={psychologist.id}
            psychologist={psychologist}
            isFavorite={!!favorites[psychologist.id]}
            onToggleFavorite={async (id) => {
              if (!user) {
                toast.error("Please log in to add psychologist to favorites");
                return;
              }

              const isFav = !!favorites[id];

              if (isFav) {
                await removeFavorite(user.uid, id);
                setFavorites((prev) => {
                  const copy = { ...prev };
                  delete copy[id];
                  return copy;
                });
              } else {
                await addFavorite(user.uid, id);
                setFavorites((prev) => ({ ...prev, [id]: true }));
              }
            }}
          />
        ))}
      </div>
      {visibleCards < filteredPsychologists.length && (
        <div className={css.buttonLoadMoreContainer}>
          <button
            type="button"
            className={css.buttonLoadMore}
            id="buttonLoadMore"
            onClick={() => setVisibleCards((prev) => prev + 3)}
          >
            Load More
          </button>
        </div>
      )}
      {loading && (
        <div
          className={`${css.loadingContainer} ${css.activeLoader}`}
          id="loaderContainer"
        >
          <div id="loader" className={css.spinner}></div>
        </div>
      )}
    </section>
  );
}
