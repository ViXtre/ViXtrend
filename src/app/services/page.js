'use client';

import Link from 'next/link';
import { Reveal, RevealWords } from '@/components/shared/Reveal';
import styles from './services.module.css';

/* ── SVG икони ── */
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const AppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);
const CpuIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9"  y1="1"  x2="9"  y2="4"/>
    <line x1="15" y1="1"  x2="15" y2="4"/>
    <line x1="9"  y1="20" x2="9"  y2="23"/>
    <line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9"  x2="23" y2="9"/>
    <line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1"  y1="9"  x2="4"  y2="9"/>
    <line x1="1"  y1="14" x2="4"  y2="14"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ── Данни ── */
const WEBSITE_TIERS = [
  {
    label:   'По шаблон',
    price:   '500€',
    desc:    'Бързо, чисто, функционално. За бизнес, който иска надеждно онлайн присъствие без усложнения.',
    bullets: ['Готов в 5–7 дни', 'Мобилна версия', 'Базово SEO'],
  },
  {
    label:    'От нулата',
    price:    '700€',
    featured: true,
    desc:     'Уникален дизайн, специфична функционалност — изграден точно под вашите нужди, не под нечий шаблон.',
    bullets:  ['Персонален дизайн', 'Специфична логика', 'Обучение след предаване'],
  },
  {
    label:   'Осъвременяване',
    price:   '800€',
    desc:    'Имате сайт, но изглежда като 2015? Взимаме го, правим го бърз, съвременен и удобен за мобилен.',
    bullets: ['Запазен домейн', 'Нов дизайн', 'Оптимизирана скорост'],
  },
];

const PROCESS_STEPS = [
  {
    num:   '01',
    title: 'Запитване',
    desc:  'Пишете ни. Без форми с 20 полета — директно съобщение е достатъчно.',
  },
  {
    num:   '02',
    title: 'Разговор',
    desc:  'Обсъждаме идеята, реалния обхват и цената. Без скрити такси, без изненади.',
  },
  {
    num:   '03',
    title: 'Реализация',
    desc:  'Работим, показваме напредък и питаме при нужда. Не изчезваме след аванса.',
  },
  {
    num:   '04',
    title: 'Предаване',
    desc:  'Получавате готовия продукт и ви обучаваме да го разбирате. Ваш е.',
  },
];

const TRUST_POINTS = [
  { label: 'Без посредници' },
  { label: 'Без скрити такси' },
  { label: 'Без изненади' },
];

export default function ServicesPage() {
  return (
    <div className={styles.page}>

      {/* ══ INTRO ══ */}
      <section className={styles.intro}>

        <Reveal from="up" delay={80}>
          <div className={styles.introBadge}>Услуги</div>
        </Reveal>

        {/* Ред 1 — дума по дума */}
        <h1 className={styles.introTitle}>
          <RevealWords text="Обсъждаме. Действаме." delay={160} />
        </h1>

        {/* Ред 2 — gradient, единичен Reveal */}
        <Reveal as="p" from="up" delay={420} className={`${styles.introTitle} ${styles.introTitleGrad}`}>
          Вашо е.
        </Reveal>

        {/* 3 bullet-а в ред */}
        <Reveal from="up" delay={560}>
          <div className={styles.trustRow}>
            {TRUST_POINTS.map((p, i) => (
              <span key={p.label} className={styles.trustItem}>
                <span className={styles.trustDot} />
                {p.label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal from="up" delay={680}>
          <p className={styles.introSub}>
            Работим директно — без посредници, без скрити такси, без обещания, които не можем да изпълним.
            Казваме какво можем да направим, правим го и Ви го предаваме.
          </p>
        </Reveal>

      </section>

      {/* ══ УСЛУГИ ══ */}
      <section className={styles.services}>

        {/* 1. Консултация */}
        <Reveal from="up" delay={0} className={`${styles.card} ${styles.cardConsult}`}>
          <div className={styles.cardHead}>
            <div className={styles.cardIcon}><ChatIcon /></div>
            <div className={styles.cardHeadText}>
              <span className={styles.cardTag}>Входна точка</span>
              <h2 className={styles.cardTitle}>Консултация & реализиране на идея</h2>
            </div>
            <div className={`${styles.priceChip} ${styles.priceChipFree}`}>Безплатно</div>
          </div>
          <p className={styles.cardDesc}>
            Имате идея, но не знаете откъде да тръгнете? Разговаряме, слушаме и заедно намираме реалистичен план —
            без ангажимент от ваша страна. Ако след разговора решите да не продължим заедно,
            напускате с ясна представа какво ви трябва.
          </p>
          <Link href="#contact" className={styles.cardCta}>
            Започнете тук <ArrowIcon />
          </Link>
        </Reveal>

        {/* 2. Уебсайтове — широка */}
        <Reveal from="up" delay={80} className={`${styles.card} ${styles.cardWide}`}>
          <div className={styles.cardHead}>
            <div className={styles.cardIcon}><GlobeIcon /></div>
            <div className={styles.cardHeadText}>
              <span className={styles.cardTag}>Уеб присъствие</span>
              <h2 className={styles.cardTitle}>Уебсайтове</h2>
            </div>
          </div>
          <p className={styles.cardDesc}>
            Три варианта в зависимост от нуждата и бюджета.
            Всеки включва мобилна версия и предаване с обяснение.
          </p>
          <div className={styles.tiers}>
            {WEBSITE_TIERS.map((tier, i) => (
              <Reveal key={tier.label} from="up" delay={160 + i * 100}
                      className={`${styles.tier} ${tier.featured ? styles.tierFeatured : ''}`}>
                {tier.featured && <span className={styles.tierBadge}>Препоръчан</span>}
                <div className={styles.tierLabel}>{tier.label}</div>
                <div className={styles.tierPrice}>{tier.price}</div>
                <p className={styles.tierDesc}>{tier.desc}</p>
                <ul className={styles.tierBullets}>
                  {tier.bullets.map((b) => (
                    <li key={b} className={styles.tierBullet}>
                      <span className={styles.bulletCheck}><CheckIcon /></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* 3. Приложения */}
        <Reveal from="left" delay={0} className={styles.card}>
          <div className={styles.cardHead}>
            <div className={styles.cardIcon}><AppIcon /></div>
            <div className={styles.cardHeadText}>
              <span className={styles.cardTag}>От нулата</span>
              <h2 className={styles.cardTitle}>Уеб & мобилни приложения</h2>
            </div>
            <div className={styles.priceChip}>от 80€</div>
          </div>
          <p className={styles.cardDesc}>
            Когато уебсайт не е достатъчен. Персонализирани платформи, вътрешни инструменти,
            клиентски портали или мобилно приложение — изграждаме го от нулата под вашия процес, не обратното.
          </p>
          <ul className={styles.featureList}>
            <li><span className={styles.bulletCheck}><CheckIcon /></span>Персонализирана функционалност</li>
            <li><span className={styles.bulletCheck}><CheckIcon /></span>Собствена база данни и логика</li>
            <li><span className={styles.bulletCheck}><CheckIcon /></span>Работи на телефон и компютър</li>
          </ul>
        </Reveal>

        {/* 4. Дигитализация */}
        <Reveal from="right" delay={0} className={styles.card}>
          <div className={styles.cardHead}>
            <div className={styles.cardIcon}><CpuIcon /></div>
            <div className={styles.cardHeadText}>
              <span className={styles.cardTag}>Бизнес процеси</span>
              <h2 className={styles.cardTitle}>Дигитализация & оптимизация</h2>
            </div>
            <div className={styles.priceChip}>200€ – 700€</div>
          </div>
          <p className={styles.cardDesc}>
            Хартия, Excel файлове, имейли напред-назад. Вземаме вашия работен процес и го превръщаме в система —
            по-бързо, по-малко грешки, по-малко загубено време.
            Не продаваме технология заради технологията, а защото тя ви освобождава.
          </p>
          <ul className={styles.featureList}>
            <li><span className={styles.bulletCheck}><CheckIcon /></span>Анализ на текущия процес</li>
            <li><span className={styles.bulletCheck}><CheckIcon /></span>Автоматизация там, където има смисъл</li>
            <li><span className={styles.bulletCheck}><CheckIcon /></span>Обучение на екипа</li>
          </ul>
        </Reveal>

      </section>

      {/* ══ КАК РАБОТИМ ══ */}
      <section className={styles.process}>
        <Reveal from="up" delay={0}>
          <div className={styles.processBadge}>Прозрачност</div>
        </Reveal>
        <Reveal from="up" delay={100}>
          <h2 className={styles.processTitle}>Как работим</h2>
        </Reveal>
        <Reveal from="up" delay={180}>
          <p className={styles.processSub}>
            Без черни кутии. Знаете какво се случва на всяка стъпка.
          </p>
        </Reveal>
        <div className={styles.steps}>
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.num} from="up" delay={260 + i * 120} className={styles.step}>
              <div className={styles.stepNum}>{step.num}</div>
              {i < PROCESS_STEPS.length - 1 && (
                <div className={styles.stepConnector} aria-hidden="true" />
              )}
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className={styles.cta} id="contact">
        <Reveal from="up" delay={0}>
          <h2 className={styles.ctaTitle}>Готови да започнем?</h2>
        </Reveal>
        <Reveal from="up" delay={100}>
          <p className={styles.ctaSub}>
            Няма нужда от дълги имейли. Кажете ни накратко какво имате предвид
            и ще се чуем в рамките на деня.
          </p>
        </Reveal>
        <Reveal from="up" delay={200}>
          <div className={styles.ctaBtns}>
            <a href="#" className={styles.ctaPrimary}>
              Изпратете запитване <ArrowIcon />
            </a>
            <Link href="/products" className={styles.ctaSecondary}>
              Вижте нашите проекти
            </Link>
          </div>
          <p className={styles.ctaNote}>Консултацията е безплатна. Без ангажимент.</p>
        </Reveal>
      </section>

    </div>
  );
}
