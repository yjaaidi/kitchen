---
name: charted-design
description: Interviews the user section by section to collaboratively produce design documents. Use when creating a design doc, starting feature design, or when the user invokes the design command.
---

# Collaborative Design Document

## Goal

Interview the user section by section to produce a design document. Use AskUserQuestion tool if available.
IMPORTANT: Write the current state to `design-docs/` after each section.
The design doc file on disk is the primary deliverable.
Adapt the interview to feature complexity.

## Writing Style

Apply these rules to the **design doc output only** (not to this skill file):

- Prefer short bullet sentences over paragraphs.
- One idea per bullet; keep lines roughly screen-width (~150 chars).
- Use this style when proposing draft content during the interview and in the final assembled doc.

## Output File

- **Path**: `design-docs/`
- **Name**: `NNN-short-kebab-title.md` — `NNN` is zero-padded (e.g. `001`, `002`)
- **Sequence**: List files in `design-docs/`, take highest number, increment. Empty folder → start at `001`
- **Title**: Derive short kebab-case title from the feature description (ask user first)

## Interview Process

For **each section**:

1. Explain the section and what information is needed
2. Ask targeted questions to gather it
3. **Write the draft section to the design doc file immediately** — update the file on disk, not just chat
4. Tell the user the file path and which section was updated; ask them to review/edit the file and confirm or correct before moving on

If the user answers something that belongs to a later section, acknowledge it and say you'll add it when you reach that section.

## Section Order and Prompts

### 1. Goals

State **why** this work matters — user pain, business outcome, or opportunity. Focus on purpose, not the fix.

Ask: _Who has this problem? What pain or need do they have? Why does solving it matter now?_

**Write goals as outcomes and needs, not features or implementation:**

- Good: "Users lose time hunting through a large recipe catalog when planning meals."
- Bad: "Add a search input that filters recipes as the user types."

If the user describes a solution, reframe it into the underlying need before writing the section. Save features, UX, and technical approach for Desired Behavior and Design.

### 2. Non-Goals

Ask: _What is explicitly out of scope? What might people assume is included but is not?_

### 3. Desired Behavior

Ask: _Describe the user-visible behavior. What does the user see, click, or experience? Walk through the scenarios step by step._

Format each behavior as a checkbox:

```markdown
- [ ] User sees a search input and a list of rules below it.
- [ ] Typing in the search input filters the visible rules by name.
```

### 4. Design

Ask: _How should this be implemented at a high level? What components, services, or data structures are involved?_

#### 4a. Diagram

Produce a Mermaid `flowchart` of key components and interactions.

**Legend**:

- Square corners = Angular/React/Vue components or backend HTTP Controllers
- Round corners = Services
- Arrows: `methodName({param1: Type1}): ReturnType`
- `[input1: Type1]` = Angular/React/Vue inputs/props or backend request/event parameters
- `(output1: Type1)` = Angular/React/Vue outputs/callbacks or backend response/events
- Use `<br>` in labels to avoid truncation

Write the diagram to the design doc file and ask the user to review it there.

#### 4b. Implementation Details

Ask: _Any algorithms, edge cases, or conventions?_ Leave empty if nothing to add.

Format each item as a checkbox. Do **not** add PR numbers yet — that happens after the PR Plan (see PR Linking below).

```markdown
- [ ] Add CartRepository interface with getItems().
- [ ] Cart component reads items via inject(CartRepository).
```

### 5. Testing Strategy

Ask: _For each component or unit from the design, what behaviors are important to test?_

Format: grouped by component (`##`), each test scenario as a `###` heading with plain bullet steps underneath. Do **not** add checkboxes or PR numbers to headings yet — that happens after the PR Plan (see PR Linking below).

**Example**:

```markdown
## Cart component

### Displays cart items

- Arrange fake cart repository to return 3 items: keyboard, mouse, monitor.
- Mount `Cart` component.
- Assert 3 items displayed with labels: "Keyboard", "Mouse", "Monitor".
```

### 6. PR Plan

Propose ordered, small, focused, incremental PRs that:

- Never break existing behavior
- Are independently reviewable and mergeable
- Keep diffs focused

**Rules**:

- **Scaffolding PR**: If many new files, put WIP scaffolding in its own PR
- **Tidy-first PR**: If interfaces must change, do backward-compatible changes first (optional params, deprecations)
- **Feature PRs**: Each adds one slice of user-visible or testable functionality

Include a Mermaid `flowchart` of PR dependencies. List each PR as a checkbox:

```markdown
- [ ] PR#1 — Scaffold Cart component, repository interface, and test files.
- [ ] PR#2 — Display cart items from repository.
```

Write the PR Plan to the design doc file and ask the user to review it there.

### 7. PR Linking

After the user confirms the PR Plan:

1. For each PR in the confirmed checkbox list, add a `<details>` block under PR Plan with a `<summary>` title.
2. Inside each block, add **Tasks** and **Testing Strategy** sections.
3. Assign each Implementation Details task to the PR it belongs to.
4. Assign each test scenario from the top-level Testing Strategy to the PR it belongs to.
5. Verify nothing from Implementation Details or the top-level Testing Strategy was left unassigned.
6. Remove the now-empty Implementation Details and top-level Testing Strategy sections.
7. Remove the checkbox list from PR Plan; keep the dependency diagram.

### 8. Alternatives Considered

Ask: _Did we consider other approaches? Why were they rejected?_

### 9. Kitchen Sink

Ask: _Anything else — open questions, risks, future ideas?_ Leave empty if nothing.

## Final Step

Ensure all sections are present in the file, apply PR Linking if not done yet, and show the user the final path. The doc should already exist on disk — this step is verification and cleanup, not first-time assembly.

## Template

````markdown
# Goals

{goals}

# Non-Goals

{non_goals}

# Desired Behavior

{desired_behavior}

# Design

{design}

## Diagram

```mermaid
{diagram}
```

## Implementation Details

{implementation_details}

# Testing Strategy

{testing_strategy}

# PR Plan

```mermaid
{pr_dependency_diagram}
```

{pr_details}

<details>
<summary>🚧 PR#N — {pr_title}</summary>

## Tasks

- [ ] {task_description}
- [ ] {task_description}

## Testing Strategy

### 🚧 {test_title}

- {step_1}
- {step_2}

</details>

# Alternatives Considered

{alternatives}

# Kitchen Sink

{kitchen_sink}
````

## Additional Resources

- For a complete example, see [resources/example-design-doc.md](resources/example-design-doc.md)
