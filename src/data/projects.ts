// Case studies, ordered by weight — the systems I own come first. Every case
// reads Problem → My contribution → Result.
// `visual` selects a bespoke diagram in the case's left column ('gap' | 'tree' | none).
//
// `track` splits this list across the two pages the MAGI panel promises:
// /product for things that shipped as products I owned, /engineering for the
// tooling other work runs on. The panel's own sub-lines already draw that line
// — "training · inference · serving" is the RL framework and the serving layer
// — so the split lives in the data rather than as two hand-kept page lists,
// and a card can never end up on both pages or neither.
export type Track = 'product' | 'engineering';
export interface ProjectTag { label: string; win?: boolean; }
export interface Project {
  key: string;
  track: Track;
  tags: ProjectTag[];
  titleHtml: string;
  blurb: string; // one-line, used on the home page
  problemHtml: string;
  /** Scope line: what was mine vs the team's. Keeps credit honest. */
  ownershipHtml?: string;
  resultHtml: string;
  visual?: 'gap' | 'tree';
  micro: string; // body label — 'My contribution' unless there's a reason otherwise
  approachHtml: string[];
  chips: string[];
}

export const projects: Project[] = [
  {
    key: 'autolabel',
    track: 'product',
    tags: [{ label: 'Pyler · Product · Content Safety' }, { label: 'System I own', win: true }],
    titleHtml: `Mining <span class="acro">Decision Trees</span> from VLM Reasoning`,
    blurb: `The auto-labeling system I own at Pyler — mined the implicit labeling decision tree from 299K VLM reasoning traces; macro F1 0.777 → 0.857.`,
    problemHtml: `Content-safety scoring — 5 categories × severity — drifted between labelers. The written guidelines were flat ladder tables, but the decision logic that actually produced a score lived unwritten in each labeler's head, so the same clip scored differently depending on who saw it.`,
    ownershipHtml: `End-to-end ownership: problem framing, the mining pipeline, the tree design, and the prompts now in production.`,
    resultHtml: `Macro <b>F1 0.777 → 0.857</b> (+0.080), and <b>over 4× the labeling throughput</b> of the process it replaced. Every score is auditable now: you can point at the node that fired.`,
    visual: 'tree',
    micro: 'My contribution',
    approachHtml: [
      `<b>The insight.</b> A VLM that <em>explains</em> its score leaks the decision path — mine enough traces and the latent tree is recoverable.`,
      `<b>A pipeline over 299K traces.</b> Group into <span class="m">30 buckets</span> (5 categories × 6 scores), a small LLM extracts the decisive signals, another synthesizes them into a yes/no tree (YAML) injected back into the prompt.`,
      `<b>Engineered the trees.</b> Merged equivalent signals into single axes, pulled exceptions to the front as <span class="m">early gates</span>, and collapsed the fuzzy 2-vs-3 / 4-vs-5 bands into a stable <span class="m">0 / 1 / 3 / 5</span> scale.`,
    ],
    chips: ['Macro F1 +0.080', 'Throughput 4×+', 'Precision +0.103', 'Recall +0.050', '299K traces', 'YAML trees'],
  },
  {
    key: 'hackathon',
    track: 'engineering',
    tags: [
      { label: 'Pyler · NVIDIA Nemotron Hackathon' },
      { label: '★ Winner · Track B', win: true },
    ],
    titleHtml: `Building the <span class="acro">RL Framework</span> a 12B VLM Didn't Have`,
    blurb: `No RL framework could post-train Nemotron-Nano-12B-VL — so I built the RL layer onto Megatron-Bridge and open-sourced it.`,
    problemHtml: `The team entry was a video content-safety VLM on Nemotron-Nano-12B-v2-VL. The blocker wasn't the model or the data — it was the tooling: Nemo-RL had no support for this architecture, so there was no RL post-training path at all.`,
    ownershipHtml: `Team award (Track B, Domain-Specialized Model). Mine within it: the RL framework work, the post-training method, and the preference data design.`,
    resultHtml: `A working RL post-training stack for an architecture that had none — open-sourced as <a href="https://github.com/youngjaecho98/Megatron-Bridge_RL">Megatron-Bridge_RL</a>. The aligned model held temporal IoU <b>0.927</b> while internalizing the guardrails; the team took 1st in Track B.`,
    visual: 'gap',
    micro: 'My contribution',
    approachHtml: [
      `<b>Found the gap in the tooling.</b> Nemo-RL didn't support Nemotron-Nano-v2-VL, so no existing RL framework could post-train the 12B model.`,
      `<b>Built the RL layer onto Megatron-Bridge.</b> Megatron-Bridge handles the model; it had no reinforcement-learning post-training. I added it — rollout, loss, and the training loop — with SimPO as the objective.`,
      `<b>Designed the preference data.</b> Segmented temporal answers (chosen) vs vague global summaries (rejected), to drive guardrail internalization and fine-grained temporal localization at once.`,
    ],
    chips: ['RL framework', 'SimPO', 'Megatron-Bridge', 'Nemotron-Nano-12B-VL', 'Open source'],
  },
  {
    key: 'serving',
    track: 'engineering',
    tags: [{ label: 'Pyler · Serving · Content Safety' }],
    titleHtml: `Config-Driven <span class="acro">Model Serving</span>`,
    blurb: `Rebuilt the serving layer under the moderation stack so putting a new model in front of traffic is a config change.`,
    problemHtml: `A moderation request doesn't hit one model — it walks a chain of them, and each stage's decision logic lived in the serving layer. Swapping in a better model meant another strategy class, another batch path, another set of thresholds. The model was the cheap part.`,
    ownershipHtml: `Mine: the new inference path end to end, and the config and validation layers around it — inside a serving stack the team runs together.`,
    resultHtml: `A model swap is now a checkpoint plus a config edit — the serving code doesn't move, and what a replica is running is queryable.`,
    micro: 'My contribution',
    approachHtml: [
      `<b>Shipped a new inference route end to end.</b> A classification task type through the shared model gateway — <span class="m">schema, strategy, batching, ingress, tracing</span> — so a light classifier could replace a heavier multi-model stage.`,
      `<b>Moved the decision policy out of serving code.</b> A flag on the model config picks the mode; calibrated thresholds ride <em>inside</em> the checkpoint as a <span class="m">policy config</span>. One artifact, several behaviors, no strategy class holding a number.`,
      `<b>Made the config verifiable from outside.</b> Model names are validated as an <span class="m">endpoint contract</span>, and every replica announces its flags at startup — so a toggle's deployed value is a telemetry query, not an inference from a green build.`,
    ],
    chips: ['Ray Serve', 'vLLM', 'HF Transformers', 'OpenTelemetry', 'Config over code', 'Flag telemetry'],
  },
  {
    key: 'defect',
    track: 'product',
    tags: [{ label: 'Aiv · Product · Industrial AD' }, { label: 'Product I own' }],
    titleHtml: `Background-Aware <span class="acro">Defect Synthesis</span>`,
    blurb: `Diffusion defect generator that disentangles defect from background; best FID/LPIPS vs baselines, deployed on a real line.`,
    problemHtml: `Real defects are scarce on a manufacturing line — too few, and too narrow in type, to train a detector that generalizes. So I generate them.`,
    ownershipHtml: `Mine end to end: first author on the method, then the pipeline and rollout that put it on the line — research carried into production, not handed off.`,
    resultHtml: `Best generation quality (FID / LPIPS) over DFMGAN &amp; AnomalyDiffusion on MVTec-AD &amp; LOCO; raised detector precision &amp; recall on the real production line.`,
    micro: 'My contribution',
    approachHtml: [
      `<b>Disentangled defect from background.</b> Diffusion with <span class="m">masked cross-attention</span> and separate defect/background context vectors, trained with a disentanglement loss so a synthetic defect respects its surroundings.`,
      `<b>Controlled placement at inference.</b> <span class="m">DDIM inversion</span> on a normal image, then sample the defect onto a refined mask region.`,
      `<b>Made it affordable on one GPU.</b> <span class="m">Flash-Attention</span> + <span class="m">DeepSpeed</span> + FP16, wrapped in an MLOps pipeline.`,
    ],
    chips: ['PyTorch', 'Diffusers', 'Flash-Attention', 'DeepSpeed', 'FP16'],
  },
  {
    key: 'ocr',
    track: 'product',
    tags: [{ label: 'Aiv · Product · OCR' }, { label: 'Product I own' }],
    titleHtml: `Real-Time <span class="acro">OCR Pipeline</span> for Steel-Plate IDs`,
    blurb: `Two-stage Triton OCR pipeline, profiled and cut to real-time with TensorRT + CUDA graphs.`,
    problemHtml: `Read identifiers stamped on steel plates outdoors — from CCTV and mobile — fast and reliably, under any weather.`,
    ownershipHtml: `Mine end to end: pipeline design, the models, profiling and optimization, and the rollout. A product I owned, not a component I contributed to.`,
    resultHtml: `Client confirmed throughput and recognition accuracy both rose sharply after rollout.`,
    micro: 'My contribution',
    approachHtml: [
      `<b>Two-stage pipeline on NVIDIA Triton.</b> Detection crops the region of interest; a recognition model reads it and matches the DB.`,
      `<b>Profiled, then cut runtime.</b> Triton logs showed model <span class="m">runtime</span> was the bottleneck, not pre/post — so <span class="m">ONNX → TensorRT</span>, warmup, and <span class="m">CUDA graphs</span>.`,
      `<b>Made it weather-proof.</b> <span class="m">Test-time augmentation</span> (rotation, padding) baked into the pipeline.`,
    ],
    chips: ['Triton', 'TensorRT', 'ONNX', 'CUDA Graphs', 'Detection + Recognition'],
  },
];
