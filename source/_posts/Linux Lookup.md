---
title: Linux Lookup
abbrlink: f7b0b433
date: 2025-08-20 17:05:29
tags:
- Linux
- System
- Command
- AI
categories:
- Linux
- System
- AI
toc: true
cover: 
---

# Links

https://github.com/HuangJianxjtu/linux_learning/blob/master/ubuntu20_setup_notes.md

# Installation

```bash
conda create -n myenv python=3.8 #create new env
conda remove -n myenv --all #delete the whole env
```

## Torch Related
<!-- two columns, two iamges  in one row -->
|||
|---|---|
|<img src="/images/LinuxLookup/image.png" style="width:100%;margin:auto;display: block"/>|<img src="/images/LinuxLookup/image1.png" style="width:60%;margin:auto;display: block"/>|

- install torch/torchvision/torchaudio with specefic cudatoolkit:`pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu117`

- Install whl file: `pip install ***.whl `

- 国内源 `-i https://pypi.tuna.tsinghua.edu.cn/simple` 

## Venv

- `python3 -m venv venv` 创建新环境
- `source venv/bin/activate` 激活环境
- `deactivate` 退出环境

# System&Terminal

- Supervise the GPU usage `watch -n 10 nvidia-smi`

- Look for proxy `env|grep -i proxy`

- Check the system archtecture `uname -m`

- Package Management:

  - Installation`sudo dpkg -i package_name.deb`
  - Uninstallation `sudo dpkg -r package_name`

- Show the path of the Python intepreter:

    ```python
    import sys
    path = sys.executable
    print(path)
    ```

  - Select the Python Intepreter in VSCode:
    - `Ctrl+Shift+P`  to open the control panel
    - Choose `Python: Select Interpreter`

- [Vim Handbook](https://tesla-sht.github.io/posts/44303.html)

# Python

`python -c "print('Hello from command line')"` #execute python code directly from CLI

`python -c "import torch; print(torch.cuda.is_available()); print(torch.__version__)"`

`python -m pip install package_name` #install packages using pip

`python [main.py](http://main.py) -h` get the subsequent commands 

# Docker

`docker images` 查看当前所有docker镜像

`docker rmi [REPOSITORY:TAG]` 删除指定镜像

# No Hang up

以下命令在后台执行 root 目录下的 [runoob.sh](http://runoob.sh/) 脚本（注意&才能让它在后台运行）
`nohup /root/runoob.sh &`

并且在当前目录下生成nohup.out文件

以下命令找到这个文件的PID
`ps -aux | grep "runoob.sh"` 
进行删除
`kill -9  进程号PID`

# Errors

## 一些文字没有显示

重启GNOME Shell

按下 Alt + F2
在弹出的运行对话框中输入字母 r
按下回车键

## **dpkg: 错误: 另外一个进程已经为 dpkg frontend lock 加锁**

`ps -e | grep apt` 查看apt所有进程

`sudo kill [PID]` kill it

# Git

## Git checkout and git switch/restore

Actually same while **the latter is more clear** 

```python
# 切换到一个已存在的分支
git checkout develop
# 创建一个新分支并立即切换过去
git checkout -b new-feature
# 切换到一个特定的提交（会进入“分离头指针”状态）
git checkout <commit-hash>

# 撤销工作区中 a.txt 文件的修改，恢复到和暂存区一致的状态
git checkout -- a.txt
# 丢弃工作区和暂存区的所有修改，将 a.txt 文件恢复到上一次提交时的状态
git checkout HEAD -- a.txt
```

```python
# 切换到一个已存在的分支 (和 checkout 作用相同)
git switch develop
# 创建一个新分支并立即切换过去 (用 -c 代替 -b，c 代表 create)
git switch -c new-feature
# 切换回上一个分支 (这是一个很方便的快捷操作)
git switch -

# 撤销工作区中 a.txt 的修改 (从暂存区恢复)
git restore a.txt
# 将暂存区的文件放回工作区 (unstage)
git restore --staged a.txt
# 同时撤销工作区和暂存区的修改，从上一次提交恢复文件
git restore --source=HEAD a.txt
```

## Merge one branch to another branch

- `git pull --rebase`  means fetching all **remote** commits, and the changes will be **after** the newer commits
- `git push` (suppose on main branch)
- `git checkout dev` switch to another branch dev
- `git merge main` merge main to dev

## Modify the latest commit:

- First stash the new changes, then use`git commit --amend` ，use `:wq` to quit the Vim

## Submodule Tracking

Sometimes, the changes in the submodule may not be tracked.

1. Remove the original tracking: `git rm --cached [File]` 

2. Delete the `.git` file in submodule and delete the relative file in the root `..git` if exists

3. `git add` the file, same as other changes

    

# CUDA

## Assign Process to GPU

- In Terminal: `CUDA_VISIBLE_DEVICES=? python [main.py](http://main.py/)` (GPU start from 0)
- In Python: `os.environ[“CUDA_VISIBLE_DEVICES”] = “?”`
- In System: `export CUDA_VISIBLE_DEVICES=?`

```python
# cuda是否可用，可用返回true, 不可用返回false
torch.cuda.is_available()
# 查看gpu可用的数量
torch.cuda.device_count()
# 返回gpu名称, 默认从0开始
torch.cuda.get_device_name(0) # 如rtx 3090
# 返回当前gpu的索引
torch.cuda.current_device()
```
