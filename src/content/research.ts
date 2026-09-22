import type { Research } from "./schema";

// Source: docs/02-content.md "Research". Figures and sample outputs are future work (D17).

export const research: Research = {
  slug: "image-completion",
  title:
    "Deep Learning-Based Complete Image Prediction from Partial or Occluded Images",
  headline: "The Torn Page",
  type: "Undergraduate thesis",
  defended: 2026,
  supervisor: "Dr. Chowdhury Mofizur Rahman",
  institution: "BRAC University",
  stackLine: "PyTorch",
  skills: ["pytorch"],
  architecture: [
    "Dual-Manifold VQ-VAE",
    "Latent Attention U-Net Mapper",
    "Multi-Scale Detail Injection",
  ],
  metrics: [
    { value: "27.60 dB", label: "PSNR" },
    { value: "0.861", label: "SSIM" },
    { value: "~32 ms", label: "per 256x256 image" },
    { value: "52.7%", label: "cut in mapper validation latent loss" },
    { value: "2nd of 6", label: "on zero-shot average PSNR" },
  ],
  highlights: [
    "Co-developed a **GAN-free, single-pass image completion framework** (**Dual-Manifold VQ-VAE**, **Latent Attention U-Net Mapper** and **Multi-Scale Detail Injection**) reaching **27.60 dB PSNR** and **0.861 SSIM** at roughly **32 ms per 256x256 image**.",
    "Owned **mask generation**, **zero-shot evaluation on four unseen datasets**, **retraining of five baselines under matched conditions**, and the ablations showing a **52.7% cut in mapper validation latent loss**; placed **2nd of 6 on zero-shot average PSNR**.",
  ],
  futureWork: [
    "Real thesis figures and sample input, masked and output images",
    "A link to the paper or report",
    "Possibly an in-browser demo",
  ],
};
