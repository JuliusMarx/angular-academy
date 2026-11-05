import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  linkedSignal,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang, LessonSummary, QuizQuestion } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { placementLoaders } from '../../content/generated/placement';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';

/** Answer value for "I don't know". */
const DONT_KNOW = -1;

interface PlacementLesson extends LessonSummary {
  chapter: string;
  question: QuizQuestion;
}

interface PlacementChapter {
  slug: string;
  title: string;
  lessons: PlacementLesson[];
}

/**
 * Placement test: the first quiz question of every lesson, one chapter per step.
 * Lessons answered correctly can be marked as done, so learners skip what they already know.
 */
@Component({
  selector: 'app-placement-page',
  imports: [RouterLink, SafeHtmlPipe],
  templateUrl: './placement-page.html',
  styleUrl: './placement-page.scss',
})
export default class PlacementPage {
  private readonly content = inject(ContentService);
  private readonly progress = inject(ProgressService);
  private readonly title = inject(Title);
  private readonly injector = inject(Injector);
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly dontKnow = DONT_KNOW;

  private readonly questions = resource({
    params: () => this.lang(),
    loader: ({ params }) => placementLoaders[params](),
  });

  protected readonly chapters = computed<PlacementChapter[]>(() => {
    const questions = new Map((this.questions.value() ?? []).map((q) => [q.lesson, q.question]));
    return this.content
      .chapters(this.lang())
      .map((chapter) => ({
        slug: chapter.slug,
        title: chapter.title,
        lessons: chapter.lessons.flatMap((lesson) => {
          const question = questions.get(lesson.id);
          return question ? [{ ...lesson, chapter: chapter.slug, question }] : [];
        }),
      }))
      .filter((chapter) => chapter.lessons.length > 0);
  });

  /** Index of the chapter being asked; everything resets when the language changes. */
  protected readonly step = linkedSignal({ source: this.lang, computation: () => 0 });
  /** Selected option per lesson id (DONT_KNOW for "I don't know"). */
  protected readonly answers = linkedSignal<Lang, Record<string, number>>({ source: this.lang, computation: () => ({}) });
  protected readonly finished = linkedSignal({ source: this.lang, computation: () => false });
  /** Number of lessons marked as done, once the result was applied. */
  protected readonly applied = linkedSignal<Lang, number | null>({ source: this.lang, computation: () => null });

  protected readonly current = computed(() => this.chapters()[this.step()]);
  protected readonly isLast = computed(() => this.step() >= this.chapters().length - 1);

  protected readonly results = computed(() =>
    this.chapters().map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.map((lesson) => ({ ...lesson, known: this.answers()[lesson.id] === lesson.question.answer })),
    })),
  );
  private readonly resultLessons = computed(() => this.results().flatMap((c) => c.lessons));
  protected readonly knownCount = computed(() => this.resultLessons().filter((l) => l.known).length);
  protected readonly totalCount = computed(() => this.resultLessons().length);
  protected readonly firstToLearn = computed(() => this.resultLessons().find((l) => !l.known));

  constructor() {
    effect(() => this.title.setTitle(`${this.text().placement} – ${this.text().appName}`));
  }

  protected select(lessonId: string, option: number): void {
    this.answers.update((answers) => ({ ...answers, [lessonId]: option }));
  }

  protected next(): void {
    if (this.isLast()) {
      this.finish();
      return;
    }
    this.step.update((step) => step + 1);
    this.focusHeading();
  }

  protected finish(): void {
    this.finished.set(true);
    this.focusHeading();
  }

  protected apply(): void {
    const known = this.resultLessons().filter((l) => l.known);
    for (const lesson of known) this.progress.markCompleted(lesson.id);
    // "Continue learning" on the home page then leads to the first lesson that is left.
    const next = this.firstToLearn();
    if (next) this.progress.visit(next.id);
    this.applied.set(known.length);
  }

  protected restart(): void {
    this.step.set(0);
    this.answers.set({});
    this.finished.set(false);
    this.applied.set(null);
    this.focusHeading();
  }

  /** Moves focus (and the scroll position) to the new step's heading, for keyboard and screen reader users. */
  private focusHeading(): void {
    afterNextRender(() => this.heading()?.nativeElement.focus(), { injector: this.injector });
  }
}
