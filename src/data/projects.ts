// Engineering & production case studies, ordered by weight — the systems I own
// come first. Every case reads Problem → My contribution → Result.
// `visual` selects a bespoke diagram in the case's left column ('gap' | 'tree' | none).
export interface ProjectTag { label: string; win?: boolean; }
export interface Project {
  key: string;
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
    tags: [{ label: 'Pyler · LLM/VLM · Content Safety' }, { label: 'System I own', win: true }],
    titleHtml: `Mining <span class="acro">Decision Trees</span> from VLM Reasoning`,
    blurb: `The auto-labeling system I own at Pyler — mined the implicit labeling decision tree from 299K VLM reasoning traces; macro F1 0.777 → 0.857.`,
    problemHtml: `Content-safety scoring — 5 categories × severity — drifted between labelers. The written guidelines were flat ladder tables, but the decision logic that actually produced a score lived unwritten in each labeler's head, so the same clip scored differently depending on who saw it.`,
    ownershipHtml: `End-to-end ownership: problem framing, the mining pipeline, the tree design, and the prompts now in production.`,
    resultHtml: `Macro <b>F1 0.777 → 0.857</b> (+0.080) — precision 0.731 → 0.834, recall 0.833 → 0.883. And every score became auditable: you can point at the node that fired.`,
    visual: 'tree',
    micro: 'My contribution',
    approachHtml: [
      `<b>The insight.</b> A VLM that <em>explains</em> its score leaks the decision path — mine enough traces and the latent tree is recoverable.`,
      `<b>A pipeline over 299K traces.</b> Group into <span class="m">30 buckets</span> (5 categories × 6 scores), a small LLM extracts the decisive signals, another synthesizes them into a yes/no tree (YAML) injected back into the prompt.`,
      `<b>Engineered the trees.</b> Merged equivalent signals into single axes, pulled exceptions to the front as <span class="m">early gates</span>, and collapsed the fuzzy 2-vs-3 / 4-vs-5 bands into a stable <span class="m">0 / 1 / 3 / 5</span> scale.`,
    ],
    chips: ['Macro F1 +0.080', 'Precision +0.103', 'Recall +0.050', '299K traces', 'VLM reasoning', 'YAML trees'],
  },
  {
    key: 'hackathon',
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
    tags: [{ label: 'Pyler · Serving · Content Safety' }],
    titleHtml: `Making a Model Swap a <span class="acro">Config Change</span>`,
    blurb: `Rebuilt the serving layer of the production moderation stack so putting a new model in front of traffic is a config change, not a serving-code rewrite.`,
    problemHtml: `A moderation request doesn't hit one model — it walks a chain of them. But each stage's decision logic was written into the serving layer itself, so putting a better model in front of traffic meant editing serving code: another strategy class, another batch path, thresholds compiled into the route. The model was the cheap part.`,
    ownershipHtml: `Mine: the new inference path end to end, and the config and validation layers around it — inside a serving stack the team runs together.`,
    resultHtml: `A model swap is now a checkpoint plus a config edit; the serving code doesn't move. Stages left the hot path, and what a replica is running is queryable rather than assumed.`,
    micro: 'My contribution',
    approachHtml: [
      `<b>Shipped a new inference route end to end.</b> A classification task type through the shared model gateway — <span class="m">request/response schema</span>, strategy protocol, batch adapter, HTTP ingress, tracing — so a light classifier could drop into a stage that had been carrying a much heavier multi-model route.`,
      `<b>Moved the decision policy out of the serving code.</b> Mode selection became a flag on the model config, and calibrated thresholds now ship <em>inside</em> the checkpoint — a <span class="m">policy config</span> riding with the weights, the way generation settings ride with a language model — so one artifact serves several behaviours and no strategy class holds a number.`,
      `<b>Made the configuration externally verifiable.</b> Model names are validated as an <span class="m">endpoint contract</span> — naming lint, closed vocabulary, task binding — so no checkpoint-flavoured string silently mints an endpoint; and each replica announces its flags on startup as a structured event, so "<span class="m">CI green, toggle inert</span>" stops being invisible.`,
    ],
    chips: ['Ray Serve', 'vLLM', 'HF Transformers', 'OpenTelemetry', 'Config-over-code', 'Flag telemetry'],
  },
  {
    key: 'defect',
    tags: [{ label: 'Aiv · Diffusion · Industrial AD' }],
    titleHtml: `Background-Aware <span class="acro">Defect Synthesis</span>`,
    blurb: `Diffusion defect generator that disentangles defect from background; best FID/LPIPS vs baselines, deployed on a real line.`,
    problemHtml: `Real defects are scarce on a manufacturing line — too few, and too narrow in type, to train a detector that generalizes. So I generate them.`,
    ownershipHtml: `First author on the method; built the training and inference pipeline that put it on the line.`,
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
    tags: [{ label: 'Aiv · Serving · OCR' }],
    titleHtml: `Real-Time <span class="acro">OCR Pipeline</span> for Steel-Plate IDs`,
    blurb: `Two-stage Triton OCR pipeline, profiled and cut to real-time with TensorRT + CUDA graphs.`,
    problemHtml: `Read identifiers stamped on steel plates outdoors — from CCTV and mobile — fast and reliably, under any weather.`,
    ownershipHtml: `Owned the serving stack end-to-end: pipeline design, profiling, optimization, rollout.`,
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
