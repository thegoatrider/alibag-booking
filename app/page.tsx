export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center gap-4">
      <a
        href="/dashboard/admin"
        className="border px-6 py-3 rounded"
      >
        Go to Admin
      </a>

      <a
        href="/dashboard/owner"
        className="border px-6 py-3 rounded"
      >
        Go to Owner
      </a>

      <a
        href="/dashboard/guest"
        className="border px-6 py-3 rounded"
      >
        Go to Guest
      </a>

      <a
        href="/dashboard/influencer"
        className="border px-6 py-3 rounded"
      >
        Go to Influencer Dashboard
      </a>
    </main>
  );
}
