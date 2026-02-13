---
description: Interviews the user and generates a design doc
---

# Goal

Interview the user section by section to collaboratively produce a design document, then write it to the `design-docs/` folder.
Adapt the interview process to the complexity of the feature.

# Output File

- Directory: `design-docs/`
- Naming: `NNN-short-kebab-title.md` where `NNN` is a zero-padded sequence number (e.g. `001`, `002`).
- To determine the next sequence number, list existing files in `design-docs/` and increment the highest number found. If the folder is empty, start at `001`.

# Interview Process

Walk the user through the design doc **one section at a time**. For each section:

1. Explain what the section is about and what kind of information is needed.
2. Ask the user targeted questions to gather the information.
3. Summarize what you understood and propose draft content for that section.
4. Ask the user to confirm or correct before moving on.

If the user's answer reveals information that belongs to a later section, acknowledge it and let them know you will incorporate it when you get there.

Start by asking the user to describe the feature they want to build in a few sentences. Use that to derive a short kebab-case title for the file name.

## Section Order

Interview in this order:

### 1. Goals

Ask: _What problem are we solving? Why does this feature matter?_

### 2. Non-Goals

Ask: _What is explicitly out of scope? What might people assume is included but is not?_

### 3. Desired Behavior

Ask: _Describe the user-visible behavior. What does the user see, click, or experience? Walk me through the scenarios step by step._
Format the output as a bullet list of concrete, observable behaviors.

### 4. Design

Ask: _How should this be implemented at a high level? What components, services, or data structures are involved?_

#### 4a. Diagram

Produce a **Mermaid** `flowchart` diagram showing the key components and their interactions (inputs, outputs, method signatures).
Show the diagram to the user and ask for corrections.

##### Legend

- Square corners are Angular components
- Round corners are Angular services
- Text in arrows like `methodName({param1: Type1, param2: Type2}): ReturnType` are method signatures
- Text in square brackets like `[input1: Type1, input2: Type2]` are Angular inputs
- Text in round brackets like `(output1: Type1, output2: Type2)` are Angular outputs
- Use `<br>` as needed in arrow labels to make sure labels are not truncated.

#### 4b. Implementation Details

Ask: _Any additional implementation notes — algorithms, edge cases, conventions to follow?_
Leave this section empty if there is nothing to add.

### 5. Testing Strategy

Ask: _For each component or unit from the design, what are the important behaviors to test?_
Format as the user described in the design, grouped by component/unit with concrete test scenarios.
Each test scenario should include:

- a descriptive name
- step-by-step instructions (arrange, act, assert)

### 6. PR Plan

Based on everything gathered so far, propose an ordered list of **small, incremental PRs** that:

- **never break existing behavior**
- are each **independently reviewable and mergeable**
- avoid review fatigue (keep diffs focused)

Apply these decomposition rules:

- **Scaffolding PR**: If many new files must be generated (components, services, etc.), put the WIP scaffolding in its own PR.
- **Pre-tidy-up PR**: If an existing interface (method signature, API, type) must change, first introduce a backward-compatible change (add optional params, deprecate old signature, etc.) in a dedicated refactoring PR _before_ the feature PR that relies on it.
- **Feature PRs**: Each PR adds one slice of user-visible or testable functionality.

Include a **Mermaid** `flowchart` showing PR dependencies (which PRs must land before others).
Then list each PR with a short description of what it contains.

Present the plan to the user and ask for feedback.

### 7. Alternatives Considered

Ask: _Did we consider any other approaches? Why were they rejected?_

### 8. Kitchen Sink

Ask: _Anything else worth noting — open questions, risks, future ideas?_
Leave this section empty if there is nothing to add.

# Final Step

Once all sections are confirmed, assemble the full design doc using the template below and write it to the output file. Show the user the file path.

# Template

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
````

## Implementation Details

{implementation_details}

# Testing Strategy

{testing_strategy}

# PR Plan

```mermaid
{pr_dependency_diagram}
```

{pr_details}

# Alternatives Considered

{alternatives}

# Kitchen Sink

{kitchen_sink}

```

```
