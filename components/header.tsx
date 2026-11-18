import NavLinks from "./NavLinks";

export default function Header() {
  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="mx-auto max-w-5xl px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Riverside Ward</h1>
            <p className="text-sm text-slate-300">{currentDate}</p>
          </div>

          <NavLinks />
        </div>
      </div>
    </header>
  );
}