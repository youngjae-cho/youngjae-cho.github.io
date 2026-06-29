// Publications — add an entry here to add a paper. `home: true` surfaces it in
// the "Selected Research" block on the home page; the /publications page lists all.
export interface Pub {
  key: string;
  title: string;
  acronym?: string;
  venue: string;
  venueAlt?: boolean; // muted badge (preprint / workshop / earlier)
  date: string; // YYYY-MM, used for ordering
  role?: string; // "First author" | "Co-first author" | "Author"
  roleFirst?: boolean; // gold highlight on the role tag
  summary: string;
  url?: string;
  featured?: boolean; // full-width feature card
  home?: boolean; // show on home "Selected Research"
  chips?: string[]; // HTML strings, feature card only
}

export const publications: Pub[] = [
  {
    key: 'gapo',
    title: 'Geometric Anchor Preference Optimization',
    acronym: 'GAPO',
    venue: 'arXiv 2026',
    date: '2026-02',
    role: 'First author',
    roleFirst: true,
    featured: true,
    home: true,
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
    title: 'Make Prompts Adaptable',
    acronym: 'APP',
    venue: 'AAAI 2024',
    date: '2024-02',
    role: 'First author',
    roleFirst: true,
    home: true,
    summary:
      'Bayesian, data-dependent priors that let vision-language prompts adapt per input instead of staying fixed — better calibration under distribution shift.',
    url: 'https://arxiv.org/abs/2401.06799',
  },
  {
    key: 'saal',
    title: 'Sharpness-Aware Active Learning',
    acronym: 'SAAL',
    venue: 'ICML 2023',
    date: '2023-07',
    role: 'Co-first author',
    roleFirst: true,
    home: true,
    summary:
      'An acquisition function that bridges sharpness-aware minimization and active learning — selecting samples that flatten the loss landscape.',
    url: 'https://proceedings.mlr.press/v202/kim23c.html',
  },
  {
    key: 'defect',
    title: 'Background-Aware Defect Generation',
    venue: 'Preprint 2024',
    venueAlt: true,
    date: '2024-11',
    role: 'First author',
    roleFirst: true,
    home: true,
    summary:
      'Diffusion synthesis that disentangles defect from background via masked cross-attention — the method behind the production system on the projects page.',
    url: 'https://arxiv.org/abs/2411.16767',
  },
  {
    key: 'group',
    title:
      'Improving Group-based Robustness and Calibration via Ordered Risk and Confidence Regularization',
    venue: 'ICML 2022 Workshop',
    venueAlt: true,
    date: '2022-07',
    role: 'Author',
    summary:
      'Robustness to spurious group correlations via ordered risk and confidence regularization. Workshop on Spurious Correlations, Invariance and Stability (ICML 2022).',
  },
  {
    key: 'vade',
    title: 'Predict Sequential Credit Card Delinquency with VaDE-Seq2Seq',
    venue: 'IEEE SMC 2021',
    venueAlt: true,
    date: '2021-10',
    role: 'Author',
    summary:
      'Deep variational clustering (VaDE) over sequences for credit-card delinquency prediction. IEEE Intl. Conference on Systems, Man, and Cybernetics.',
  },
];
