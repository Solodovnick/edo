---
name: development-technical
description: >-
  Guides software engineering tasks — implementation, refactors, tests, CI,
  tooling, and MCP integrations. Use when the user writes code, debugs,
  configures build pipelines, or automates workflows with scripts or agents.
---

# Development & technical

## When this skill applies

Use for tasks aligned with the **Development & Technical** category in [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills).

## Instructions

1. Read surrounding code before changing it; match naming, types, and import style.
2. Keep diffs focused on the request; avoid unrelated refactors and drive-by cleanup.
3. Run linters/tests when available; fix failures you introduce.
4. For MCP or external tools: read tool schemas before calling; handle errors with a clear next step.
5. Prefer small, reviewable changes with complete sentences in commit messages when the user asks for git help.

## Reference

See the Anthropic skills repo for extended examples (testing web apps, MCP server generation, etc.).
