import { feedbackFormUrl } from "../constants/app";

export function BetaFeedback() {
  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-2xl shadow-black/20 sm:p-6">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
        Beta Feedback
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        Testing ZipList?
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
        Try it with a real item, copy the generated listing, and tell me what
        worked, what confused you, and what would make ZipList more useful.
      </p>

      <a
        href={feedbackFormUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 text-base font-black text-black transition hover:bg-emerald-300 active:scale-[0.99]"
      >
        Give Feedback
      </a>

      <p className="mt-3 text-xs text-slate-500">
        Feedback opens in a short Google Form.
      </p>
    </section>
  );
}