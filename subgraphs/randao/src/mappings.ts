import {
  Execute as ExecuteRandao,
  RegisterJob as RegisterJobRandao,
  JobUpdate as JobUpdateRandao,
  SetJobConfig as SetJobConfigRandao,
  InitiateJobTransfer as InitiateJobTransferRandao,
  AcceptJobTransfer as AcceptJobTransferRandao,
  DepositJobCredits as DepositJobCreditsRandao,
  WithdrawJobCredits as WithdrawJobCreditsRandao,
  DepositJobOwnerCredits as DepositJobOwnerCreditsRandao,
  WithdrawJobOwnerCredits as WithdrawJobOwnerCreditsRandao,
  SetJobResolver as SetJobResolverRandao,
  SetJobPreDefinedCalldata as SetJobPreDefinedCalldataRandao,
  RegisterAsKeeper as RegisterAsKeeperRandao,
  SetWorkerAddress as SetWorkerAddressRandao,
  WithdrawCompensation as WithdrawCompensationRandao,
  Stake as StakeRandao,
  OwnerSlash as SlashRandao,
  InitiateRedeem as InitiateRedeemRandao,
  FinalizeRedeem as FinalizeRedeemRandao,
  OwnershipTransferred as OwnershipTransferredRandao,
  SetAgentParams as SetAgentParamsRandao,
  SetRdConfig,
  PPAgentV2Randao,
  JobKeeperChanged,
  InitiateKeeperSlashing,
  DisableKeeper,
  InitiateKeeperActivation,
  FinalizeKeeperActivation,
  ExecutionReverted,
  SlashKeeper,
} from "subgraph-randao/generated/PPAgentV2Randao/PPAgentV2Randao";
import {
  Execute as ExecuteLight,
  RegisterJob as RegisterJobLight,
  JobUpdate as JobUpdateLight,
  SetJobConfig as SetJobConfigLight,
  InitiateJobTransfer as InitiateJobTransferLight,
  AcceptJobTransfer as AcceptJobTransferLight,
  DepositJobCredits as DepositJobCreditsLight,
  WithdrawJobCredits as WithdrawJobCreditsLight,
  DepositJobOwnerCredits as DepositJobOwnerCreditsLight,
  WithdrawJobOwnerCredits as WithdrawJobOwnerCreditsLight,
  SetJobResolver as SetJobResolverLight,
  SetJobPreDefinedCalldata as SetJobPreDefinedCalldataLight,
  RegisterAsKeeper as RegisterAsKeeperLight,
  SetWorkerAddress as SetWorkerAddressLight,
  WithdrawCompensation as WithdrawCompensationLight,
  Stake as StakeLight,
  Slash as SlashLight,
  InitiateRedeem as InitiateRedeemLight,
  FinalizeRedeem as FinalizeRedeemLight,
} from "subgraph-light/generated/PPAgentV2Light/PPAgentV2Light";
import {
  commonHandleAcceptJobTransfer,
  commonHandleDepositJobCredits,
  commonHandleDepositJobOwnerCredits,
  commonHandleExecution, commonHandleFinalizeRedeem,
  commonHandleInitiateJobTransfer, commonHandleInitiateRedeem,
  commonHandleJobUpdate,
  commonHandleRegisterAsKeeper,
  commonHandleRegisterJob,
  commonHandleSetJobConfig,
  commonHandleSetJobPreDefinedCalldata,
  commonHandleSetJobResolver,
  commonHandleSetWorkerAddress, commonHandleSlash, commonHandleStake, commonHandleWithdrawCompensation,
  commonHandleWithdrawJobCredits,
  commonHandleWithdrawJobOwnerCredits,
} from "../../../common/helpers/mappings";
import {BigInt} from "@graphprotocol/graph-ts";
import {getOrCreateRandaoAgent, getJobByKey} from "./initializers";
import {
    BIG_INT_ONE,
    BIG_INT_ZERO,
    getCertainExecution,
    getKeeper,
    getOrCreateJobOwner,
    ZERO_ADDRESS,
} from "../../../common/helpers/initializers";

import {
    ExecutionRevert, WithdrawKeeperCompensation,
    SlashKeeper as SlashKeeperSchema,
    SetKeeperWorkerAddress,
    KeeperOwnerSlash,
    JobKeeperChanged as JobKeeperChangedSchema,
    InitiateKeeperSlashing as InitiateKeeperSlashingSchema,
    DisableKeeper as DisableKeeperSchema,
    InitiateKeeperActivation as InitiateKeeperActivationSchema,
    FinalizeKeeperActivation as FinalizeKeeperActivationSchema,
    JobUpdate as JobUpdateSchema,
    SetJobPreDefinedCalldata as SetJobPreDefinedCalldataSchema,
    SetJobResolver as SetJobResolverSchema,
    SetJobConfig as SetJobConfigSchema,
    AcceptJobTransfer as AcceptJobTransferSchema,
    InitiateJobTransfer as InitiateJobTransferSchema,
    Execution,
    JobOwner,
} from "../generated/schema";

export function handleExecution(event: ExecuteRandao): void {
  const fakeEvent: ExecuteLight = new ExecuteLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleExecution(fakeEvent);

  // count statistics after execution
  const agent = getOrCreateRandaoAgent();
  const execution = getCertainExecution(event.transaction.hash.toHexString());
  agent.executionsCount = agent.executionsCount.plus(BIG_INT_ONE);
  agent.paidCount = agent.paidCount.plus(event.params.compensation);
  agent.profitCount = agent.profitCount.plus(execution.profit);
  agent.save();
}

export function handleRegisterJob(event: RegisterJobRandao): void {
  const agent = getOrCreateRandaoAgent();
  const fakeEvent: RegisterJobLight = new RegisterJobLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  // If job owner not exist here, he will be created at next step. So we can legally increment jow owners counter here.
  if (JobOwner.load(event.params.owner.toHexString()) === null) {
    agent.jobOwnersCount = agent.jobOwnersCount.plus(BIG_INT_ONE);
  }

  commonHandleRegisterJob(fakeEvent);

  agent.jobsCount = agent.jobsCount.plus(BIG_INT_ONE);
  agent.activeJobsCount = agent.activeJobsCount.plus(BIG_INT_ONE);
  agent.save();
}

export function handleJobUpdate(event: JobUpdateRandao): void {
  const fakeEvent: JobUpdateLight = new JobUpdateLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleJobUpdate(fakeEvent);

  const jobUpdate = new JobUpdateSchema(event.transaction.hash.toHexString());
  jobUpdate.createTxHash = event.transaction.hash;
  jobUpdate.createdAt = event.block.timestamp;
  jobUpdate.job = event.params.jobKey.toHexString();
  jobUpdate.maxBaseFeeGwei = event.params.maxBaseFeeGwei;
  jobUpdate.rewardPct = event.params.rewardPct;
  jobUpdate.fixedReward = event.params.fixedReward;
  jobUpdate.jobMinCvp = event.params.jobMinCvp;
  jobUpdate.intervalSeconds = event.params.intervalSeconds;

  jobUpdate.save();
}

export function handleSetJobConfig(event: SetJobConfigRandao): void {
  const agent = getOrCreateRandaoAgent();
  const fakeEvent: SetJobConfigLight = new SetJobConfigLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );

  // if config wants to change job active state, we should handle activeJobsCount
  const job = getJobByKey(event.params.jobKey.toHexString());
  if (!job.active && event.params.isActive_) {
    agent.activeJobsCount = agent.activeJobsCount.plus(BIG_INT_ONE);
  } else if (job.active && !event.params.isActive_) {
    agent.activeJobsCount = agent.activeJobsCount.minus(BIG_INT_ONE);
  }
  agent.save();

  commonHandleSetJobConfig(fakeEvent);

  const entity = new SetJobConfigSchema(event.transaction.hash.toHexString());
  entity.createTxHash = event.transaction.hash;
  entity.createdAt = event.block.timestamp;
  entity.job = event.params.jobKey.toHexString();
  entity.isActive = event.params.isActive_;
  entity.useJobOwnerCredits = event.params.useJobOwnerCredits_;
  entity.assertResolverSelector = event.params.assertResolverSelector_;

  entity.save();
}

export function handleInitiateJobTransfer(event: InitiateJobTransferRandao): void {
  const fakeEvent: InitiateJobTransferLight = new InitiateJobTransferLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleInitiateJobTransfer(fakeEvent);

  const entity = new InitiateJobTransferSchema(event.transaction.hash.toHexString());
  entity.createTxHash = event.transaction.hash;
  entity.createdAt = event.block.timestamp;
  entity.job = event.params.jobKey.toHexString();
  entity.to = event.params.to;
  entity.from = event.params.from;

  entity.save();
}

export function handleAcceptJobTransfer(event: AcceptJobTransferRandao): void {
  const fakeEvent: AcceptJobTransferLight = new AcceptJobTransferLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleAcceptJobTransfer(fakeEvent);

  const entity = new AcceptJobTransferSchema(event.transaction.hash.toHexString());
  entity.createTxHash = event.transaction.hash;
  entity.createdAt = event.block.timestamp;
  entity.job = event.params.jobKey_.toHexString();
  entity.to = event.params.to_;

  entity.save();
}


export function handleDepositJobCredits(event: DepositJobCreditsRandao): void {
  const fakeEvent: DepositJobCreditsLight = new DepositJobCreditsLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleDepositJobCredits(fakeEvent);

  const agent = getOrCreateRandaoAgent();
  agent.jobsBalanceCount = agent.jobsBalanceCount.plus(event.params.amount);
  agent.save();
}

export function handleWithdrawJobCredits(event: WithdrawJobCreditsRandao): void {
  const fakeEvent: WithdrawJobCreditsLight = new WithdrawJobCreditsLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleWithdrawJobCredits(fakeEvent);

  const agent = getOrCreateRandaoAgent();
  agent.jobsBalanceCount = agent.jobsBalanceCount.minus(event.params.amount);
  agent.save();
}

export function handleDepositJobOwnerCredits(event: DepositJobOwnerCreditsRandao): void {
  const fakeEvent: DepositJobOwnerCreditsLight = new DepositJobOwnerCreditsLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleDepositJobOwnerCredits(fakeEvent);

  const agent = getOrCreateRandaoAgent();
  agent.jobsBalanceCount = agent.jobsBalanceCount.plus(event.params.amount);
  agent.save();
}

export function handleWithdrawJobOwnerCredits(event: WithdrawJobOwnerCreditsRandao): void {
  const fakeEvent: WithdrawJobOwnerCreditsLight = new WithdrawJobOwnerCreditsLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleWithdrawJobOwnerCredits(fakeEvent);

  const agent = getOrCreateRandaoAgent();
  agent.jobsBalanceCount = agent.jobsBalanceCount.minus(event.params.amount);
  agent.save();
}


export function handleSetJobPreDefinedCalldata(event: SetJobPreDefinedCalldataRandao): void {
  const fakeEvent: SetJobPreDefinedCalldataLight = new SetJobPreDefinedCalldataLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSetJobPreDefinedCalldata(fakeEvent);

  const entity = new SetJobPreDefinedCalldataSchema(event.transaction.hash.toHexString());
  entity.createTxHash = event.transaction.hash;
  entity.createdAt = event.block.timestamp;
  entity.job = event.params.jobKey.toHexString();
  entity.preDefinedCalldata = event.params.preDefinedCalldata;

  entity.save();
}

export function handleSetJobResolver(event: SetJobResolverRandao): void {
  const fakeEvent: SetJobResolverLight = new SetJobResolverLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSetJobResolver(fakeEvent);

  const entity = new SetJobResolverSchema(event.transaction.hash.toHexString());
  entity.createTxHash = event.transaction.hash;
  entity.createdAt = event.block.timestamp;
  entity.job = event.params.jobKey.toHexString();
  entity.resolverAddress = event.params.resolverAddress;
  entity.resolverCalldata = event.params.resolverCalldata;

  entity.save();
}


export function handleRegisterAsKeeper(event: RegisterAsKeeperRandao): void {
  const fakeEvent: RegisterAsKeeperLight = new RegisterAsKeeperLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleRegisterAsKeeper(fakeEvent);

  const agent = getOrCreateRandaoAgent();
  agent.keepersCount = agent.keepersCount.plus(BIG_INT_ONE);
  agent.lastKeeperId = event.params.keeperId;
  agent.save();
}

export function handleSetWorkerAddress(event: SetWorkerAddressRandao): void {
  const fakeEvent: SetWorkerAddressLight = new SetWorkerAddressLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSetWorkerAddress(fakeEvent);

  const setAddress = new SetKeeperWorkerAddress(event.transaction.hash.toHexString());
  setAddress.createTxHash = event.transaction.hash;
  setAddress.createdAt = event.block.timestamp;
  setAddress.keeper = event.params.keeperId.toString();
  setAddress.prev = event.params.prev;
  setAddress.worker = event.params.worker;

  setAddress.save();
}

export function handleWithdrawCompensation(event: WithdrawCompensationRandao): void {
  const fakeEvent: WithdrawCompensationLight = new WithdrawCompensationLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleWithdrawCompensation(fakeEvent);

  const compensation = new WithdrawKeeperCompensation(event.transaction.hash.toHexString())
  compensation.createTxHash = event.transaction.hash;
  compensation.createdAt = event.block.timestamp;
  compensation.keeper = event.params.keeperId.toString();
  compensation.to = event.params.to;
  compensation.amount = event.params.amount;

  compensation.save();

  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.compensationWithdrawalCount = keeper.compensationWithdrawalCount.plus(BIG_INT_ONE);
  keeper.save();
}

export function handleStake(event: StakeRandao): void {
  const fakeEvent: StakeLight = new StakeLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleStake(fakeEvent);

  // adds stake to total counter
  const agent = getOrCreateRandaoAgent();
  agent.stakeCount = agent.stakeCount.plus(event.params.amount);
  agent.save();
}

export function handleSlash(event: SlashRandao): void {
  const fakeEvent: SlashLight = new SlashLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSlash(fakeEvent);

  const ownerSlash = new KeeperOwnerSlash(event.transaction.hash.toHexString());
  ownerSlash.createTxHash = event.transaction.hash;
  ownerSlash.createdAt = event.block.timestamp;
  ownerSlash.keeper = event.params.keeperId.toString();
  ownerSlash.to = event.params.to;
  ownerSlash.currentAmount = event.params.currentAmount;
  ownerSlash.pendingAmount = event.params.pendingAmount;

  ownerSlash.save();
}

export function handleInitiateRedeem(event: InitiateRedeemRandao): void {
  const fakeEvent: InitiateRedeemLight = new InitiateRedeemLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  const agent = getOrCreateRandaoAgent();
  const stakeToReduce = commonHandleInitiateRedeem(fakeEvent, agent.pendingWithdrawalTimeoutSeconds);

  // removes stake from total counter
  agent.stakeCount = agent.stakeCount.minus(stakeToReduce);
  agent.save();
}

export function handleFinalizeRedeem(event: FinalizeRedeemRandao): void {
  const fakeEvent: FinalizeRedeemLight = new FinalizeRedeemLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleFinalizeRedeem(fakeEvent);
}


export function handleOwnershipTransferred(event: OwnershipTransferredRandao): void {
  const agent = getOrCreateRandaoAgent();

  // Init block
  if (agent.owner == ZERO_ADDRESS) {
    const agentContract = PPAgentV2Randao.bind(event.address);

    // Fetch CVP
    const res1 = agentContract.try_CVP();
    if (res1.reverted) {
      throw new Error('Init: Unable to fetch CVP');
    }
    agent.address = event.address;
    agent.cvp = res1.value;
  }

  agent.owner = event.params.newOwner;
  agent.save();
}

export function handleSetAgentParams(event: SetAgentParamsRandao): void {
  const agent = getOrCreateRandaoAgent();

  agent.minKeeperCVP = event.params.minKeeperCvp_;
  agent.pendingWithdrawalTimeoutSeconds = event.params.timeoutSeconds_;
  agent.feePpm = event.params.feePpm_;

  agent.save();
}

/****** RANDAO-SPECIFIC HANDLERS ******/
export function handleSetRdConfig(event: SetRdConfig): void {
  const randaoAgent = getOrCreateRandaoAgent();
  randaoAgent.slashingEpochBlocks = BigInt.fromI32(event.params.rdConfig.slashingEpochBlocks);
  randaoAgent.period1 = BigInt.fromI32(event.params.rdConfig.period1);
  randaoAgent.period2 = BigInt.fromI32(event.params.rdConfig.period2);
  randaoAgent.slashingFeeFixedCVP = BigInt.fromI32(event.params.rdConfig.slashingFeeFixedCVP);
  randaoAgent.slashingFeeBps = BigInt.fromI32(event.params.rdConfig.slashingFeeBps);
  randaoAgent.jobMinCreditsFinney = BigInt.fromI32(event.params.rdConfig.jobMinCreditsFinney);
  randaoAgent.agentMaxCvpStake = event.params.rdConfig.agentMaxCvpStake;
  randaoAgent.jobCompensationMultiplierBps = BigInt.fromI32(event.params.rdConfig.jobCompensationMultiplierBps);
  randaoAgent.stakeDivisor = event.params.rdConfig.stakeDivisor;
  randaoAgent.keeperActivationTimeoutHours = BigInt.fromI32(event.params.rdConfig.keeperActivationTimeoutHours);
  randaoAgent.jobFixedRewardFinney = BigInt.fromI32(event.params.rdConfig.jobFixedReward);
  randaoAgent.save();
}

export function handleJobKeeperChanged(event: JobKeeperChanged): void {
  const job = getJobByKey(event.params.jobKey.toHexString());
  job.jobNextKeeperId = event.params.keeperTo;
  job.save();

  const keeperChanged = new JobKeeperChangedSchema(event.transaction.hash.toHexString());
  keeperChanged.createTxHash = event.transaction.hash;
  keeperChanged.createdAt = event.block.timestamp;
  keeperChanged.job = event.params.jobKey.toHexString();
  keeperChanged.keeperFrom = event.params.keeperFrom.toString();
  keeperChanged.keeperTo = event.params.keeperTo.toString();

  keeperChanged.save();
}

export function handleInitiateKeeperSlashing(event: InitiateKeeperSlashing): void {
  const job = getJobByKey(event.params.jobKey.toHexString());
  job.jobReservedSlasherId = event.params.slasherKeeperId;
  job.jobSlashingPossibleAfter = event.params.jobSlashingPossibleAfter;

  job.save();

  const slashing = new InitiateKeeperSlashingSchema(event.transaction.hash.toHexString());
  slashing.createTxHash = event.transaction.hash;
  slashing.createdAt = event.block.timestamp;
  slashing.job = event.params.jobKey.toHexString();
  slashing.slasherKeeper = event.params.slasherKeeperId.toString();
  slashing.useResolver = event.params.useResolver;
  slashing.jobSlashingPossibleAfter = event.params.jobSlashingPossibleAfter;

  slashing.save();
}

export function handleDisableKeeper(event: DisableKeeper): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.active = false;

  keeper.save();

  const disableEvent = new DisableKeeperSchema(event.transaction.hash.toHexString());
  disableEvent.createTxHash = event.transaction.hash;
  disableEvent.createdAt = event.block.timestamp;
  disableEvent.keeper = event.params.keeperId.toString();

  disableEvent.save();

  const agent = getOrCreateRandaoAgent();
  agent.activeKeepersCount = agent.activeKeepersCount.minus(BIG_INT_ONE);
  agent.save();
}

export function handleInitKeeperActivation(event: InitiateKeeperActivation): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.keeperActivationCanBeFinalizedAt = event.params.canBeFinalizedAt;

  keeper.save();

  const init = new InitiateKeeperActivationSchema(event.transaction.hash.toHexString());
  init.createTxHash = event.transaction.hash;
  init.createdAt = event.block.timestamp;
  init.keeper = event.params.keeperId.toString();
  init.canBeFinalizedAt = event.params.canBeFinalizedAt;

  init.save();
}

export function handleFinalizeKeeperActivation(event: FinalizeKeeperActivation): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.keeperActivationCanBeFinalizedAt = BIG_INT_ZERO;
  keeper.active = true;

  keeper.save();

  const finalize = new FinalizeKeeperActivationSchema(event.transaction.hash.toHexString());
  finalize.createTxHash = event.transaction.hash;
  finalize.createdAt = event.block.timestamp;
  finalize.keeper = event.params.keeperId.toString();

  finalize.save();

  const agent = getOrCreateRandaoAgent();
  agent.activeKeepersCount = agent.activeKeepersCount.plus(BIG_INT_ONE);
  agent.save();
}

export function handleExecutionReverted(event: ExecutionReverted): void {
  const id = event.transaction.hash.toHexString();
  const revert = new ExecutionRevert(id);

  revert.createTxHash = event.transaction.hash;
  revert.createdAt = event.block.timestamp;
  revert.txIndex = event.transaction.index;
  revert.txNonce = event.transaction.nonce;

  revert.txGasUsed = event.receipt!.gasUsed;
  revert.txGasLimit = event.transaction.gasLimit;

  revert.baseFee = event.block.baseFeePerGas as BigInt;
  revert.gasPrice = event.transaction.gasPrice as BigInt;
  revert.compensation = event.params.compensation;
  revert.profit = BIG_INT_ZERO;
  revert.expenses = BIG_INT_ZERO;
  if (revert.txGasUsed.gt(BIG_INT_ZERO)) {
    revert.expenses = revert.gasPrice.times(revert.txGasUsed);
    revert.profit = event.params.compensation.minus(revert.expenses);
  }

  revert.executionResponse = event.params.executionReturndata;

  revert.job = event.params.jobKey.toHexString();
  revert.actualKeeper = event.params.actualKeeperId.toString();
  revert.assignedKeeper = event.params.assignedKeeperId.toString();

  const job = getJobByKey(event.params.jobKey.toHexString());

  revert.jobOwner = job.owner;
  revert.save();

  if (job.useJobOwnerCredits) {
    const jobOwner = getOrCreateJobOwner(job.owner);
    jobOwner.credits = jobOwner.credits.minus(event.params.compensation);
    jobOwner.save();
  } else {
    job.credits = job.credits.minus(event.params.compensation);
  }

  job.executionRevertCount = job.executionRevertCount.plus(BIG_INT_ONE);
  job.totalCompensations = job.totalCompensations.plus(revert.compensation);

  job.save();
}

export function handleSlashKeeper(event: SlashKeeper): void {
  // Not sure about right id. expectedKeeper + actualKeeper might not be unique, so I used txHash
  const id = event.transaction.hash.toHexString();
  const slashKeeper = new SlashKeeperSchema(id);

  slashKeeper.createTxHash = event.transaction.hash;
  slashKeeper.createdAt = event.block.timestamp;
  slashKeeper.txIndex = event.transaction.index;
  slashKeeper.txNonce = event.transaction.nonce;

  slashKeeper.job = event.params.jobKey.toHexString();
  slashKeeper.slashedKeeper = event.params.assignedKeeperId.toString();
  slashKeeper.slasherKeeper = event.params.actualKeeperId.toString();

  slashKeeper.fixedSlashAmount = event.params.fixedSlashAmount;
  slashKeeper.dynamicSlashAmount = event.params.dynamicSlashAmount;
  slashKeeper.slashAmountMissing = event.params.slashAmountMissing;

  const totalSlashAmount = slashKeeper.fixedSlashAmount.plus(slashKeeper.dynamicSlashAmount).minus(slashKeeper.slashAmountMissing);
  slashKeeper.slashAmountResult = totalSlashAmount;

  // Link either to execution or executionRevert
  {
    const txHash = event.transaction.hash.toHexString();

    // Try execution first
    let execution = Execution.load(txHash);
    if (!execution) {
      // Then it should be executionRevert
      let executionRevert = ExecutionRevert.load(txHash);
      if (!executionRevert) {
        throw new Error(`Neither execution nor execution revert found for tx ${txHash}.`);
      }
      slashKeeper.executionRevert = txHash;
    }
    slashKeeper.execution = txHash;
  }
  slashKeeper.save();

  const slasherId = event.params.actualKeeperId.toString();
  const slashedId = event.params.assignedKeeperId.toString();

  const slashedKeeper = getKeeper(slashedId);
  const slasherKeeper = getKeeper(slasherId);

  slashedKeeper.currentStake = slashedKeeper.currentStake.minus(totalSlashAmount);
  slasherKeeper.currentStake = slasherKeeper.currentStake.plus(totalSlashAmount);

  slashedKeeper.save();
  slasherKeeper.save();

  const job = getJobByKey(event.params.jobKey.toHexString());
  job.slashingCount = job.slashingCount.plus(BIG_INT_ONE);
  job.save();
}
