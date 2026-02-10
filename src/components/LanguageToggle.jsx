export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div className="nav-lang">
      <button className={language === "EN" ? "active" : ""} onClick={() => setLanguage("EN")}>EN</button>
      <button className={language === "HI" ? "active" : ""} onClick={() => setLanguage("HI")}>HI</button>
      <button className={language === "MR" ? "active" : ""} onClick={() => setLanguage("MR")}>MR</button>
    </div>
  );
}
