import { KeyText } from "@/components/journal/KeyText";

// MDX building blocks for case studies. All take plain data props, so the MDX stays readable
// and every value is a resume fact written once. Text accepts **key term** markers.

type LedgerProps = {
  /** Column headings, e.g. ["What could go wrong", "What stops it"]. */
  columns: [string, string];
  rows: [string, string][];
};

/** A ruled two-column ledger: a problem and its answer, a part and its job. */
export function Ledger({ columns, rows }: LedgerProps) {
  return (
    <div className="my-8 max-w-3xl overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-ink/40 border-b">
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="font-note text-lead text-ink-soft pb-3 font-normal"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a} className="border-ink/15 border-b align-top">
              <td className="py-4 pr-6 md:w-2/5">
                <KeyText text={a} />
              </td>
              <td className="py-4">
                <KeyText text={b} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type FiguresProps = { items: { value: string; label: string }[] };

/** The take: figures in typewriter numerals, each on a pasted slip. */
export function Figures({ items }: FiguresProps) {
  return (
    <ul className="my-8 grid max-w-3xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => (
        <li
          key={f.label}
          className="paper-dark shadow-pasted px-5 py-4"
          style={{ rotate: `${[-0.4, 0.5, -0.2, 0.3][i % 4]}deg` }}
        >
          <p className="font-type text-h3 leading-none">{f.value}</p>
          <p className="text-small mt-2">{f.label}</p>
        </li>
      ))}
    </ul>
  );
}

type CompareProps = {
  columns: [string, string, string];
  rows: [string, string, string][];
};

/** Before and after, row by row (a baseline and what it became). */
export function Compare({ columns, rows }: CompareProps) {
  return (
    <div className="my-8 max-w-3xl overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-ink/40 border-b">
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="font-note text-lead text-ink-soft pb-3 font-normal"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, before, after]) => (
            <tr key={name} className="border-ink/15 border-b">
              <th scope="row" className="py-4 pr-6 text-left font-normal">
                {name}
              </th>
              <td className="font-type text-ink-soft decoration-blood/70 py-4 pr-6 tabular-nums line-through">
                {before}
              </td>
              <td className="font-type text-h4 py-4 tabular-nums">{after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
