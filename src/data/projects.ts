// Engineering & production case studies. `visual` selects a bespoke diagram
// rendered in the case's left column ('gap' | 'tree' | none).
export interface ProjectTag { label: string; win?: boolean; }
export interface Project {
  key: string;
  tags: ProjectTag[];
  titleHtml: string;
  blurb: string; // one-line, used on the home page
  problemHtml: string;
  resultHtml: string;
  visual?: 'gap' | 'tree';
  micro: string; // body label, e.g. "My contribution" / "How I built it"
  approachHtml: string[];
  chips: string[];
}

export const projects: Project[] = [
  {
    key: 'hackathon',
    tags: [
      { label: 'Pyler · NVIDIA Nemotron Hackathon' },
      { label: '★ Winner · Track B', win: true },
    ],
    titleHtml: `<span class="acro">SimPO</span> on Megatron-Bridge — for a model it didn't support`,
    blurb: `Implemented reference-free RLHF (SimPO) for a 12B video-language model the framework couldn't post-train — team won Track B.`,
    problemHtml: `Our team's winning entry was a video content-safety VLM on Nemotron-Nano-12B-v2-VL. My piece — the preference-optimization post-training — had no support in the RL tooling.`,
    resultHtml: `Team took 1st in Track B; the RL-aligned model held temporal IoU <b>0.927</b> while internalizing the guardrails — open-sourced as <a href="https://github.com/youngjaecho98/Megatron-Bridge_RL">Megatron-Bridge_RL</a>.`,
    visual: 'gap',
    micro: 'My contribution',
    approachHtml: [
      `<b>Found the gap.</b> Nemo-RL didn't support Nemotron-Nano-v2-VL — no path to preference-optimize the 12B model.`,
      `<b>Implemented SimPO on Megatron-Bridge from scratch</b> — reference-free RL post-training the framework didn't have.`,
      `<b>Designed the preference data</b> — segmented temporal answers (chosen) vs vague global summaries (rejected), to drive guardrail internalization and fine-grained temporal localization.`,
    ],
    chips: ['RLHF', 'SimPO', 'Megatron-Bridge', 'Nemotron-Nano-12B-VL', 'vLLM'],
  },
  {
    key: 'autolabel',
    tags: [{ label: 'Pyler · LLM · Content Safety' }],
    titleHtml: `Mining <span class="acro">Decision Trees</span> from VLM Reasoning`,
    blurb: `Reverse-engineered the implicit labeling decision tree from 299K VLM reasoning traces.`,
    problemHtml: `Content-safety scoring — 5 categories × severity — drifted between labelers: the guidelines were flat ladder tables, but the real decision logic lived unwritten in each labeler's head.`,
    resultHtml: `Tree-structured prompts raised labeling consistency and the downstream classifier — and every score is auditable: you can see which node fired.`,
    visual: 'tree',
    micro: 'How I built it',
    approachHtml: [
      `<b>The insight.</b> A VLM that <em>explains</em> its score leaks the decision path — mine enough traces and the latent tree is recoverable.`,
      `<b>A pipeline over 299K traces.</b> Group into <span class="m">30 buckets</span> (5 categories × 6 scores), a small LLM extracts the decisive signals, another synthesizes them into a yes/no tree (YAML) injected back into the prompt.`,
      `<b>Engineered the trees.</b> Merged equivalent signals into single axes, pulled exceptions to the front as <span class="m">early gates</span>, and collapsed the fuzzy 2-vs-3 / 4-vs-5 bands into a stable <span class="m">0 / 1 / 3 / 5</span> scale.`,
    ],
    chips: ['VLM reasoning', 'LLM pipeline', '299K traces', 'Prompt engineering', 'YAML trees'],
  },
  {
    key: 'defect',
    tags: [{ label: 'Aiv · Diffusion · Industrial AD' }],
    titleHtml: `Background-Aware <span class="acro">Defect Synthesis</span>`,
    blurb: `Diffusion defect generator that disentangles defect from background; best FID/LPIPS vs baselines.`,
    problemHtml: `Real defects are scarce on a manufacturing line — too few, and too narrow in type, to train a detector that generalizes. So I generate them.`,
    resultHtml: `Best generation quality (FID / LPIPS) over DFMGAN &amp; AnomalyDiffusion on MVTec-AD &amp; LOCO; raised detector precision &amp; recall on the real line.`,
    micro: 'How I built it',
    approachHtml: [
      `<b>Disentangled defect from background.</b> Diffusion with <span class="m">masked cross-attention</span> and separate defect/background context vectors, trained with a disentanglement loss so a synthetic defect respects its surroundings.`,
      `<b>Controlled placement at inference.</b> <span class="m">DDIM inversion</span> on a normal image, then sample the defect onto a refined mask region.`,
      `<b>Made it affordable on one GPU.</b> <span class="m">Flash-Attention</span> + <span class="m">DeepSpeed</span> + FP16, wrapped in an MLOps pipeline.`,
    ],
    chips: ['PyTorch', 'Diffusers', 'Flash-Attention', 'DeepSpeed', 'FP16'],
  },
  {
    key: 'ocr',
    tags: [{ label: 'Aiv · Serving · OCR' }],
    titleHtml: `Real-Time <span class="acro">OCR Pipeline</span> for Steel-Plate IDs`,
    blurb: `Two-stage Triton OCR pipeline, optimized to real-time with TensorRT + CUDA graphs.`,
    problemHtml: `Read identifiers stamped on steel plates outdoors — from CCTV and mobile — fast and reliably, under any weather.`,
    resultHtml: `Client confirmed throughput and recognition accuracy both rose sharply after rollout.`,
    micro: 'How I built it',
    approachHtml: [
      `<b>Two-stage pipeline on NVIDIA Triton.</b> Detection crops the region of interest; a recognition model reads it and matches the DB.`,
      `<b>Profiled, then cut runtime.</b> Triton logs showed model <span class="m">runtime</span> was the bottleneck, not pre/post — so <span class="m">ONNX → TensorRT</span>, warmup, and <span class="m">CUDA graphs</span>.`,
      `<b>Made it weather-proof.</b> <span class="m">Test-time augmentation</span> (rotation, padding) baked into the pipeline.`,
    ],
    chips: ['Triton', 'TensorRT', 'ONNX', 'CUDA Graphs', 'Detection + Recognition'],
  },
];
