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
  /** The supervision failure this paper attacks — the site's research throughline. */
  supervision?: string;
  summary: string;
  url?: string;
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
    supervision: 'Noisy preference labels',
    summary:
      "Replaces DPO's frozen reference with a <b>dynamic adversarial anchor</b> — a worst-case local perturbation of the current policy — and reweights each preference pair by its geometric brittleness. Robust to noisy labels without an explicit noise model.",
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
    supervision: 'Shifting distributions',
    summary:
      'Bayesian, data-dependent priors that let vision-language prompts adapt per input instead of staying fixed — better calibration under distribution shift.',
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
    supervision: 'Scarce labels',
    summary:
      'An acquisition function that bridges sharpness-aware minimization and active learning — selecting the samples that flatten the loss landscape, so a fixed labeling budget buys more robustness.',
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
    supervision: 'Scarce anomalies',
    summary:
      'Diffusion synthesis that disentangles defect from background via masked cross-attention — when real defects are too rare to train on, generate them. The method behind the production system on the product page.',
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
    supervision: 'Spurious correlations',
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
    supervision: 'Unlabeled sequences',
    summary:
      'Deep variational clustering (VaDE) over sequences for credit-card delinquency prediction. IEEE Intl. Conference on Systems, Man, and Cybernetics.',
    url: 'https://ieeexplore.ieee.org/document/9659039',
  },
];
