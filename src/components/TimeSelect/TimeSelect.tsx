import * as Select from "@radix-ui/react-select";
import { useMemo } from "react";
import css from "./TImeSelect.module.css";

type Props = {
  value: string;
  onChange: (next: string) => void;
  step?: number;
  start?: string;
  end?: string;
  placeholder?: string;
  disabled?: boolean;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

function buildSlots(start: string, end: string, step: number) {
  const res: string[] = [];
  const s = toMinutes(start);
  const e = toMinutes(end);

  for (let t = s; t <= e; t += step) {
    res.push(fromMinutes(t));
  }
  return res;
}

function ClockIcon() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}/vectors/clock.svg`}
      width={20}
      height={20}
    />
  );
}

export default function TimeSelect({
  value,
  onChange,
  step = 30,
  start = "00:00",
  end = "23:30",
  placeholder = "00:00",
  disabled = false,
}: Props) {
  const items = useMemo(() => buildSlots(start, end, step), [start, end, step]);
  const displayValue = items.includes(value) ? value : "";

  return (
    <Select.Root
      value={displayValue}
      onValueChange={onChange}
      disabled={disabled}
    >
      <Select.Trigger className={css.trigger} aria-label="Meeting time">
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={css.icon}>
          <ClockIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={css.content}
          position="popper"
          sideOffset={8}
        >
          <div className={css.title}>Meeting time</div>

          <Select.Viewport className={css.viewport}>
            {items.map((t) => (
              <Select.Item key={t} value={t} className={css.item}>
                <Select.ItemText>{t}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
