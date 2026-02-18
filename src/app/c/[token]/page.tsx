import db from "@/lib/db";
import { notFound } from "next/navigation";
import { submitCheckinAction } from "./actions";

type ClientRow = {
  id: number;
  name: string;
  email: string;
  active: number;
};

type CheckinRow = {
  date: string;
  weight: number;
  water: number;
  protein: number;
};

export default function ClientCheckinPage({
  params,
  searchParams
}: {
  params: { token: string };
  searchParams?: { submitted?: string; error?: string };
}) {
  const client = db
    .prepare("SELECT id, name, email, active FROM clients WHERE token = ?")
    .get(params.token) as ClientRow | undefined;

  if (!client) {
    notFound();
  }

  const lastCheckin = db
    .prepare(
      "SELECT date, weight, water, protein FROM checkins WHERE client_id = ? ORDER BY date DESC LIMIT 1"
    )
    .get(client.id) as CheckinRow | undefined;

  const submitted = searchParams?.submitted === "1";
  const inactive = searchParams?.error === "inactive" || client.active === 0;

  return (
    <main>
      <header>
        <div>
          <h1>Denní zápis</h1>
          <p>Vítejte, {client.name}. Zapište své denní hodnoty níže.</p>
        </div>
        <a className="button ghost" href="/">
          Zpět na úvod
        </a>
      </header>

      {submitted ? <p className="notice">Denní zápis odeslán. Děkujeme!</p> : null}
      {inactive ? (
        <p className="notice">
          Váš kouč tento odkaz pozastavil. Ozvěte se prosím pro pomoc.
        </p>
      ) : null}

      <section className="grid">
        <div className="card">
          <h2>Dnešní denní zápis</h2>
          <form action={submitCheckinAction}>
            <input type="hidden" name="token" value={params.token} />
            <label htmlFor="weight">Hmotnost (kg)</label>
            <input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              min="30"
              required
            />
            <label htmlFor="water" style={{ marginTop: 12 }}>
              Příjem vody (litry)
            </label>
            <input
              id="water"
              name="water"
              type="number"
              step="0.1"
              min="0"
              required
            />
            <label htmlFor="protein" style={{ marginTop: 12 }}>
              Příjem bílkovin (gramy)
            </label>
            <input
              id="protein"
              name="protein"
              type="number"
              step="1"
              min="0"
              required
            />
            <div style={{ marginTop: 16 }}>
              <button type="submit" disabled={inactive}>
                Odeslat denní zápis
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Poslední denní zápis</h2>
          {lastCheckin ? (
            <div>
              <p>
                <strong>{lastCheckin.date}</strong>
              </p>
              <p>Hmotnost: {lastCheckin.weight.toFixed(1)} kg</p>
              <p>Voda: {lastCheckin.water.toFixed(1)} l</p>
              <p>Bílkoviny: {lastCheckin.protein} g</p>
            </div>
          ) : (
            <p>Zatím žádné denní zápisy. První záznam se zobrazí zde.</p>
          )}
        </div>
      </section>
    </main>
  );
}
