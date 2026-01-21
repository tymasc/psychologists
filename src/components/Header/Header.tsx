import { NavLink } from "react-router-dom";
import { useState } from "react";
import css from "./Header.module.css";
import Modal from "../Modal/Modal";
import LoginModal from "../AuthModal/Login";
import RegisterModal from "../AuthModal/Register";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../service/authService";

export default function Header() {
  const { user, loading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const logout = async () => {
      await logoutUser();
    };

    if (loading) return null;
  return (
    <header className={css.header}>
      <div className={css.headerBar}>
        <div className={css.logoContainer}>
          <p className={css.logoFite}>
            psychologists.<span className={css.logoSete}>services</span>
          </p>
        </div>
        <nav className={css.navBar}>
          <NavLink to="/" className={css.navBarComponent}>
            Home
          </NavLink>
          <NavLink
            to="/psychologists"
            className={({ isActive }) =>
              isActive
                ? `${css.navBarComponent} ${css.active}`
                : css.navBarComponent
            }
          >
            Psychologists
          </NavLink>
          {user && (
            <NavLink to="/favorites" className={css.navBarComponent}>
              Favorites
            </NavLink>
          )}
        </nav>
        <div className={css.accountInfo}>
          {user ? (
            <div className={css.buttonsAccountsContainer}>
              <div className={css.userInfo}>
                <img
                  src={
                    user.photoURL ??
                    "/src/assets/vectors/DefaultProfilePhoto.svg"
                  }
                  alt="Profile photo"
                  className="avatar"
                />
                <span>{user.displayName}</span>
              </div>
              <button onClick={logout} className={css.buttonHeader}>
                Log Out
              </button>
            </div>
          ) : (
            <div className={css.buttonsContainerHeader}>
              <button
                onClick={() => {
                  setIsLoginOpen(true);
                }}
                className={css.buttonHeader}
              >
                Log In
              </button>
              <button
                className={`${css.buttonHeader} ${css.buttonHeaderLogOut}`}
                onClick={() => {
                  setIsRegisterOpen(true);
                }}
              >
                Registration
              </button>
            </div>
          )}
        </div>
      </div>
      {isLoginOpen && (
        <Modal onClose={() => setIsLoginOpen(false)}>
          <LoginModal onSuccess={() => setIsLoginOpen(false)} />
        </Modal>
      )}
      {isRegisterOpen && (
        <Modal onClose={() => setIsRegisterOpen(false)}>
          <RegisterModal onSuccess={() => setIsRegisterOpen(false)} />
        </Modal>
      )}
    </header>
  );
}
