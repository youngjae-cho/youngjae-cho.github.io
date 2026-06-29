// CV content — drives the /cv page. Mirrors the structured résumé.
export const basics = {
  name: 'Youngjae Cho',
  label: 'ML Research Engineer',
  location: 'Seoul, South Korea',
  email: 'leon5760@gmail.com',
  summary:
    'ML Research Scientist working on trustworthy & robust learning — alignment, robustness, and optimization geometry — and the production pipelines that put it to work.',
  pdf: '/youngjae-cho-cv.pdf', // place the PDF in /public to enable the download button
};

export interface Job {
  org: string;
  role: string;
  note?: string;
  start: string;
  end: string;
  highlights: string[];
}

export const work: Job[] = [
  {
    org: 'Pyler',
    role: 'ML Research Scientist',
    note: 'alternative military service',
    start: '2025.10',
    end: 'present',
    highlights: [
      'Winner — NVIDIA Nemotron Hackathon, Track B (Domain-Specialized Model), 2026',
      'Implemented SimPO (reference-free RLHF) on Megatron-Bridge for Nemotron-Nano-12B-VL — post-training the framework did not support',
      'First-author alignment research (GAPO) — geometry-aware preference optimization for LLMs',
      'Unified LLM benchmarking CLI + pluggable engine abstraction (vLLM / Hugging Face / synthetic CI fallback)',
    ],
  },
  {
    org: 'Aiv Co.',
    role: 'ML Research Scientist',
    start: '2024.03',
    end: '2025.10',
    highlights: [
      'Diffusion-based defect synthesis pipeline for industrial anomaly detection (background-aware disentanglement)',
      'Made diffusion finetuning + inference fit a single-GPU budget with Flash-Attention + DeepSpeed (FP16)',
      'End-to-end OCR serving on Triton — ONNX→TensorRT, CUDA graphs, and test-time augmentation',
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
    detail: 'ICML 2023 (SAAL) and AAAI 2024 (APP). Active learning, sharpness-aware optimization, Bayesian prompt adaptation.',
  },
  {
    org: 'KAIST',
    degree: 'B.S., Industrial & Systems Engineering',
    start: '2017.03',
    end: '2022.02',
  },
];

export interface SkillGroup { name: string; items: string[]; }

export const skills: SkillGroup[] = [
  { name: 'Research & Modeling', items: ['PyTorch', 'TensorFlow', 'JAX', 'Hugging Face'] },
  { name: 'Optimization & Inference', items: ['TensorRT', 'ONNX', 'Flash Attention', 'DeepSpeed', 'CUDA Graph'] },
  { name: 'Serving', items: ['Triton Inference Server', 'vLLM', 'Docker'] },
  { name: 'Domains', items: ['LLM Alignment', 'Vision-Language', 'Active Learning', 'Diffusion / Anomaly Detection'] },
];
