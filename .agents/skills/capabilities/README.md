# Universal Agent Capabilities

Capability layer ini berisi kemampuan teknis yang bisa dipakai oleh semua marketing agent di repo ini. Folder ini sengaja dipisah dari `skills/` agar jumlah 21 marketing agent tetap bersih, sementara kemampuan teknis tetap tersedia sebagai reusable helper.

## Prinsip

- Marketing agents mengambil keputusan marketing.
- Capabilities menjalankan pekerjaan teknis.
- Prefer script, API, CLI, MCP, atau browser automation yang eksplisit.
- Gunakan Computer Use hanya sebagai fallback saat tidak ada API, tidak ada script, atau workflow harus dilakukan melalui UI desktop/browser yang tidak bisa diakses dengan cara lain.
- Semua capability harus menjaga security: jangan meminta credential di prompt, jangan expose secret di frontend, dan jangan menyimpan raw customer-sensitive data tanpa redaksi.

## Capability Inventory

| Capability | Folder | Fungsi |
|---|---|---|
| Browser Automation | `browser-automation` | Navigasi, klik, form, screenshot, dan QA web. |
| Windows Computer Use | `windows-computer-use` | Interaksi UI aplikasi Windows melalui Windows-MCP sebagai fallback dengan bootstrap otomatis dan guardrail ketat. |
| Web Research | `web-research` | Riset web dengan sumber, tanggal, dan ringkasan. |
| Web Scraping | `web-scraping` | Ekstraksi data publik dari halaman web. |
| Video Understanding | `video-understanding` | Analisis video, hook, struktur, scene, CTA, dan pola kreatif. |
| Hermes Tweet X/Twitter | `hermes-tweet` | Riset X/Twitter, social listening, draft, dan publishing support yang approval-gated. |
| Media Generation | `media-generation` | Generate image/video via Google Flow MCP (flow-mcp Imagen 3 & Veo 2/3.1) atau backend proxy API, prompt pack, dan review output. |
| GitHub Repository | `github-repository` | Inspect repo, issue, PR, changelog, dan release. |
| File Operations | `file-operations` | Baca, tulis, cari, validasi, dan reorganisasi file workspace. |
| Document Processing | `document-processing` | DOCX/PDF/Markdown extraction, formatting, dan review. |
| Spreadsheet Operations | `spreadsheet-operations` | CSV/XLSX analysis, formulas, tables, dan charts. |
| Presentation Operations | `presentation-operations` | PPTX/slides creation, review, dan export. |
| Email Operations | `email-operations` | Draft, QA, segmentation notes, dan send-gate untuk email. |
| Scheduling Operations | `scheduling-operations` | Calendar, reminders, campaign cadence, dan scheduling gates. |
| Knowledge Base / RAG | `knowledge-base-rag` | Indexing dokumen, retrieval, citation, dan grounded answers. |
| Project Memory & Learning | `project-memory-learning` | Personalisasi aman dari fakta, preferensi, keputusan, feedback, dan eksperimen yang disetujui. |
| Project Knowledge Graph | `project-knowledge-graph` | Graphify opsional, context graph per project, change impact, dan handoff multi-agent yang terisolasi. |

## Standard Handoff

Marketing agent yang memanggil capability harus memberi task brief:

```text
Capability:
Objective:
Inputs:
Allowed sources/files:
Forbidden data:
Expected output:
Approval needed:
Security notes:
```

## Computer Use Rule

Computer Use boleh dipakai hanya jika:

- User memang meminta operate aplikasi desktop atau browser UI.
- Website tidak punya API/CLI yang memadai.
- Login/session user dibutuhkan dan user sudah mengizinkan.
- Visual inspection tidak bisa diganti oleh script, API, atau browser automation.

Jika Computer Use dipakai, capability wajib mencatat alasan dan batasan tindakan.

Jika Chrome DevTools MCP atau Windows-MCP belum tersedia ketika user meminta capability terkait, jangan berhenti pada jawaban “belum terinstall”. Jalankan `scripts/ensure-mcp-runtime.ps1` untuk bootstrap project-scoped, register konfigurasi stdio yang relevan dari `templates/mcp-servers.windows.json`, lalu verifikasi tool registry. Lihat `docs/mcp-runtime-harness.md`.

## Personalization Rule

Project memory tidak melatih ulang model dan tidak menyimpan seluruh percakapan. Capability hanya menyimpan learning ringkas yang punya sumber, status, dan approval. User harus bisa melihat, memperbaiki, mengekspor, atau menghapus memory tersebut.

## Project Isolation and Multi-Agent Rule

- Banyak agent boleh membaca graph dan handoff yang sama hanya di dalam project aktif yang sama.
- Setiap project memakai identitas, graph, runtime state, dan MCP boundary sendiri.
- Project lain, termasuk project private, tidak boleh ditemukan, di-query, didaftarkan global, atau digabung secara otomatis.
- Cross-project federation harus read-only, minimum-data, memiliki expiry, dan mendapat approval eksplisit yang menyebutkan semua project terkait.
- Graphify output dan `.agent-workspace/` bersifat private runtime data dan tidak boleh dipublikasikan atau dimasukkan ke frontend.
