import {
  AcceptJobTransfer,
  DepositJobCredits,
  DepositJobOwnerCredits,
  Execute, FinalizeRedeem,
  InitiateJobTransfer, InitiateRedeem,
  JobUpdate,
  RegisterAsKeeper,
  RegisterJob,
  SetJobConfig,
  SetJobPreDefinedCalldata,
  SetJobResolver,
  SetWorkerAddress, Slash, Stake,
  WithdrawCompensation,
  WithdrawJobCredits,
  WithdrawJobOwnerCredits
} from "../generated/PPAgentV2/PPAgentV2";
import {
  BIG_INT_ONE,
  BIG_INT_ZERO,
  createJob, createJobDeposit, createJobOwnerDeposit, createJobOwnerWithdrawal, createJobWithdrawal,
  createKeeper, createKeeperRedeemFinalize, createKeeperRedeemInit, createKeeperStake,
  getJobByKey,
  getKeeper,
  getOrCreateJobOwner
} from "./common";
import {Execution} from "../generated/schema";
import {BigInt, ByteArray, Bytes} from "@graphprotocol/graph-ts";

export function handleExecution(event: Execute): void {
  const id = event.block.timestamp.toString().concat("-").concat(event.transaction.hash.toHexString());
  let execution = new Execution(id);
  const jobKey = event.params.jobKey.toHexString();
  execution.txCalldata = event.transaction.input;
  const inputString = event.transaction.input.toHexString();
  execution.keeperConfig = BigInt.fromByteArray(ByteArray.fromHexString(inputString.slice(54, 56)));
  execution.txCalldata = event.transaction.input;
  execution.jobCalldata = Bytes.fromHexString(inputString.slice(64, inputString.length));

  execution.txHash = event.transaction.hash;
  execution.block = event.block.number;
  execution.timestamp = event.block.timestamp;
  execution.keeperWorker = event.transaction.from;
  execution.keeper = event.params.keeperId.toString();

  execution.job = jobKey;
  execution.jobAddress = event.params.job;
  execution.binJobAfter = event.params.binJobAfter;
  execution.compensation = event.params.compensation;

  execution.jobGasUsed = event.params.gasUsed;
  execution.txGasLimit = event.transaction.gasLimit;
  execution.baseFee = event.params.baseFee;
  execution.gasPrice = event.params.gasPrice;

  execution.txIndex = event.transaction.index;
  execution.txNonce = event.transaction.nonce;

  const job = getJobByKey(jobKey);
  const jobOwner = getOrCreateJobOwner(job.owner);
  if (job.useJobOwnerCredits) {
    jobOwner.credits = jobOwner.credits.minus(event.params.compensation);
  } else {
    job.credits = job.credits.minus(event.params.compensation);
    job.save();
  }

  if (execution.keeperConfig) {
    const keeper = getKeeper(execution.keeper);
    keeper.compensation = keeper.compensation.plus(event.params.compensation);
  }

  jobOwner.save();
  execution.save();
}

export function handleRegisterJob(event: RegisterJob): void {
  const jobKey = event.params.jobKey.toHexString();
  const job = createJob(jobKey);

  job.active = true;
  job.jobAddress = event.params.jobAddress;
  job.jobId = event.params.jobId;
  job.owner = event.params.owner.toHexString();
  job.jobSelector = event.params.params.jobSelector;

  job.maxBaseFeeGwei = BigInt.fromI32(event.params.params.maxBaseFeeGwei);
  job.rewardPct = BigInt.fromI32(event.params.params.rewardPct);
  job.fixedReward = event.params.params.fixedReward;
  job.calldataSource = BigInt.fromI32(event.params.params.calldataSource);
  job.intervalSeconds = BigInt.fromI32(event.params.params.intervalSeconds);

  job.credits = BIG_INT_ZERO; // should be incremented by a deposit event handler
  job.lastExecutionAt = BIG_INT_ZERO;
  job.minKeeperCVP = event.params.params.jobMinCvp;

  job.useJobOwnerCredits = event.params.params.useJobOwnerCredits;
  job.assertResolverSelector = event.params.params.assertResolverSelector;

  job.depositCount = BIG_INT_ZERO;
  job.withdrawalCount = BIG_INT_ZERO;

  job.save();
}

export function handleJobUpdate(event: JobUpdate): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.minKeeperCVP = event.params.jobMinCvp;
  job.rewardPct = event.params.rewardPct;
  job.fixedReward = event.params.fixedReward;
  job.maxBaseFeeGwei = event.params.maxBaseFeeGwei;
  job.intervalSeconds = event.params.intervalSeconds;

  job.save();
}

export function handleSetJobConfig(event: SetJobConfig): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.active = event.params.isActive_;
  job.useJobOwnerCredits = event.params.useJobOwnerCredits_;
  job.assertResolverSelector = event.params.assertResolverSelector_;

  job.save();
}

export function handleInitiateJobTransfer(event: InitiateJobTransfer): void {
  const job = getJobByKey(event.params.jobKey.toHexString());
  job.pendingOwner = event.params.to.toHexString();
  job.save();
}

export function handleAcceptJobTransfer(event: AcceptJobTransfer): void {
  const job = getJobByKey(event.params.jobKey_.toHexString());

  job.owner = event.params.to_.toHexString();
  job.pendingOwner = null;

  job.save();
}

export function handleDepositJobCredits(event: DepositJobCredits): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  const depositKey = event.params.jobKey.toHexString().concat("-").concat(job.depositCount.toString());
  const deposit = createJobDeposit(depositKey);
  deposit.job = event.params.jobKey.toHexString();
  deposit.depositor = event.params.depositor;
  deposit.amount = event.params.amount;
  deposit.fee = event.params.fee;
  deposit.total = event.params.fee.plus(event.params.amount);
  deposit.save();

  job.credits = job.credits.plus(event.params.amount);
  job.depositCount = job.depositCount.plus(BIG_INT_ONE);
  job.save();
}

export function handleWithdrawJobCredits(event: WithdrawJobCredits): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  const withdrawalKey = event.params.jobKey.toHexString().concat("-").concat(job.withdrawalCount.toString());
  const withdrawal = createJobWithdrawal(withdrawalKey);
  withdrawal.job = event.params.jobKey.toHexString();
  withdrawal.owner = event.params.owner;
  withdrawal.to = event.params.to;
  withdrawal.amount = event.params.amount;
  withdrawal.save();

  job.credits = job.credits.minus(event.params.amount);
  job.withdrawalCount = job.withdrawalCount.plus(BIG_INT_ONE);
  job.save();
}

export function handleDepositJobOwnerCredits(event: DepositJobOwnerCredits): void {
  const jobOwner = getOrCreateJobOwner(event.params.jobOwner.toHexString());

  const depositKey = event.params.jobOwner.toHexString().concat("-").concat(jobOwner.depositCount.toString());
  const deposit = createJobOwnerDeposit(depositKey);
  deposit.jobOwner = event.params.jobOwner.toHexString();
  deposit.amount = event.params.amount;
  deposit.fee = event.params.fee;
  deposit.total = event.params.fee.plus(event.params.amount);
  deposit.save();

  jobOwner.credits = jobOwner.credits.plus(event.params.amount);
  jobOwner.depositCount = jobOwner.depositCount.plus(BIG_INT_ONE);
  jobOwner.save();
}

export function handleWithdrawJobOwnerCredits(event: WithdrawJobOwnerCredits): void {
  const jobOwner = getOrCreateJobOwner(event.params.jobOwner.toHexString());

  const withdrawalKey = event.params.jobOwner.toHexString().concat("-").concat(jobOwner.withdrawalCount.toString());
  const withdrawal = createJobOwnerWithdrawal(withdrawalKey);
  withdrawal.jobOwner = event.params.jobOwner.toHexString();
  withdrawal.to = event.params.to;
  withdrawal.amount = event.params.amount;
  withdrawal.save();

  jobOwner.credits = jobOwner.credits.minus(event.params.amount);
  jobOwner.withdrawalCount = jobOwner.withdrawalCount.plus(BIG_INT_ONE);
  jobOwner.save();
}

export function handleSetJobPreDefinedCalldata(event: SetJobPreDefinedCalldata): void {
  const job = getJobByKey(event.params.jobKey.toHexString());
  job.preDefinedCalldata = event.params.preDefinedCalldata;
  job.save();
}

export function handleSetJobResolver(event: SetJobResolver): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.resolverAddress = event.params.resolverAddress;
  job.resolverCalldata = event.params.resolverCalldata;

  job.save();
}

export function handleRegisterAsKeeper(event: RegisterAsKeeper): void {
  const keeper = createKeeper(event.params.keeperId.toString());

  keeper.admin = event.params.keeperAdmin;
  keeper.worker = event.params.keeperWorker;

  keeper.slashedStake = BIG_INT_ZERO;
  keeper.currentStake = BIG_INT_ZERO;
  keeper.compensation = BIG_INT_ZERO;
  keeper.pendingWithdrawalAmount = BIG_INT_ZERO;
  keeper.pendingWithdrawalEndAt = BIG_INT_ZERO;

  keeper.stakeCount = BIG_INT_ZERO;
  keeper.redeemInitCount = BIG_INT_ZERO;
  keeper.redeemFinalizeCount = BIG_INT_ZERO;

  keeper.save();
}

export function handleSetWorkerAddress(event: SetWorkerAddress): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.worker = event.params.worker;
  keeper.save();
}

export function handleWithdrawCompensation(event: WithdrawCompensation): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.compensation = keeper.compensation.minus(event.params.amount);
  keeper.save();
}

export function handleStake(event: Stake): void {
  const keeper = getKeeper(event.params.keeperId.toString());

  const stakeKey = event.params.keeperId.toString().concat("-").concat(keeper.stakeCount.toString());
  const stake = createKeeperStake(stakeKey);
  stake.keeper = event.params.keeperId.toString();
  stake.staker = event.params.staker;
  stake.amount = event.params.amount;
  stake.save();

  keeper.compensation = keeper.compensation.plus(event.params.amount);
  keeper.stakeCount = keeper.stakeCount.plus(BIG_INT_ONE);
  keeper.save();
}

export function handleSlash(event: Slash): void {
  const keeper = getKeeper(event.params.keeperId.toString());

  keeper.currentStake = keeper.currentStake.minus(event.params.currentAmount);
  keeper.slashedStake = keeper.slashedStake.plus(event.params.currentAmount);

  keeper.pendingWithdrawalAmount = keeper.pendingWithdrawalAmount.minus(event.params.pendingAmount);

  keeper.save();
}

export function handleInitiateRedeem(event: InitiateRedeem): void {
  const keeper = getKeeper(event.params.keeperId.toString());

  const initKey = keeper.id.toString().concat("-").concat(keeper.redeemInitCount.toString());
  const init = createKeeperRedeemInit(initKey);
  init.keeper = event.params.keeperId.toString();
  init.inputAmount = event.params.redeemAmount;
  init.slashedStakeReduction = event.params.slashedStakeAmount;
  init.stakeReduction = event.params.stakeAmount;
  init.initiatedAt = event.block.timestamp;
  init.availableAt = event.block.timestamp;
  // TODO: track pendingWithdrawalAfter using a global singleton
  init.save();

  const stakeOfToReduceAmount = event.params.redeemAmount.minus(keeper.slashedStake);
  keeper.currentStake = keeper.currentStake.minus(stakeOfToReduceAmount);
  keeper.pendingWithdrawalAmount = keeper.pendingWithdrawalAmount.plus(stakeOfToReduceAmount);

  keeper.slashedStake = BIG_INT_ZERO;
  // TODO: track pendingWithdrawalAfter using a global singleton

  keeper.redeemInitCount = keeper.redeemInitCount.plus(BIG_INT_ONE);

  keeper.save();
}

export function handleFinalizeRedeem(event: FinalizeRedeem): void {
  const keeper = getKeeper(event.params.keeperId.toString());

  const finalizeKey = keeper.id.toString().concat("-").concat(keeper.redeemFinalizeCount.toString());
  const finalize = createKeeperRedeemFinalize(finalizeKey);
  finalize.keeper = event.params.keeperId.toString();
  finalize.to = event.params.beneficiary;
  finalize.amount = event.params.amount;
  finalize.save();

  keeper.pendingWithdrawalAmount = BIG_INT_ZERO;
  keeper.pendingWithdrawalEndAt = BIG_INT_ZERO;
  keeper.redeemFinalizeCount = keeper.redeemFinalizeCount.plus(BIG_INT_ONE);

  keeper.save();
}
