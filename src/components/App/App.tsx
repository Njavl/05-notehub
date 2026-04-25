import css from './App.module.css';

function App() {
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        {/* Пагінація */}
        <button className={css.button}>Create note +</button>
      </header>
    </div>
  );
}

export default App;
