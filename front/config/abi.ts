export const verifyAbi = [
  {
    inputs: [
      { internalType: "contract IWorldID", name: "_worldId", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "addedPoH",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "userAddress", type: "address" },
      { internalType: "uint256", name: "root", type: "uint256" },
      { internalType: "uint256", name: "nullifierHash", type: "uint256" },
      { internalType: "uint256[8]", name: "proof", type: "uint256[8]" },
    ],
    name: "addWorldIDPoH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "userAddress", type: "address" }],
    name: "checkPoH",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "knownPoH",
    outputs: [
      {
        internalType: "enum ProofOfHumanity.ProofOfHumanityEnum",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "worldId",
    outputs: [{ internalType: "contract IWorldID", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const transferAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "_initialSupply", type: "uint256" },
      { internalType: "address", name: "a1", type: "address" },
      { internalType: "address", name: "a2", type: "address" },
      { internalType: "address", name: "a3", type: "address" },
      { internalType: "address", name: "a4", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const submissionCreateAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_campaignExpirationTimestamp",
        type: "uint256",
      },
      { internalType: "address", name: "_campaignCreator", type: "address" },
      { internalType: "uint256", name: "_category", type: "uint256" },
      { internalType: "uint256", name: "_maxSubmissions", type: "uint256" },
      { internalType: "uint256", name: "_reward", type: "uint256" },
      {
        internalType: "contract IERC20",
        name: "_rewardToken",
        type: "address",
      },
      {
        components: [
          { internalType: "int256", name: "lat", type: "int256" },
          { internalType: "int256", name: "long", type: "int256" },
        ],
        internalType: "struct StashCampaign.Coordinate",
        name: "topLeft",
        type: "tuple",
      },
      {
        components: [
          { internalType: "int256", name: "lat", type: "int256" },
          { internalType: "int256", name: "long", type: "int256" },
        ],
        internalType: "struct StashCampaign.Coordinate",
        name: "bottomRight",
        type: "tuple",
      },
      { internalType: "bytes32", name: "_descriptionHash", type: "bytes32" },
      {
        internalType: "contract ProofOfHumanity",
        name: "_proofOfHumanity",
        type: "address",
      },
      {
        internalType: "contract CampaignManager",
        name: "_campaignManager",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_disputDepositAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "submissionID",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "Disputor",
        type: "address",
      },
    ],
    name: "Disputed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "submissionID",
        type: "address",
      },
    ],
    name: "Resolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "submitter",
        type: "address",
      },
    ],
    name: "SubmissionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "submissionID",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum StashCampaign.SubmissionStatus",
        name: "status",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minResolveTimestamp",
        type: "uint256",
      },
    ],
    name: "SubmissionFinalized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "submissionID",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "verifier",
        type: "address",
      },
    ],
    name: "VoteRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "submissionID",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "verifier",
        type: "address",
      },
    ],
    name: "Voted",
    type: "event",
  },
  {
    inputs: [],
    name: "DISPUTE_WINDOW",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_SUBMISSION_DURATION",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VERIFICATION_ROUND_SIZE",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "campaignArea",
    outputs: [
      { internalType: "int256", name: "lat", type: "int256" },
      { internalType: "int256", name: "long", type: "int256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "campaignCreator",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "campaignExpirationTimestamp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "campaignManager",
    outputs: [
      { internalType: "contract CampaignManager", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "category",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "dummySubmitter", type: "address" },
    ],
    name: "createDummySubmission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_photoHash", type: "bytes32" },
      { internalType: "bytes32", name: "_descriptionHash", type: "bytes32" },
      { internalType: "int256", name: "_lat", type: "int256" },
      { internalType: "int256", name: "_long", type: "int256" },
    ],
    name: "createSubmission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "descriptionHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "disputDepositAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "submissionId", type: "address" },
      { internalType: "bytes32", name: "disputorNotesHash", type: "bytes32" },
    ],
    name: "dispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSubmissions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proofOfHumanity",
    outputs: [
      { internalType: "contract ProofOfHumanity", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "recoupCampaignTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "submissionId", type: "address" },
    ],
    name: "resolve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "submissionIds",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "submissions",
    outputs: [
      { internalType: "bytes32", name: "photoHash", type: "bytes32" },
      { internalType: "bytes32", name: "descriptionHash", type: "bytes32" },
      { internalType: "uint256", name: "minResolveTimestamp", type: "uint256" },
      { internalType: "uint256", name: "lockedReward", type: "uint256" },
      {
        components: [
          { internalType: "int256", name: "lat", type: "int256" },
          { internalType: "int256", name: "long", type: "int256" },
        ],
        internalType: "struct StashCampaign.Coordinate",
        name: "location",
        type: "tuple",
      },
      {
        internalType: "enum StashCampaign.SubmissionStatus",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "submissionId", type: "address" },
      {
        internalType: "enum StashCampaign.VoteOpinion",
        name: "opinion",
        type: "uint8",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
