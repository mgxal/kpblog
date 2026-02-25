---
title: "Fleeting TaaS"
description: "Fleeting TaaS"
date: 2026-02-25
---

The Fragility of TaaS-Based Deployment Compared to Traditional Release Methods
Currently, while working on TaaS-based deployment and CI/CD workflows, I am focusing primarily on two main phases.
The first phase is to properly design the build process and its configuration according to GitOps principles and standards so that it integrates seamlessly with ArgoCD. This means we aim to deliver changes quickly and directly into the manifest repository. In practice, this approach often moves us partially — or even completely — outside of the traditional CI/CD workflow chain.
In the standard model, we typically follow a well-defined path:
PR → CI → CD
However, in the TaaS model, each microservice CI pipeline directly triggers updates into the GitOps repository. This repository is nested in such a way that it is impacted both by the service repository itself and by the GitOps configuration. From a development perspective, this works well. It enables fast iteration and gives developers immediate feedback and deployment capability.
The problem arises in the propagation to the Stage environment.
To address this, I developed a propagator mechanism that captures the current development state and moves it into a tagged version. This provides a practical workflow and acts as a kind of backup strategy. The real challenge appears during the release process — especially when multiple hotfixes are introduced over several days and maintained on separate branches.
My proposed solution is to treat this as a formal release phase:
Automatically scrape the current snapshot into a Stage branch
Maintain clear tracking of changes
Use two image repositories:
An ephemeral repository for Dev
A long-living repository for Stage
This process should be automated outside of TaaS itself but executed within a clean, properly structured environment — following the KISS principle.
The final phase mirrors a traditional merge-and-release process. Once the Stage version has been tested and validated, it becomes the source of truth for Production. The system then creates new mirrors based on the Stage-tested artifacts and promotes them into Production.

┌──────────────────────────────┐
│          DEVELOPER           │
└───────────────┬──────────────┘
                │
                ▼
        ┌───────────────┐
        │  Pull Request │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │    CI Build   │
        └───────┬───────┘
                │
                ▼
        ┌──────────────────────┐
        │ Build Container Image│
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update GitOps Repo   │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │      ArgoCD Sync     │
        └──────────┬───────────┘
                   │
                   ▼
        ┌────────────────────────────┐
        │ DEV Environment            │
        │ (Ephemeral Image Repo)     │
        └──────────┬─────────────────┘
                   │
                   │  Propagator
                   │  Snapshot → Tag
                   ▼
        ┌────────────────────────────┐
        │ Stage Branch (GitOps)      │
        └──────────┬─────────────────┘
                   │
                   ▼
        ┌────────────────────────────┐
        │ Stage Image Repository     │
        │ (Long-Living)              │
        └──────────┬─────────────────┘
                   │
                   ▼
        ┌────────────────────────────┐
        │ STAGE Environment          │
        └──────────┬─────────────────┘
                   │
                   │ Validated Promotion
                   ▼
        ┌────────────────────────────┐
        │ Production Branch (GitOps) │
        └──────────┬─────────────────┘
                   │
                   ▼
        ┌────────────────────────────┐
        │ Production Image Mirror    │
        └──────────┬─────────────────┘
                   │
                   ▼
        ┌────────────────────────────┐
        │ PRODUCTION Environment     │
        └────────────────────────────┘