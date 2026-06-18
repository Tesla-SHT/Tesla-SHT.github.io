---
title: OmniRetarget
abbrlink: 9e6b2c11
date: 2026-06-18 22:42:00
tags:
  - Paper
  - Robotics
  - Humanoid
  - Motion Retargeting
  - Loco-Manipulation
  - Data Generation
categories:
  - Paper
  - Robotics
  - Motion Retargeting
toc: true
cover: /images/OmniRetarget/pipeline.png
---

# OmniRetarget

Type: Paper  
Topic: Interaction-preserving data generation for humanoid whole-body loco-manipulation  
Links: [Project](https://omniretarget.github.io/) / [arXiv](https://arxiv.org/abs/2509.26633) / [Dataset](https://huggingface.co/datasets/omniretarget/OmniRetarget_Dataset)

# One Sentence

OmniRetarget converts human motions into robot trajectories while preserving important contacts and spatial relations with objects, terrain, and the environment.

# What Problem It Solves

Humanoid skill learning often starts from human motion data. But direct retargeting is messy because humans and robots have different bodies.

Common failure cases:

- foot skating
- body or object penetration
- broken hand-object contact
- plausible-looking motion that is useless for robot training

For loco-manipulation, preserving interaction is more important than simply matching joint angles.

# Core Idea

Represent interaction structure explicitly.

Instead of only retargeting body pose, OmniRetarget models the spatial and contact relationships between:

- the agent
- terrain
- manipulated objects
- environment geometry

The paper uses an interaction mesh to preserve these task-relevant relationships while adapting the motion to the humanoid embodiment.

# Pipeline

1. Start from human motion demonstrations.
2. Build an interaction representation between human, object, terrain, and scene.
3. Retarget the motion to the humanoid while enforcing kinematic feasibility.
4. Generate trajectories that can be used as references for RL policy training.
5. Augment one demonstration across different objects, terrains, and configurations.

# Important Innovation

The key innovation is that retargeting is not treated as a body-only pose matching problem.

OmniRetarget says:

> The contact relation is part of the motion.

For humanoid loco-manipulation, this is critical. A pushing, carrying, climbing, or parkour motion is defined not only by limb positions, but also by how the body interacts with the world.

# Why It Matters

High-quality reference data can make RL much simpler.

The paper reports that high-quality retargeted trajectories allow policies to learn long-horizon skills on a Unitree G1 humanoid with a relatively simple reward setup, instead of requiring heavy curricula or many task-specific tricks.

# What To Remember

OmniRetarget is best understood as a data engine.

It is not mainly proposing a new policy architecture. It improves the input side of humanoid learning:

- better references
- fewer physical artifacts
- interaction-aware augmentation
- more useful data for whole-body RL

# Limitation

The method still depends on the quality and coverage of source demonstrations and on how well the interaction representation captures the actual task.

If the demonstration misses an important contact mode, retargeting alone cannot invent the skill.

# Takeaway

OmniRetarget is about preserving what matters during retargeting: contacts, spatial relations, and task interaction. For humanoid learning, this can be more important than matching human pose perfectly.
