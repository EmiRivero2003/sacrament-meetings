export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-6 text-center text-sm text-slate-600">
        <p>
          © {new Date().getFullYear()} Riverside Ward Sacrament Meeting Planner
        </p>
      </div>
    </footer>
  );
}