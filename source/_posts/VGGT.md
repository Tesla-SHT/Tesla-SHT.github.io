---
title: VGGT
abbrlink: 69c95808
date: 2025-08-02 13:30:31
tags:
    - Paper
    - Computer Vision
    - 3D Reconstruction
categories:
    - Paper
    - Computer Vision
cover: /images/VGGT/image.png
---

# Introduction

- An end-to-end transformer model, conceptually similar to Stable Diffusion or GPT but applied to a different task.  
- It takes a sequence of images as input.  
- It outputs camera poses, depth maps, point maps, and tracking information.  
- It can process hundreds of images within one second.  
- It infers the complete set of 3D attributes without requiring post-optimization.

<img src="/images/VGGT/image.png" style="width:100%;margin:auto;display: block"/>

# Background

1. Traditional 3D reconstruction utilize visual-geometry methods (BA)
    
    BA (Bundle Adjustment) is a mathematical optimization technique  to refine the 3D structure and camera positions by minimizing reprojection errors across multiple views. 最小化重投影误差[LM算法使得观测的图像点坐标与预测的图像点坐标之间的误差最小](https://blog.csdn.net/jinshengtao/article/details/53365061)
    
2. Machine learning method: address tasks like feature matching and monocular depth prediction
3. VGGsfm: integrate the deep learning model into the SfM(structure from motion) to achieve end-to-end
4. VGGT: predicts a full set of 3D attributes, including camera parameters, depth maps, point maps, and 3D point tracks.

Tracking Any Point: track the POI in the video sequence

# Model Architecture

## Aggregator

The model first processes input images using an aggregator.

- DINO: Used for image patchification to get local tokens ($t_I$).  
- Augmentation tokens:  
  - A camera token ($t_g$) is added.  
  - A register token ($t_R$) is added.  
- Concat: The tokens are concatenated, and positional embeddings are added.

## Alternating Attention

The token sequence is processed through L layers of alternating attention blocks.

* **Global Attention:** Attention is computed across tokens from all frames. Tensor shape: \[B, N\*P, C\].  
* **Frame Attention:** Attention is computed among tokens within each individual frame. Tensor shape: \[B\*N, P, C\].

The initial camera token ($t\_{1g}$) and register token (t\_1R) are learnable, allowing the model to set the first frame as the coordinate system. The register token (t\_R) is discarded during the prediction phase.

## **Prediction Heads**

After the attention blocks, the tokens are passed to different prediction heads to generate the final outputs.

* **Camera Head:**  
  * Uses the camera token (t\_ig).  
  * Predicts the camera parameters (g) using self-attention and a linear layer.  
* **DPT Head:**  
  * Uses the image tokens (t\_iI).  
  * Employs a DPT (Dense Prediction Transformer) to get feature maps F\_i (with shape CxHxW).  
  * A 3x3 convolution predicts the depth map (D\_i), point map (P\_i), tracking features (T\_i), and a confidence map.  
* **Track Head:**  
  * For a given query point (y\_j) in a query image (I\_q).  
  * It performs a bilinear sample on the feature map (T\_q) to get the feature (f\_y).  
  * This feature is correlated with other feature maps (T\_i) to get correlation maps.  
  * These maps are fed into a self-attention layer to predict the corresponding 2D points (y\_i).

# **Training**

The model is trained with a composite loss function. The camera loss uses the Huber Loss function.

- Total Loss:  
  
  $$L=L_{camera}+L_{depth}+L_{pmap}+\lambda L_{track}$$

- Camera Loss:  
  $$L_{camera} = \sum_{i=1}^{N} \left\| \hat{g}_{i} - g_{i} \right\|_{c}$$
- Depth Loss:  
  $$L_{depth} = \sum_{i=1}^{N} \left| \sum_{ip} \odot (\hat{D}_{i} - D_{i}) \right| + \left| \sum_{ip} \odot (\nabla \hat{D}_{i} - \nabla D_{i}) \right| - \alpha \log \sum_{ip}$$ 
- Point Map Loss:  
  $$L_{pmap} = \sum_{i=1}^{N} \left| \sum_{ip} \odot (\hat{P}_{i} - P_{i}) \right| + \left| \sum_{ip} \odot (\nabla \hat{P}_{i} - \nabla P_{i}) \right| - \alpha \log \sum_{ip}$$
- Track Loss:  
  $$L_{track} = \sum_{j=1}^{M} \sum_{i=1}^{N} \left| y_{j,i} - \hat{y}_{j,i} \right|$$

# **Limitations**

* Does not support fisheye or panoramic images.  
* Reconstruction quality is low when input images have extreme rotations.  
* Inference memory usage increases rapidly as the number of input images grows.