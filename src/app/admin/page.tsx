import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  addClientAction,
  deleteClientAction,
  toggleClientAction,
  logoutAction
} from "./actions";

type ClientRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  start_weight: number | null;
  target_weight: number | null;
  token: string;
  active: number;
  created_at: string;
  last_checkin: string | null;
};

function daysSince(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function AdminDashboard({
  searchParams
}: {
  searchParams?: { error?: string; added?: string };
}) {
  requireAdmin();

  const clients = db
    .prepare(
      `
      SELECT c.*, MAX(ch.date) as last_checkin
      FROM clients c
      LEFT JOIN checkins ch ON ch.client_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
      `
    )
    .all() as ClientRow[];

  const missing = clients.filter((client) => {
    const base = client.last_checkin || client.created_at;
    return daysSince(base) >= 2;
  });

  return (
    <main>
      <header>
        <div>
          <h1>Admin panel</h1>
          <p>Sledujte klienty, přidávejte nové a prohlížejte historii denních zápisů.</p>
        </div>
        <form action={logoutAction}>
          <button className="ghost" type="submit">
            Odhlásit se
          </button>
        </form>
      </header>

      <section className="grid">
        <div className="card">
          <h2>Klienti</h2>
          <div className="stat">{clients.length}</div>
          <p>Celkem klientů ve vašem programu.</p>
        </div>
        <div className="card">
          <h2>Chybějící denní zápisy</h2>
          <div className="stat">{missing.length}</div>
          <p>Klienti bez denního zápisu 2+ dny.</p>
        </div>
        <div className="card">
          <h2>Připomínky</h2>
          <p>
            Automatické připomínky se spouští každou hodinu pro ty, kteří jsou
            neaktivní 24+ hodin.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 32 }} className="grid">
        <div className="card" style={{ minWidth: 320 }}>
          <h2>Přidat klienta</h2>
          {searchParams?.error === "missing" ? (
            <p className="notice">Jméno a email jsou povinné.</p>
          ) : searchParams?.error === "invalid_phone" ? (
            <p className="notice">
              Zadaný telefon není ve správném formátu. Použijte číslice a případně
              +, -, mezery nebo závorky.
            </p>
          ) : searchParams?.error === "invalid_weights" ? (
            <p className="notice">Hmotnosti musí být kladná čísla.</p>
          ) : null}
          {searchParams?.added ? (
            <p className="notice">
              Klient byl přidán. Níže sdílejte jeho soukromý odkaz.
            </p>
          ) : null}
          <form action={addClientAction}>
            <label htmlFor="name">Jméno klienta</label>
            <input id="name" name="name" required />
            <label htmlFor="email" style={{ marginTop: 12 }}>
              Email
            </label>
            <input id="email" name="email" type="email" required />
            <label htmlFor="phone" style={{ marginTop: 12 }}>
              Telefon
            </label>
            <input id="phone" name="phone" type="tel" />
            <label htmlFor="start_weight" style={{ marginTop: 12 }}>
              Startovní hmotnost (kg)
            </label>
            <input
              id="start_weight"
              name="start_weight"
              type="number"
              step="0.1"
              min="0.1"
              required
            />
            <label htmlFor="target_weight" style={{ marginTop: 12 }}>
              Cílová hmotnost (kg)
            </label>
            <input
              id="target_weight"
              name="target_weight"
              type="number"
              step="0.1"
              min="0.1"
              required
            />
            <div style={{ marginTop: 16 }}>
              <button type="submit">Vytvořit klienta</button>
            </div>
          </form>
        </div>

        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <h2>Seznam klientů</h2>
          {clients.length === 0 ? (
            <p>Zatím žádní klienti. Přidejte prvního klienta.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Klient</th>
                  <th>Telefon</th>
                  <th>Startovní hmotnost (kg)</th>
                  <th>Cílová hmotnost (kg)</th>
                  <th>Stav</th>
                  <th>Poslední denní zápis</th>
                  <th>Soukromý odkaz</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => {
                  const base = client.last_checkin || client.created_at;
                  const days = daysSince(base);
                  return (
                    <tr key={client.id}>
                      <td>
                        <strong>{client.name}</strong>
                        <div style={{ color: "var(--muted)", fontSize: 13 }}>
                          {client.email}
                        </div>
                      </td>
                      <td>{client.phone || "—"}</td>
                      <td>
                        {typeof client.start_weight === "number"
                          ? client.start_weight.toFixed(1)
                          : "—"}
                      </td>
                      <td>
                        {typeof client.target_weight === "number"
                          ? client.target_weight.toFixed(1)
                          : "—"}
                      </td>
                      <td>
                        {client.active ? (
                          <span className="badge">Aktivní</span>
                        ) : (
                          <span className="badge danger">Neaktivní</span>
                        )}
                      </td>
                      <td>
                        {client.last_checkin ? (
                          <span>
                            {client.last_checkin}
                            {days >= 2 ? (
                              <span className="badge warning" style={{ marginLeft: 8 }}>
                                {days} dní
                              </span>
                            ) : null}
                          </span>
                        ) : (
                          <span className="badge warning">Bez denních zápisů</span>
                        )}
                      </td>
                      <td>
                        <code>{`/c/${client.token}`}</code>
                      </td>
                      <td>
                        <div className="actions">
                          <a className="button secondary" href={`/admin/clients/${client.id}`}>
                            Zobrazit
                          </a>
                          <form action={toggleClientAction}>
                            <input type="hidden" name="id" value={client.id} />
                            <input
                              type="hidden"
                              name="active"
                              value={client.active ? 0 : 1}
                            />
                            <button className="ghost" type="submit">
                              {client.active ? "Deaktivovat" : "Aktivovat"}
                            </button>
                          </form>
                          <form action={deleteClientAction}>
                            <input type="hidden" name="id" value={client.id} />
                            <button
                              className="ghost"
                              type="submit"
                              style={{ borderColor: "#f1b1ad", color: "var(--danger)" }}
                            >
                              Smazat
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
