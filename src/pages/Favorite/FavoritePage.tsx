import css from "../Psychologists/PsychologistsPage.module.css";
import { useEffect, useState } from "react";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import { useAuth } from "../../hooks/useAuth";
import { fetchPsychologists } from "../../service/getPsychologists";
import {
  addFavorite,
  getFavoritesMap,
  removeFavorite,
} from "../../service/favoritesService";
import { Psychologist } from "../../types/psychologist";

export default function FavoritesPage() {
  const { user } = useAuth();

  const [allPsychologists, setAllPsychologists] = useState<Psychologist[]>([]);
  const [favorites, setFavorites] = useState<Record<string, true>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        if (!user) return;

        const [psychs, favMap] = await Promise.all([
          fetchPsychologists(),
          getFavoritesMap(user.uid),
        ]);

        if (ignore) return;

        setAllPsychologists(psychs);
        setFavorites(favMap);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [user]);

  const handleToggleFavorite = async (id: string) => {
    if (!user) return;

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
  };

  const favoriteList = allPsychologists.filter((p) => favorites[p.id]);

  return (
    <section className={css.sectionPsychologists}>
      <div className={css.filterContainer}>
        <div className={css.textFilterContainer}>
          <p className={css.titleFilter}>Favorites</p>
        </div>
      </div>

      {loading && (
        <div className={`${css.loadingContainer} ${css.activeLoader}`}>
          <div className={css.spinner}></div>
        </div>
      )}

      {!loading && favoriteList.length === 0 && (
        <p style={{ padding: 20, opacity: 0.7 }}>
          You don’t have any favorite psychologists yet.
        </p>
      )}

      <div className={css.cardsContainer}>
        {favoriteList.map((psychologist) => (
          <PsychologistCard
            key={psychologist.id}
            psychologist={psychologist}
            isFavorite={true}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}
