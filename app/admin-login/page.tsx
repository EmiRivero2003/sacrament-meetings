
import { loginAdmin } from "./actions";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">
        Administrator Login
      </h1>

      <p className="mt-3 text-slate-600">
        Sign in to manage sacrament meetings.
      </p>

      <form action={loginAdmin} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block font-medium text-slate-900"
          >
            Administrator Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-slate-400 px-4 py-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
          />
        </div>

        {error === "invalid" && (
          <p role="alert" className="text-sm text-red-700">
            Invalid administrator password.
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
