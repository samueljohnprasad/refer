# Media Generation Capability

## When to Use

Use this capability when a marketing workflow needs AI-assisted image or video generation, visual variation, image-to-image direction, storyboard-to-video prompting, product-shot concepts, or media-generation QA.

This is a technical execution capability, not a marketing agent. Creative strategy remains owned by the relevant specialist agent.

## Preferred Implementation

- **Primary Local Provider (Zero-Cost / High-Fidelity): Google Flow via `flow-mcp`**
  - Uses Google Flow (`flow.google.com`) ditenagai Google Imagen 3 (stills/images) dan Veo 2/3.1 (video).
  - Menggunakan kuota kredit harian bawaan Google (50 kredit gratis/hari, gambar still = 0 kredit).
  - Terkoneksi secara lokal via Model Context Protocol (MCP) melalui Chrome DevTools Protocol (CDP) dengan user profile terisolasi (`~/.flow-mcp/chrome-profile`).
  - **Zero Credential Exposure:** Tidak memerlukan API Key di environment/frontend; autentikasi berbasis sesi browser lokal yang dilakukan manual satu kali oleh user (`npm run login`).
- **Secondary / Headless Provider: Server-Side API Proxy (FLUX.1 / Gemini / fal.ai)**
  - Digunakan jika sistem membutuhkan eksekusi headless di backend server atau otomasi pipeline tanpa browser lokal terbuka.
  - Wajib disimpan di server-side `.env` dan diakses melalui backend proxy, tidak pernah diekspos di frontend client-side.

## Inputs

- Brand brief and visual identity constraints.
- Campaign objective and platform (e.g. TikTok, Instagram Reels, YouTube Shorts, Meta Ads, Landing Page).
- Creative concept, image prompt, video prompt, or storyboard (dari `video-creative-director` atau `growth-creative-agent`).
- Output format, aspect ratio (9:16 untuk Reels/TikTok/Shorts, 16:9 untuk YouTube, 1:1 / 4:5 untuk Feed), duration, and quantity.
- Usage rights, disclosure requirements, and forbidden visual elements.

## Outputs

- Media Generation Brief & Storyboard Plan.
- Provider and model selection (Google Flow Imagen 3 / Veo 2 vs Cloud Proxy).
- Image or video prompt pack (Prompt, negative prompt, aspect ratio, camera motion).
- Generated Media Assets:
  - Stills / Storyboard Images (disimpan di local output folder).
  - Video Clips (.mp4) siap rakit.
- Output review notes for brand fit, claims, rights, synthetic-media disclosure, and platform readiness.

## Google Flow MCP (`flow-mcp`) Tool Mapping

| Tool | Kapan Digunakan |
|---|---|
| `flow_status` | Cek status sesi Google Flow, sisa kredit harian, dan prompt playbook sebelum memulai. |
| `flow_agent_images` | **Bulk Storyboard / Fast Batch:** Generate hingga 50 gambar still sekaligus dalam ~1 menit (0 kredit, gratis). Ideal untuk validasi visual awal. |
| `flow_generate` | Merender gambar/video dengan parameter presisi (Omni 1.1 Flash, Veo 3.1 Lite/Fast/Quality, aspect ratio, camera movement). |
| `flow_wait` | Menunggu proses render selesai dan mengambil path file hasil download. |
| `flow_continue` | **Seamless Cut:** Melanjutkan adegan video dari frame terakhir klip sebelumnya agar tidak ada lompatan visual karakter. |
| `flow_edit` | Merestyling atau relighting klip yang sudah ada di proyek. |
| `flow_assets` & `flow_download` | Memeriksa media yang sudah selesai di-render di dalam proyek dan mengunduh resolusi penuh. |

## fal.ai / Cloud API Integration Notes

- fal.ai dan cloud API lainnya hanya digunakan sebagai opsi sekunder jika runtime headless membutuhkan integrasi cloud.
- Simpan `FAL_KEY` atau API keys hanya di server environment (`.env`).
- Dilarang keras menaruh API keys di kode frontend, `VITE_*`, `NEXT_PUBLIC_*`, browser JavaScript, HTML statis, dokumen publik, log, atau prompt.
- Untuk aplikasi web client-side, rute panggilan wajib melewati backend proxy (`/api/generate-media`).

## Handoff Guidance

- `video-creative-director` merancang skrip adegan, storyboard shot-by-shot, camera angle, dan memanggil `flow_agent_images` atau `flow_generate`.
- `growth-creative-agent` merancang visual hooks, variasi materi iklan (A/B testing creative), dan prompt gambar produk.
- `brand-strategist` memastikan konsistensi warna, tone, dan identitas visual brand.
- `ethics-compliance-reviewer` mereview kepatuhan hak cipta, disclosure AI/synthetic media, serta memastikan tidak ada klaim visual yang menyesatkan.

## Security and Ethics

- Jangan pernah meminta user memasukkan kata sandi Google ke dalam chat atau script.
- Hindari deepfake yang meniru identitas orang nyata tanpa izin, testimonial palsu, atau klaim sebelum-sesudah yang manipulatif.
- Cantumkan label/disclosure "Dibuat dengan bantuan AI" bila diwajibkan oleh platform (seperti TikTok, YouTube, Meta).

