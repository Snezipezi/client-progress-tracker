import db from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/auth";
import { notFound } from "next/navigation";

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
};

type CheckinRow = {
  id: number;
  date: string;
  weight: number;
  water: number;
  protein: number;
};

export default function ClientHistoryPage({
  params
}: {
  params: { id: string };
}) {
  requireAdmin();
  const clientId = Number(params.id);

  const client = db
    .prepare("SELECT * FROM clients WHERE id = ?")
    .get(clientId) as ClientRow | undefined;

  if (!client) {
    notFound();
  }

  const checkins = db
    .prepare(
      "SELECT id, date, weight, water, protein FROM checkins WHERE client_id = ? ORDER BY date DESC"
    )
    .all(clientId) as CheckinRow[];

  const hasWeights =
    typeof client.start_weight === "number" &&
    typeof client.target_weight === "number";
  const latestWeight = hasWeights
    ? checkins.length > 0
      ? checkins[0].weight
      : client.start_weight
    : null;
  const startWeight = client.start_weight ?? null;
  const targetWeight = client.target_weight ?? null;
  const totalDelta =
    latestWeight !== null && startWeight !== null && targetWeight !== null
      ? targetWeight - startWeight
      : null;
  const currentDelta =
    latestWeight !== null && startWeight !== null ? latestWeight - startWeight : null;
  const progressPercent =
    totalDelta === null || currentDelta === null
      ? null
      : totalDelta === 0
        ? 100
        : Math.min(100, Math.max(0, (currentDelta / totalDelta) * 100));
  const remaining =
    latestWeight !== null && targetWeight !== null
      ? Math.abs(targetWeight - latestWeight)
      : null;

  return (
    <main>
      <header>
        <div>
          <h1>{client.name}</h1>
          <p>{client.email}</p>
          {client.phone ? <p>{client.phone}</p> : null}
        </div>
        <a className="button ghost" href="/admin">
          Zpět na panel
        </a>
      </header>

      <div className="card">
        <p>
          <strong>Startovní hmotnost:</strong>{" "}
          {typeof client.start_weight === "number"
            ? `${client.start_weight.toFixed(1)} kg`
            : "—"}
        </p>
        <p>
          <strong>Cílová hmotnost:</strong>{" "}
          {typeof client.target_weight === "number"
            ? `${client.target_weight.toFixed(1)} kg`
            : "—"}
        </p>
        <p>
          <strong>Zbývá do cíle:</strong>{" "}
          {remaining !== null ? `${remaining.toFixed(1)} kg` : "—"}
        </p>
        <p>
          <strong>Splněno:</strong>{" "}
          {progressPercent !== null ? `${progressPercent.toFixed(0)} %` : "—"}
        </p>
        <h2>Historie denních zápisů</h2>
        {checkins.length === 0 ? (
          <p>Zatím žádné denní zápisy.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Hmotnost (kg)</th>
                <th>Voda (l)</th>
                <th>Bílkoviny (g)</th>
              </tr>
            </thead>
            <tbody>
              {checkins.map((checkin) => (
                <tr key={checkin.id}>
                  <td>{checkin.date}</td>
                  <td>{checkin.weight.toFixed(1)}</td>
                  <td>{checkin.water.toFixed(1)}</td>
                  <td>{checkin.protein}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
