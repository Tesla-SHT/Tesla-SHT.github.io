---
title: Register Token
tags:
  - Paper
  - Token
  - Transformer
categories:
  - Paper
  - AI
cover: images/Register/1.jpg
abbrlink: a4caa571
date: 2025-08-19 19:41:59
---

# Background
Modern vision transformers (ViTs) have a common problem that their tokens may have artifacts, which can lead to suboptimal performance. 
<img src="/images/Register/1.jpg" style="width:100%;margin:auto;display: block"/>
Only DINO will not have artifacts, which can be a comparison for other methods.

# Why and When Artifacts Occur

## Relation with High Norms
The author finds that the artifacts are related to the high norms of tokens.
<img src="/images/Register/norm.png" style="width:50%;margin:auto;display: block"/>

## Appearance in Middle of Training
The high norm of tokens appears in the middle of training
<img src="/images/Register/when.jpg" style="width:100%;margin:auto;display: block"/>

## Information Redundancy
The author finds that the artifacts are caused by information redundancy, which means if the patch is very similar to its neighbors, it is more possible to have artifacts.
<img src="/images/Register/redundancy.jpg" style="width:90%;margin:auto;display: block"/>

# Conclusion
Enough large and well-trained models will learn to recognize redundant tokens and use them to store, process, and extract global information.

So the author proposes Register Token, which is a token that is used to store and process global information.