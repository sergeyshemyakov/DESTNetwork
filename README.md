# DESTNetwork

DESTNet project from ETHGlobal Brussels 2024 hackathon

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Demo](#demo)
- [User Flow](#user-flow)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Contributing](#contributing)
- [Contact](#contact)

## Introduction

Decentralized Stash Network, Destnet or DEST Network incentivizes users in a particular area to create stashes of some items, to prepare for a natural disaster (medicine, inflatable boats, radio receivers).

### Why

- South East Asian countries like India, Indonesia and Philippines not only face the highest risks of natural disasters, but also show the highest adoption of blockchain, treating it not merely as a get rich quick scheme.
- Climate change escalates risks of devastating natural disasters, preparing people in zones of risk is a great mitigation strategy. 
- DePIN is a reasonable and exciting use-case for blockchain, but we feel that only a couple of different directions were explored.


## Features

- Destnet a DePIN project, where the idea of a public infrastructure is expanded beyond usual use cases
- Correctness of everything rests on the social consensus: submitted stashes are verified by other users and independent disputors
- Integration with [specific blockchain platform]
- User-friendly UI/UX

## Demo
Provide links to a live demo or video demonstration:
- [Live Demo](http://dest-network.web.app)
- [Video Demo](http://example.com/video)

## User Flow

- Anyone can create a stash campaign with description, a rectangular area, reward per submission and maximal number of submissions. Rewards can be paid in any ERC-20 token. 
- Each user can create a submission with a photo, description and coordinates. All info is stored on our server, hash goes onchain.
- Reward is allocated immediately, but it is locked for ~3 months. Additionally, - user must cast all required votes before getting it.
- Verifiers are chosen randomly among other users. If a vote is not unanimous, new set of verifiers is sampled. After the vote is finalized, there is a 1 month period for disputing, which requires a deposit and could be done by anyone. 
- Incorrect votes punished by half of their locked reward (or full disputror deposit / submitter reward), these are shared equally among all correct voters.


## Technologies Used

### Backend

- Web App: FastAPI, SQLAlchemy
- Smart Contract Events Consumer: web3py, multithreading
- Node API: Alchemy
- Deployment: Heroku

### Frontend

- App: Next.js
- BFF: Next.js
- Transaction signature: vagmi, viem, wallectConnect
- Deployment: Firebase

## Architecture

![System design](assets/system_design.png)

Common flow: 
- User opens website and attaches wallet
    - Optionally: confirm wallet with World ID
- User selects campaign that they want to participate in, and provides submission info - location, photo, and description. 
- With this info we call smart contract and create new transaction. This transacation then consumed on backend by listening for smart contract event.
    - Additionally, 3 verificators are added for this submissions
- By default, all submissions are created in disputed state. In order for user to get their reward, verificators need to either accept or reject submission. This info is also stored on blockchain
- Users can overview all submissions for a particular campaign on interactive map
