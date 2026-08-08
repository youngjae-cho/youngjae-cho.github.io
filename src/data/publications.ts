// Publications. `home: true` surfaces it in "Selected Research" on the home page;
// /publications lists all.
//
// Metadata rule — keep these three in lockstep everywhere they surface:
//   venue   the canonical venue string, e.g. "ICML 2023", "arXiv 2026"
//   status  'Published' | 'Preprint' | 'Workshop'   (never invent a review status)
//   date    YYYY-MM, used for ordering only
export type PubStatus = 'Published' | 'Preprint' | 'Workshop';

export interface Pub {
  key: string;
  title: string;
  acronym?: string;
  authors: string; // '**' marks Youngjae; '*' marks equal contribution
  venue: string;
  status: PubStatus;
  venueAlt?: boolean; // muted badge (preprint / workshop / earlier)
  date: string; // YYYY-MM, used for ordering
  role?: string; // "First author" | "Co-first author" | "Author"
  roleFirst?: boolean; // gold highlight on the role tag
  /** The lever this paper pulls on data efficiency, as "lever · condition".
   *  Four papers share one question, so the tags are deliberately parallel —
   *  that parallelism is what makes them read as one body of work rather than
   *  four unrelated results. */
  angle?: string;
  summary: string;
  url?: string;
  /** Kept for the résumé, held back from /publications: co-authored workshop
   *  and conference papers that aren't part of the four-paper throughline. */
  minor?: boolean;
  featured?: boolean; // full-width feature card
  home?: boolean; // show on home "Selected Research"
  chips?: string[]; // HTML strings, feature card only
}

export const publications: Pub[] = [
  {
    key: 'gapo',
    title: 'Learning Where It Matters: Geometric Anchoring for Robust Preference Alignment',
    acronym: 'GAPO',
    authors: '**Youngjae Cho**, Jongsuk Kim, Ji-Hoon Kim',
    venue: 'arXiv 2026',
    status: 'Preprint',
    date: '2026-02',
    role: 'First author',
    roleFirst: true,
    featured: true,
    home: true,
    angle: 'Optimization geometry · noisy labels',
    summary:
      "Reads preference optimization as <b>learning dynamics</b>: DPO's frozen reference becomes a geometrically perturbed anchor — a worst-case local perturbation of the current policy — and each pair is reweighted by its geometric brittleness. Stronger under noisy labels and on less data, with no explicit noise model.",
    url: 'https://arxiv.org/abs/2602.04909',
    chips: [
      'AlpacaEval 2.0 LC&nbsp;<b>+3.6pp</b> vs SimPO',
      'beats <b>DPO · SimPO · KTO · ORPO</b>',
    ],
  },
  {
    key: 'app',
    title: 'Make Prompts Adaptable: Bayesian Modeling for Vision-Language Prompt Learning with Data-Dependent Prior',
    acronym: 'APP',
    authors: '**Youngjae Cho**, HeeSun Bae, Seungjae Shin, YeoDong Youn, Weonyoung Joo, Il-Chul Moon',
    venue: 'AAAI 2024',
    status: 'Published',
    date: '2024-02',
    role: 'First author',
    roleFirst: true,
    home: true,
    angle: 'Adaptation · scarce data',
    summary:
      'Bayesian, data-dependent priors that let vision-language prompts adapt per input instead of staying fixed — so a VLM holds up when there is little data to tune on, and stays calibrated when the input shifts.',
    url: 'https://arxiv.org/abs/2401.06799',
  },
  {
    key: 'saal',
    title: 'Sharpness-Aware Active Learning',
    acronym: 'SAAL',
    authors: 'Yoon-Yeong Kim*, **Youngjae Cho***, JoonHo Jang, Byeonghu Na, Yeongmin Kim, Kyungwoo Song, Wanmo Kang, Il-Chul Moon',
    venue: 'ICML 2023',
    status: 'Published',
    date: '2023-07',
    role: 'Co-first author',
    roleFirst: true,
    home: true,
    angle: 'Acquisition · scarce labels',
    summary:
      'An acquisition function that bridges sharpness-aware minimization and active learning — select the samples that flatten the loss landscape, and a fixed labeling budget buys more generalization per label.',
    url: 'https://proceedings.mlr.press/v202/kim23c.html',
  },
  {
    key: 'defect',
    title: 'Background-Aware Defect Generation for Robust Industrial Anomaly Detection',
    authors: '**Youngjae Cho**, Gwangyeol Kim, Sirojbek Safarov, Seongdeok Bang, Jaewoo Park',
    venue: 'arXiv 2024',
    status: 'Preprint',
    venueAlt: true,
    date: '2024-11',
    role: 'First author',
    roleFirst: true,
    home: true,
    angle: 'Synthesis · scarce anomalies',
    summary:
      'When real defects are too rare to train on, generate them — diffusion synthesis that models the relationship between foreground defect and background surface explicitly, and argues the disentanglement theoretically rather than only showing it. The method behind the production system on the product page.',
    url: 'https://arxiv.org/abs/2411.16767',
  },
  {
    key: 'group',
    title:
      'Improving Group-based Robustness and Calibration via Ordered Risk and Confidence Regularization',
    authors: 'Seungjae Shin, Byeonghu Na, HeeSun Bae, JoonHo Jang, Hyemi Kim, Kyungwoo Song, **Youngjae Cho**, Il-Chul Moon',
    venue: 'ICML 2022 Workshop',
    status: 'Workshop',
    venueAlt: true,
    date: '2022-07',
    role: 'Author',
    minor: true,
    summary:
      'Robustness to spurious group correlations via ordered risk and confidence regularization. Workshop on Spurious Correlations, Invariance and Stability (ICML 2022).',
    url: 'https://openreview.net/forum?id=okCTFCRavwh',
  },
  {
    key: 'vade',
    title: 'Predict Sequential Credit Card Delinquency with VaDE-Seq2Seq',
    authors: 'Yeongmin Kim, **Youngjae Cho**, Hanbit Lee, Il-Chul Moon',
    venue: 'IEEE SMC 2021',
    status: 'Published',
    venueAlt: true,
    date: '2021-10',
    role: 'Author',
    minor: true,
    summary:
      'Deep variational clustering (VaDE) over sequences for credit-card delinquency prediction. IEEE Intl. Conference on Systems, Man, and Cybernetics.',
    url: 'https://ieeexplore.ieee.org/document/9659039',
  },
];

/** Work under way with no result to report yet — the topic and the question,
 *  nothing else. The redaction on the page is literal, not a flourish standing
 *  in for text I could have written: there is genuinely nothing publishable to
 *  put there, and a blacked-out block says that more honestly than filler.
 *  When one of these has a result, it becomes a Pub entry above and the row
 *  here goes away. */
export interface Wip {
  key: string;
  topic: string;
  question: string;
}

export const inProgress: Wip[] = [
  {
    key: 'vtg',
    topic: 'Video temporal grounding',
    question: 'Locating the moment inside a long video that a description actually refers to.',
  },
  {
    key: 'safediff',
    topic: 'Safe diffusion',
    question: "Keeping a diffusion model from generating what it shouldn't.",
  },
];
