import { Pipe, PipeTransform } from "@angular/core";
 
@Pipe({
  name: "timeAgo",
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
      const date = this.parseCreatedAt(value);
      if (!date) return "";

      const diffSeconds = Math.round((Date.now() - date.getTime()) / 1000);
      const rtf = new Intl.RelativeTimeFormat("es-ES", { numeric: "auto" });
      const absSeconds = Math.abs(diffSeconds);

      if (absSeconds < 60) return rtf.format(-diffSeconds, "second");

      const minutes = Math.round(diffSeconds / 60);
      if (Math.abs(minutes) < 60) return rtf.format(-minutes, "minute");

      const hours = Math.round(minutes / 60);
      if (Math.abs(hours) < 24) return rtf.format(-hours, "hour");

      const days = Math.round(hours / 24);
      if (Math.abs(days) < 30) return rtf.format(-days, "day");

      const months = Math.round(days / 30);
      if (Math.abs(months) < 12) return rtf.format(-months, "month");

      const years = Math.round(days / 365);
      return rtf.format(-years, "year");
  }

  private parseCreatedAt(value: Date | string | number | null | undefined): Date | null {
      if (value == null) return null;
      if (value instanceof Date) return value;
      if (typeof value === "number") return new Date(value < 1e12 ? value * 1000 : value);
      if (typeof value === "string") {
          const trimmed = value.trim();
          if (/^\d+$/.test(trimmed)) {
              const asNumber = Number(trimmed);
              const millis = trimmed.length <= 10 ? asNumber * 1000 : asNumber;
              return new Date(millis);
          }
          const parsed = new Date(trimmed);
          return isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
  }
}