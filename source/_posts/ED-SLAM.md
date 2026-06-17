---
title: ED-SLAM
abbrlink: 67f0b1ee
date: 2025-09-24 01:28:53
tags:
    - SLAM
    - Computer Vision
    - Event
    - 3DGS
categories:
    - Paper
    - Computer Vision
cover: /images/ED-SLAM/pipeline.png
mathjax: true
toc: true
---

# ED-SLAM

Type: Paper  
Venue: ICRA 2026  
Topic: Event-depth SLAM + Gaussian Splatting

<img src="/images/ED-SLAM/pipeline.png" style="width:100%;margin:auto;display:block"/>

# Motivation

- 3DGS-SLAM can build dense and high-fidelity maps, but most systems still depend heavily on RGB or RGB-D tracking.
- Conventional RGB tracking is fragile under fast motion, motion blur, low light, or textureless scenes.
- Existing event-based GS methods often assume known poses or become unstable when processing long event streams.
- ED-SLAM tries to make event-depth SLAM more practical: no ground-truth camera poses, robust tracking, and 3DGS-based dense mapping.

# Main Idea

ED-SLAM separates the system into two coupled parts:

1. Tracking: convert incoming events into time-surface maps, then estimate pose with depth-aware patch alignment.
2. Mapping: use the estimated continuous trajectory and raw event stream to optimize a 3D Gaussian map.

The key design is that events are not only an auxiliary signal. They are used for both robust front-end tracking and fine-grained mapping.

# Input & Output

## Input

- Time-aligned event stream
- Depth images
- Camera intrinsics

## Output

- 6-DoF camera trajectory
- 3D Gaussian scene representation
- Renderable dense reconstruction

# Pipeline

## Time Surface Map

During tracking, raw events are aggregated into a time-surface map (TSM). Each pixel stores a decayed timestamp of recent events:

$$
T(x,t)=\exp\left(-\frac{t-t_{last}(x)}{\tau}\right)
$$

The intuition is simple: event cameras naturally fire around image edges, so TSM gives a sharp and low-latency edge-like representation. This is much more stable than RGB images when the camera moves quickly or illumination is poor.

## Patch-based Event-Depth Tracking

Instead of aligning the whole image globally, ED-SLAM samples local patches from high-response TSM regions.

For each patch, depth provides the geometry needed for reprojection:

$$
P'_i = KTK^{-1}P_i
$$

Then the warped patch is sampled on the paired TSM by bilinear interpolation:

$$
\hat{t}^{tar}_i=S_{bilinear}(TSM_{src}, P'_i)
$$

The tracking objective is bidirectional: target-to-source and source-to-target are optimized together.

$$
T^*=\arg\min_T \sum_i \|t_i^{tar}-\hat{t}_i^{tar}\|_2^2+
\sum_j \|t_j^{src}-\hat{t}_j^{src}\|_2^2
$$

This bidirectional formulation is important because one-way alignment can be biased by occlusion, missing events, or noisy local regions.

# Mapping

## 3D Gaussian Representation

The scene is represented as a set of 3D Gaussians. Each Gaussian stores:

- mean position
- covariance / scale / rotation
- opacity
- color

Rendering follows the standard differentiable 3DGS rasterization pipeline, so both image-like signals and event signals can provide gradients.

## Continuous Trajectory Model

Events are asynchronous, so a single pose per frame is too coarse. ED-SLAM interpolates camera poses on the SE(3) manifold:

$$
T(t_k)=T_{start}\cdot
\exp\left(\frac{t_k-t_{start}}{t_{end}-t_{start}}
\log(T_{start}^{-1}T_{end})\right)
$$

This allows the system to render brightness changes between close timestamps and compare them with real event measurements.

## Event Loss

The rendered event signal is the log-brightness difference between two rendered frames:

$$
\hat{E}(x)=\log(\hat{I}_{k+\Delta t}(x))-\log(\hat{I}_{k}(x))
$$

The real event signal is accumulated from raw events during the same time interval:

$$
E(x)=C\{e_i(x,t_i,p_i)\}_{t_k<t_i<t_k+\Delta t}
$$

The mapping loss directly compares these two signals:

$$
L_{event}=\|E(x)-\hat{E}(x)\|_2
$$

# Why It Works

- TSM converts sparse asynchronous events into a trackable edge representation.
- Depth makes patch warping geometrically meaningful, avoiding pure 2D photometric matching.
- Bidirectional patch alignment improves robustness under partial visibility and noisy events.
- Continuous trajectory modeling matches the temporal nature of events.
- 3DGS provides a compact and differentiable scene representation for dense mapping.

# Experiments

The paper evaluates ED-SLAM on both synthetic and real-world event datasets.

The main observed improvements are:

- better tracking stability over long trajectories
- lower pose drift than previous event-based SLAM / GS methods
- higher-quality reconstruction under fast motion and difficult lighting

# Takeaways

ED-SLAM is interesting because it does not simply plug events into an RGB-D SLAM system. It builds a dedicated event-depth front end and connects it with 3DGS mapping. For me, the most important part is the patch-based bidirectional tracker: it is small compared with the whole system, but it decides whether the downstream Gaussian map can remain stable.
