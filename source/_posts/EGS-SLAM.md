---
title: EGS-SLAM
tags:
  - Paper
  - Computer Vision
  - SLAM
  - Event
categories:
  - Paper
  - Computer Vision
cover: /images/EGS-SLAM/Model.png
mathjax: true
abbrlink: 778f5e7a
date: 2025-08-19 00:53:48
toc: true
---
# Background
- Feature-based (ORB-SLAM):
   - Sensitive to motion blur 
   - Weak texture reconstruction
- Deblur GS/NeRF: 
    - offline method + image-only
- GS-SLAM: 
    - Vulnerable to intense motion blur
- Event-based (IncEventGS, E-NeRF):
     - Offline method due to SfM
- EGS-SLAM:
    - Online, anti-blurred SLAM system

# Model
<img src="/images/EGS-SLAM/Model.png" style="width:100%;margin:auto;display: block"/>
The first part is 3D Gaussian map representation, where each scene is represented by Gaussian points (including position, covariance matrix, opacity, and color parameters).
When a new scene is input, it continuously reduces the photometric, event, and depth loss for rendering, thereby optimizing the start and end poses of exposure.
Once the pose optimization converges in tracking, it checks whether to select it as a keyframe and updates the entire keyframe queue. After generating a new frame, it initializes some new 3D Gaussian point clouds and optimizes them jointly with various losses.


# Blur-Aware Tracking

## Camera Trajectory
$$
T(\eta)=
\begin{bmatrix}
\mathrm{Slerp}(R_0,R_\tau,\frac{\eta}{\tau}) & (1-\frac{\eta}{\tau})\mathbf{t}_0+\frac{\eta}{\tau}\mathbf{t}_\tau \\
0 & 1
\end{bmatrix}
$$
Propose a temporal interpolation model for intra-exposure trajectory since we need precise camera pose for each event.

## Photometric Loss
### Blurred Image
Blurred image = Integral of sharp images during exposure time

$$\tilde{\boldsymbol{I }}(\boldsymbol{u})=\int_0^\tau\mathcal{I}(\mathbf{T}(\eta),\boldsymbol{u})d\eta\approx\frac{1}{K}\sum_{k=0}^{K-1}\mathcal{I}(\mathbf{T}(\eta_k),\boldsymbol{u})$$
### CRF
Learnable camera response function (CRF) bridges the HDR image and the LDR space by surpress the overexposure or underexposure.
$$
\begin{aligned}
\mathrm{CRF}_\mathrm{leaky}(\tilde{\boldsymbol{I}}(u)) 
 & =
\begin{cases}
\alpha\tilde{\boldsymbol{I}}(\boldsymbol{u}), & \mathrm{if~}\tilde{\boldsymbol{I}}(\boldsymbol{u})<0 \\
\mathrm{Interp}(\tilde{\boldsymbol{I}}(\boldsymbol{u}),\boldsymbol{Q}) & \mathrm{if~}0\leq\tilde{\boldsymbol{I}}(\boldsymbol{u})\leq1, \\
-\frac{\alpha}{\sqrt{\tilde{\boldsymbol{I}}(\boldsymbol{u})}}+\alpha+1, & \mathrm{if~}\tilde{\boldsymbol{I}}(\boldsymbol{u})>1 & 
\end{cases}
\end{aligned}
$$
## Event Loss
### Event Frame
- $E_k(u)$ is the ground truth event frame by aggerating the events in the exposure time $\tau$

- $\hat{E}_k(\boldsymbol{u})=\log(\hat{B}(T(\eta_k),\boldsymbol{u}))-\log(\hat{B}(T(\eta_{k-1}),\boldsymbol{u}))$, where $\hat{B}$ is the predicted grayscale image from the Gaussian map. And the rendered event frame is the log difference of the two consecutive frames.
### Loss Function
- Here $\theta$ is the predefined threshold to trigger events, which is also the parameter to scale the event data and the brightness change.
$$L_{HE}=\frac{1}{K}\sum_{n=0}^{K-1}\sum_{\boldsymbol{E}_{k}(\boldsymbol{u})\neq0}\left\|\theta\cdot E_{k}(\boldsymbol{u})-\hat{E}_{k}(\boldsymbol{u})\right\|_{1}$$

- The "No-Event" loss is used to penalize the event prediction when there are no events in the current frame to surpress the artifacts and accerate convergence.
$$L_{NE}=\frac{1}{K}\sum_{n=0}^{K-1}\sum_{\boldsymbol{E}_{k}(\boldsymbol{u})=0}\left\|\hat{E}_{k}(u)\right\|_{1}$$

- Total event loss:
$$L_E=L_{HE}+\lambda_{NE}L_{NE}$$
## Depth Loss
- We choose the minimum depth value among the k bins:
$$L_D=\min_k\|D_{\mathrm{obs}}-\mathcal{D}(T(\eta_k))\|_1$$
## Pose Optimization
- $$T_{0}^{*},T_{\tau}^{*}=\arg\min_{T_{0},T_{\tau}}\left(\lambda_{E}L_{E}+\lambda_{ID}\left(\lambda_{I}L_{I}+\lambda_{D}L_{D}\right)\right)$$
# Mapping
## Keyframe Management
- Calculate IoU between current frame and previous key frame
- Remove historical key frames having low IoU with current
- If no frame removed, remove the most redundant frame
## 3DGS Map Updating
- After the keyframe is selected, we will update the 3D Gaussian map by:
$$L_{map}=\lambda_{iso}L_{iso}+\sum_{w\in\mathbf{W}^{\prime}}(\lambda_{E}L_{E}^{w}+\lambda_{ID}(\lambda_{I}L_{I}^{w}+\lambda_{D}L_{D}^{w}))$$

Need to note that $L_{iso}=\frac{1}{|\mathbb{G}|}\sum_{i=1}^{|\mathbb{G}|}\|s_i-1\cdot\overline{s}_i\|$, which is to penalize the skinny Gaussians.
# Experiment
## Replica
This dataset is synthesized, and it is used for evaluating the performance of the proposed method.
<img src="/images/EGS-SLAM/replica.png" style="width:60%;margin:auto;display: block"/>

## DEVD
This dataset is real-world and created by the authors, which contains 6 scenes with different motion speeds.
<img src="/images/EGS-SLAM/DEVD.png" style="width:60%;margin:auto;display: block"/>