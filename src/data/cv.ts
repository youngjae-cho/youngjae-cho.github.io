// CV content — drives /resume and the home page timeline.
// Use "ML Research Engineer" consistently for identity and company roles.
export const basics = {
  name: 'Youngjae Cho',
  label: 'ML Research Engineer',
  location: 'Seoul, South Korea',
  email: 'leon5760@gmail.com',
  // The canonical one-liner — method → production, in a single breath.
  // Mirrored (with markup) as the hero thesis in src/components/Hero.astro;
  // change both together.
  summary:
    'I design learning methods for noisy, scarce, and shifting supervision — and ship them to production.',
  // Longer form, for the resume header.
  summaryLong:
    'ML Research Engineer working on robust learning under imperfect supervision — seven papers, five first- or co-first-author, including GAPO accepted to NeurIPS 2026, work published at ICML 2023 and AAAI 2024, and SUTURE on video temporal grounding. Currently on RL post-training for MLLMs at Pyler, alongside the LLM/VLM auto-labeling system I own there.',
  researchInterests: 'I study robust and data-efficient learning from imperfect supervision: preference optimization, active learning, Bayesian adaptation, and reinforcement learning.',
  resume: '/resume',
  links: {
    github: 'https://github.com/youngjae-cho',
    linkedin: 'https://www.linkedin.com/in/offonoff/',
    scholar: 'https://scholar.google.com/citations?user=nAER4OcAAAAJ',
  },
};

export interface Job {
  org: string;
  role: string;
  note?: string;
  start: string;
  end: string;
  /** Ordered by weight, not chronology: ownership → research → award → infra. */
  highlights: string[];
  researchHighlights?: string[];
}

export const work: Job[] = [
  {
    org: 'Pyler',
    role: 'ML Research Engineer',
    note: 'alternative military service',
    start: '2025.10',
    end: 'present',
    researchHighlights: [
      '**Preference learning.** First-author GAPO research on local margin degradation under parameter perturbations; evaluated robustness to random and structured preference noise.',
      '**Structured verification.** First-author SUTURE research on group-conditioned rewards; analyzed verifier structure and trained temporal-grounding policies with GRPO.',
      '**Multimodal post-training.** Implemented rollout, preference loss, and training loop on Megatron-Bridge for Nemotron-Nano-12B-VL; designed SimPO preference data for video localization and content safety.',
      '**Auditable supervision.** Recovered decision trees from 299K reasoning traces; improved content-safety macro F1 from **0.777 to 0.857**.',
    ],
    highlights: [
      'Own the LLM/VLM auto-labeling system for content-safety scoring (5 categories × severity): mined the implicit decision tree from 299K VLM reasoning traces and turned it into auditable, tree-structured prompts — macro F1 0.777 → 0.857 (precision +0.103, recall +0.050) and over 4× the labeling throughput of the process it replaced, retiring logic that lived unwritten in each labeler\'s head',
      'First-author alignment research (GAPO, accepted to NeurIPS 2026) — geometric anchoring that stabilizes preference optimization under noisy labels, +3.6pp AlpacaEval 2.0 LC over SimPO',
      'Winner — NVIDIA Nemotron Hackathon, Track B (Domain-Specialized Model), 2026: built the RL post-training framework for Nemotron-Nano-12B-VL, an architecture no existing RL framework supported — added the RL layer (rollout, loss, training loop) onto Megatron-Bridge with SimPO as the objective, and open-sourced it',
      'Redesigned the serving layer of the production content-moderation stack so a model swap is a config change rather than a serving-code rewrite — shipped a new inference task type end to end on Ray Serve (schema, strategy, batching, HTTP ingress, tracing), moved calibrated decision thresholds into the checkpoint artifact, and made deployed feature flags verifiable from telemetry',
      'Built the LLM benchmarking CLI and pluggable engine abstraction (vLLM / Hugging Face / synthetic CI fallback) the team evaluates on',
    ],
  },
  {
    org: 'Aiv Co.',
    role: 'ML Research Engineer',
    note: 'alternative military service',
    start: '2024.03',
    end: '2025.10',
    researchHighlights: [
      '**Generative modeling.** Led background-aware diffusion research for scarce industrial anomalies; evaluated defect synthesis on MVTec-AD and LOCO and deployed it to improve production detector precision and recall.',
    ],
    highlights: [
      'Diffusion-based defect synthesis for industrial anomaly detection — background-aware disentanglement; best FID/LPIPS over DFMGAN and AnomalyDiffusion on MVTec-AD and LOCO, and higher detector precision/recall on the production line',
      'Shipped real-time OCR for steel-plate IDs on NVIDIA Triton — ONNX→TensorRT, CUDA graphs, and test-time augmentation for outdoor CCTV conditions',
      'Made diffusion finetuning and inference fit a single-GPU budget with Flash-Attention + DeepSpeed (FP16)',
    ],
  },
];

export interface Edu {
  org: string;
  degree: string;
  note?: string;
  start: string;
  end: string;
  detail?: string;
}

export const education: Edu[] = [
  {
    org: 'KAIST',
    degree: 'M.S., Industrial & Systems Engineering',
    note: 'advised by Il-Chul Moon',
    start: '2022.03',
    end: '2024.02',
    detail: 'First-author work at ICML 2023 (SAAL) and AAAI 2024 (APP) — active learning under scarce labels, and Bayesian prompt adaptation under distribution shift.',
  },
  {
    org: 'KAIST',
    degree: 'B.S., Industrial & Systems Engineering',
    start: '2017.03',
    end: '2022.02',
  },
];

export interface SkillGroup { name: string; items: string[]; }

export const researchExperience: Job[] = [
  ...work.map((job) => ({ ...job, highlights: job.researchHighlights ?? job.highlights })),
  {
    org: 'KAIST',
    role: 'Graduate Research',
    start: education[0].start,
    end: education[0].end,
    highlights: [
      '**Statistical learning.** First-author APP and co-first-author SAAL research combining Bayesian inference, optimization, and active learning; evaluated adaptation under distribution shift and acquisition across classification, detection, and segmentation.',
    ],
  },
];

export const skills: SkillGroup[] = [
  { name: 'Research & Modeling', items: ['PyTorch', 'Hugging Face', 'TensorFlow', 'JAX'] },
  { name: 'Post-training & Alignment', items: ['SimPO / DPO', 'RL frameworks (Megatron-Bridge, Nemo-RL)', 'Preference data design'] },
  { name: 'Optimization & Serving', items: ['TensorRT', 'ONNX', 'Triton Inference Server', 'Ray Serve', 'vLLM', 'Flash Attention', 'DeepSpeed', 'CUDA Graphs', 'OpenTelemetry'] },
  { name: 'Domains', items: ['Robust learning under noisy supervision', 'LLM/VLM auto-labeling', 'Vision-Language', 'Active learning', 'Diffusion / anomaly detection'] },
];

export interface Award { name: string; detail: string; date: string; }

export interface Service { venue: string; role: string; date: string; }

export const academicService: Service[] = [
  { venue: 'ICML', role: 'Gold Reviewer', date: '2026' },
  { venue: 'NeurIPS', role: 'Top Reviewer', date: '2026' },
];

export const awards: Award[] = [
  {
    name: 'NVIDIA Nemotron Hackathon — Winner, Track B',
    detail: 'Team winner in Track B (Domain-Specialized Model). Implemented the preference-optimization post-training (SimPO on Megatron-Bridge) behind the team\'s winning video content-safety VLM.',
    date: '2026',
  },
];
