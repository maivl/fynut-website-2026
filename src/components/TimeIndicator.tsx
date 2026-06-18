const TIMES = [
  { key: "morning", label: "Morning · 清晨" },
  { key: "noon", label: "Noon · 正午" },
  { key: "dusk", label: "Dusk · 黄昏" },
  { key: "night", label: "Night · 深夜" },
];

export default function TimeIndicator() {
  return (
    <div
      class="time-indicator"
      id="timeIndicator"
      aria-label="Time of day selector"
    >
      {TIMES.map((t, i) => (
        <div
          class={`time-dot${i === 0 ? " active" : ""}`}
          data-time={t.key}
          role="button"
          tabindex={0}
          aria-label={t.label}
          title={t.label}
        >
          <span class="time-label">{t.label}</span>
        </div>
      ))}
    </div>
  );
}
