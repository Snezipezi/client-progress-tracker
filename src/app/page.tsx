export default function HomePage() {
  return (
    <main>
      <header>
        <div>
          <h1>Sledování pokroku klientů</h1>
          <p>Soukromé denní zápisy pro klienty a přehledný panel pro nutričního kouče.</p>
        </div>
        <a className="button" href="/admin/login">
          Přihlášení do administrace
        </a>
      </header>

      <section className="hero">
        <div className="card">
          <h2>Pro klienty</h2>
          <p>
            Klienti vyplňují rychlé denní zápisy přes svůj soukromý odkaz. Není
            potřeba přihlášení.
          </p>
          <p className="notice">
            Požádejte svého nutričního kouče o osobní odkaz na denní zápis.
          </p>
        </div>
        <div className="card">
          <h2>Pro kouče</h2>
          <p>
            Sledujte pokrok, hlídejte chybějící denní zápisy a udržte klienty na
            správné cestě.
          </p>
          <div className="actions">
            <a className="button secondary" href="/admin">
              Přejít na panel
            </a>
            <a className="button ghost" href="/admin/login">
              Přihlásit se
            </a>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <h3>Denní zápisy</h3>
          <p>Hmotnost, voda a bílkoviny do minuty.</p>
        </div>
        <div className="card">
          <h3>Přehled pro kouče</h3>
          <p>Na první pohled uvidíte chybějící zápisy a historii.</p>
        </div>
        <div className="card">
          <h3>Automatické připomínky</h3>
          <p>Připomeňte se klientům po 24 hodinách bez denního zápisu.</p>
        </div>
      </section>

      <footer>
        Určeno pro lokální nasazení. Pro e-mailové připomínky nastavte SMTP.
      </footer>
    </main>
  );
}
