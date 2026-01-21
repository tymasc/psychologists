import { useEffect } from "react";
import css from "./Modal.module.css";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ children, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={css.closeBtn} onClick={onClose}>
          <img
            src="/src/assets/vectors/close.svg"
            alt="Icon Close"
            width={32}
            height={32}
          />
        </button>
        {children}
      </div>
    </div>
  );
}
