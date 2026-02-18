import { loginAction } from "./actions";

export default function AdminLoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error === "invalid";

  return (
    <main>
      <header>
        <div>
          <h1>Přihlášení do administrace</h1>
          <p>Použijte heslo kouče pro přístup do panelu.</p>
        </div>
        <a className="button ghost" href="/">
          Zpět na úvod
        </a>
      </header>

      <div className="card" style={{ maxWidth: 420 }}>
        {error ? (
          <p className="notice">Nesprávné heslo. Zkuste to prosím znovu.</p>
        ) : null}
        <form action={loginAction}>
          <label htmlFor="password">Heslo administrátora</label>
          <input id="password" name="password" type="password" required />
          <div style={{ marginTop: 16 }}>
            <button type="submit">Přihlásit se</button>
          </div>
        </form>
      </div>
    </main>
  );
}
