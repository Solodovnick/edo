---
name: document-skills
description: >-
  Guides structured document work — office formats, extraction, merging, and
  repeatable document workflows. Use when the user mentions PDF, Word/DOCX,
  PowerPoint, Excel/XLSX, forms, templates, or batch document processing.
---

# Document skills

## When this skill applies

Anthropic publishes reference implementations for document pipelines in [anthropics/skills](https://github.com/anthropics/skills) under `skills/docx`, `skills/pdf`, `skills/pptx`, and `skills/xlsx` (see repository README for licensing notes).

## Instructions

1. Clarify the desired output format, constraints (fonts, page size), and whether content is sensitive before processing files.
2. For binary formats, prefer established libraries and validate outputs (open file, spot-check structure).
3. When the user needs behavior that matches Claude’s built-in document features, treat the upstream skill folders as the canonical pattern reference — adapt to this project’s stack and dependencies.
4. Large files: consider streaming/chunking and memory limits in the runtime environment.

## Reference

- Repository: [github.com/anthropics/skills](https://github.com/anthropics/skills)
- Agent Skills spec: [agentskills.io](https://agentskills.io)
