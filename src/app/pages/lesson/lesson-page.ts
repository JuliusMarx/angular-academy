import { Component, computed, effect, inject, input, resource } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { Exercise } from './exercise';
import { Quiz } from './quiz';
import { Toc } from './toc';
import { TryIt } from './try-it';

@Component({
  selector: 'app-lesson-page',
  imports: [RouterLink, SafeHtmlPipe, Exercise, Quiz, Toc, TryIt],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.scss',
  host: { '(click)': 'onClick($event)' },
})
export default class LessonPage {
  private readonly content = inject(ContentService);
  private readonly title = inject(Title);
  protected readonly progress = inject(ProgressService);

  readonly lang = input.required<Lang>();
  readonly chapter = input.required<string>();
  readonly lesson = input.required<string>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly lessonId = computed(() => `${this.chapter()}/${this.lesson()}`);
  protected readonly chapterInfo = computed(() =>
    this.content.chapters(this.lang()).find((c) => c.slug === this.chapter()),
  );
  protected readonly neighbours = computed(() => this.content.neighbours(this.lang(), this.lessonId()));
  /** 1-based position of this lesson within the whole course. */
  protected readonly position = computed(() => {
    const lessons = this.content.allLessons(this.lang());
    const index = lessons.findIndex((l) => l.id === this.lessonId());
    return index < 0 ? null : { index: index + 1, total: lessons.length };
  });

  protected readonly data = resource({
    params: () => ({ lang: this.lang(), id: this.lessonId() }),
    loader: ({ params }) => this.content.loadLesson(params.lang, params.id),
  });

  protected readonly done = computed(() => this.progress.completed().has(this.lessonId()));

  constructor() {
    effect(() => {
      const lesson = this.data.value();
      this.title.setTitle(lesson ? `${lesson.title} – ${this.text().appName}` : this.text().appName);
    });
    effect(() => this.progress.visit(this.lessonId()));
  }

  protected toggleDone(): void {
    if (this.done()) this.progress.markIncomplete(this.lessonId());
    else this.progress.markCompleted(this.lessonId());
  }

  /** Copy buttons live inside Markdown-rendered HTML, so they are handled by delegation. */
  protected onClick(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
    const code = button?.parentElement?.querySelector('pre')?.textContent;
    if (!button || code == null) return;
    navigator.clipboard?.writeText(code).then(() => {
      button.textContent = this.text().copied;
      setTimeout(() => (button.textContent = this.text().copy), 1500);
    });
  }
}
