// Publications. /publications shows the papers I led; the résumé lists all.
//
// Metadata rule — keep these three in lockstep everywhere they surface:
//   venue   the canonical venue string, e.g. "ICML 2023", "arXiv 2026"
//   status  'Accepted' | 'Published' | 'Preprint' | 'Workshop'
//   date    YYYY-MM, used for ordering only
export type PubStatus = 'Accepted' | 'Published' | 'Preprint' | 'Workshop';

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
   *  The papers share one question, so the tags are deliberately parallel —
   *  that parallelism is what makes them read as one body of work rather than
   *  unrelated results. */
  angle?: string;
  summary: string;
  url?: string;
  codeUrl?: string;
  /** Kept for the résumé, held back from /publications: co-authored workshop
   *  and conference papers that aren't part of the main research throughline. */
  minor?: boolean;
  featured?: boolean; // full-width feature card
  chips?: string[]; // HTML strings, feature card only
}

export const publications: Pub[] = [
  {
    key: 'suture',
    title: 'Beyond Scalar IoU: Structured Verification from Rollout Groups for Video Temporal Grounding',
    acronym: 'SUTURE',
    authors: '**Youngjae Cho**, Won Young Jhoo, Jongsuk Kim',
    venue: 'arXiv 2026',
    status: 'Preprint',
    venueAlt: true,
    date: '2026-10',
    role: 'First author',
    roleFirst: true,
    angle: 'Verification · video understanding',
    summary:
      'Introduced a group-conditioned verifier with an **exact decomposition into IoU and a covariance correction**; improved temporal grounding at every reported IoU threshold across five benchmarks.',
    url: 'https://arxiv.org/abs/2610.07601',
  },
  {
    key: 'gapo',
    title: 'Learning Where It Matters: Geometric Anchoring for Robust Preference Alignment',
    acronym: 'GAPO',
    authors: '**Youngjae Cho**, Jongsuk Kim, Ji-Hoon Kim',
    venue: 'NeurIPS 2026',
    status: 'Accepted',
    date: '2026-02',
    role: 'First author',
    roleFirst: true,
    featured: true,
    angle: 'Stability · noisy preferences',
    summary:
      'Proposed a batch-conditioned adversarial anchor and **anchor-gap reweighting** for brittle preferences; improved AlpacaEval 2.0 LC win rate by **3.6 percentage points** over SimPO (Mistral-7B).',
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
    angle: 'Adaptation · scarce data',
    summary:
      'Developed Bayesian prompt adaptation with **data-dependent priors** and **Wasserstein gradient flow** for posterior inference, improving few-shot generalization under distribution shift.',
    url: 'https://arxiv.org/abs/2401.06799',
    codeUrl: 'https://github.com/youngjae-cho/APP',
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
    angle: 'Acquisition · scarce labels',
    summary:
      'Co-developed sharpness-aware acquisition through **pseudo-label-based perturbed-loss estimation**, with a theoretical optimization bound; evaluated classification, detection, and domain-adaptive segmentation.',
    url: 'https://proceedings.mlr.press/v202/kim23c.html',
    codeUrl: 'https://github.com/YoonyeongKim/SAAL',
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

// The academic CV leads with the three main-conference papers, then SUTURE.
// Both HTML and PDF consume these arrays; presentation order is independent
// of the preprint's original posting date and does not change its status.
const selectedKeys = ['gapo', 'app', 'saal', 'suture'];
export const selectedPublications = selectedKeys.map((key) => {
  const pub = publications.find((p) => p.key === key);
  if (!pub) throw new Error(`Missing selected publication: ${key}`);
  return pub;
});
export const additionalPublications = publications
  .filter((p) => !selectedKeys.includes(p.key))
  .sort((a, b) => b.date.localeCompare(a.date));
export const academicPublications = [...selectedPublications, ...additionalPublications];

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
    key: 'safediff',
    topic: 'Safe diffusion',
    question: "Keeping a diffusion model from generating what it shouldn't.",
  },
];
