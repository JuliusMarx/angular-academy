import { Pipe, PipeTransform } from '@angular/core';

/**
 * Shortens text to a maximum length without cutting words in half.
 * Usage: {{ text | truncate }} · {{ text | truncate: 40 }} · {{ text | truncate: 40 : ' [more]' }}
 */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, max = 30, suffix = '…'): string {
    if (!value || value.length <= max) return value ?? '';
    const cut = value.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    const shortened = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
    // "ahead,…" looks odd – drop trailing punctuation before the suffix.
    return shortened.replace(/[\s,.;:!?–-]+$/, '') + suffix;
  }
}
