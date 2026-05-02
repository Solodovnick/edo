import React from "react";

export const App: React.FC = () => {
  return (
    <div className="edo-shell">
      <header className="edo-shell__header">
        <h1 className="edo-shell__title">EDO</h1>
        <p className="edo-shell__subtitle">Электронный документооборот</p>
      </header>
      <main className="edo-shell__main">
        <p>Структура проекта: <code>src/components</code>, <code>src/hooks</code>, <code>src/utils</code>, <code>src/types</code>, <code>src/assets</code>, <code>public</code>.</p>
      </main>
    </div>
  );
};
