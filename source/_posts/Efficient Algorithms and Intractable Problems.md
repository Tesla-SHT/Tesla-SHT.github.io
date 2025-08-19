---
title: Efficient Algorithms and Intractable Problems
tags:
  - Berkeley
  - Study
  - CS170
categories:
  - Study
  - Berkeley
  - Notes
  - CS
abbrlink: 51833
cover: /images/170.png
---

# Introduction

Although the content of this class covers many knowledge that OIers have learned, I still gain some interesting insights from it, like a new way to Vertex Contraction, brief explanation of short path algorithms...

# Master Theorem
[Master Theorem](25951)
# Graph

## Vertex Contraction
### Kosaraju's Algorithm
  1. Reverse the graph.
  2. DFS the reversed graph and get the finishing time of each node.
  3. DFS the original graph according to the finishing time. The nodes in the same SCC will be visited in the same DFS.

## Shortest Path
### 1. Dijkstra's Algorithm
   We can imagine the algorithm as water flowing from the source to the destination. The speed of the flowing is 1 distance/s and theorically we will check whether nodes are immersed at each time.
### 2. Bellman-Ford Algorithm
   This algorithm mainly solve the problem of negative weight edges. the outest loop is the number of hops, and if after V-1 times, the distance is still updated, then there must be a negative cycle since there must be a circle in this path.

## Minimum Spanning Tree
  ### Easy way to check whether it belongs to MST
    Yes: Smallest edge between two cuts; 
    No: The biggest edge in the cycle.
    