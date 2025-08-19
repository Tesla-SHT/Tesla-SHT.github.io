---
title: EvGGS
abbrlink: 20ea9dad
date: 2025-08-01 16:35:21
tags:
    - Paper
    - Computer Vision
    - 3D Reconstruction
    - Event Camera
cover: /images/EvGGS/arch.png
mathjax: true
---

# EvGGS

Type: Paper
Notebook: Paper (https://www.notion.so/Paper-17de7e7bfd4c80e2bba1f0fe3a6c1131?pvs=21)
Related Notes: Event Camera (https://www.notion.so/Event-Camera-1bde7e7bfd4c80549635dcce48628146?pvs=21)
<img src="/images/EvGGS/arch.png" style="width:100%;margin:auto;display: block"/>


<details>  
  <summary>
    <h1 class="post-toggle-header">Paper</h1>
  </summary>
<p>

# Trajectory

Reconstruct the 3D Gaussians of scenes in a feedforward manner from the given event stream captured by a moving event camera(to collect multiviews).

# Input & Output

### Input

the asynchronous event stream and encode it into 3D **spatial-temporal voxel grid**

target view

### Output

3D Gaussian representation

# Methodology

## Monocular Depth Estimation
<img src="/images/EvGGS/image1.png" style="width:60%;margin:auto;display: block"/>


Input the consecutive event voxel grid $E_k$ and $E_{k-1}$

U-net $\phi_d$ will predict

- disparity map（视差 ）: The final depth $D_{pred}$ can be converted form the disparity
- Foreground mask  (D): filter out the useless backgrounds

## Intensity Reconstruction
<img src="/images/EvGGS/image2.png" style="width:60%;margin:auto;display: block"/>



Input the event voxel grid, event frame and depth feature volume $F_d$

Also use UNet $\phi_I$ to recover the intensity by multiplying the foreground mask, where $F_I$ is the output feture volume

## Gaussian Parameter Regression
<img src="/images/EvGGS/image3.png" style="width:60%;margin:auto;display: block"/>


And the scale, rotation, opacity are calculated

</p>
</details> 

<details>  
  <summary>
    <h1 class="post-toggle-header">Installation</h1>
  </summary>
<p>

`conda env create --file environment.yml` 

- delete `diff-gaussian-rasterization==0.0.0`
- change to `- simple-knn`

if you wanna update the env with yml after modifying, you can use:`conda env update --file environment.yml`
`conda activate evggs`

> ERROR: CUDA_HOME environment variable is not set. Please set it to your CUDA install root.

`conda install -c conda-forge cudatoolkit-dev -y`

(can be checked by nvcc —version)

`git clone [https://github.com/graphdeco-inria/gaussian-splatting](https://github.com/graphdeco-inria/gaussian-splatting) --recursive
cd gaussian-splatting/
pip install -e submodules/diff-gaussian-rasterization
cd ..`
</p>
</details> 
<details>  
  <summary>
    <h1 class="post-toggle-header">Data</h1>
  </summary>

```python
item = {
'cim': int_img.astype(np.float32)[cs[0]:cs[1], cs[2]:cs[3]][np.newaxis],  #[1, H, W]
'lim': left_img.astype(np.float32)[cs[0]:cs[1], cs[2]:cs[3]][np.newaxis],
'rim': right_img.astype(np.float32)[cs[0]:cs[1], cs[2]:cs[3]][np.newaxis],
'leframe': left_event_frame.transpose((2,0,1)).astype(np.float32)[:, cs[0]:cs[1], cs[2]:cs[3]],  #[3, H, W]
'reframe': right_event_frame.transpose((2,0,1)).astype(np.float32)[:, cs[0]:cs[1], cs[2]:cs[3]], 
'ceframe': center_event_frame.transpose((2,0,1)).astype(np.float32)[:, cs[0]:cs[1], cs[2]:cs[3]],
'lmask': left_mask[cs[0]:cs[1], cs[2]:cs[3]],  #[H, W]
'rmask': right_mask[cs[0]:cs[1], cs[2]:cs[3]],
'cmask': center_mask[cs[0]:cs[1], cs[2]:cs[3]],
'lpose': left_pose.astype(np.float32), #[4, 4]
'rpose': right_pose.astype(np.float32),
'intrinsic': intrinsic.astype(np.float32), #[4, 4]
'ldepth': left_depth_gt.astype(np.float32)[cs[0]:cs[1], cs[2]:cs[3]], # #[H, W]
'rdepth': right_depth_gt.astype(np.float32)[cs[0]:cs[1], cs[2]:cs[3]],
'cdepth': center_depth_gt.astype(np.float32)[cs[0]:cs[1], cs[2]:cs[3]],
'center_voxel':center_event_voxel[:, cs[0]:cs[1], cs[2]:cs[3]], #[5, H, W]
'right_voxel':right_event_voxel[:, cs[0]:cs[1], cs[2]:cs[3]],
'left_voxel':left_event_voxel[:, cs[0]:cs[1], cs[2]:cs[3]],
### target view rendering parameters ###
"H":self.cropped_H,
"W":self.cropped_W,
"FovX":focal2fov(intrinsic[0, 0], self.cropped_W),
"FovY":focal2fov(intrinsic[1, 1], self.cropped_H),
'world_view_transform': world_view_transform,  #[4, 4]
'full_proj_transform': full_proj_transform,   #[4, 4]
'camera_center': camera_center  #[3]
        }
```
</p>
</details>