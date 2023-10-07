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
} from "subgraph-light/generated/PPAgentV2Light/PPAgentV2Light";
import {
  BIG_INT_ONE, BIG_INT_TWO,
  BIG_INT_ZERO,
  createJob, createJobDeposit, createJobOwnerDeposit, createJobOwnerWithdrawal, createJobWithdrawal,
  createKeeper, createKeeperRedeemFinalize, createKeeperRedeemInit, createKeeperStake,
  getJobByKey,
  getKeeper,
  getOrCreateJobOwner
} from "./initializers";
import {Execution} from "subgraph-light/generated/schema";
import {BigInt, ByteArray, Bytes} from "@graphprotocol/graph-ts";

const FLAG_ACCRUE_REWARD = BIG_INT_TWO;

export function commonHandleExecution(event: Execute): void {
  const id = event.transaction.hash.toHexString();
  let execution = new Execution(id);
  const jobKey = event.params.jobKey.toHexString();
  execution.txCalldata = event.transaction.input;
  const inputString = event.transaction.input.toHexString();
  execution.keeperConfig = BigInt.fromByteArray(ByteArray.fromHexString(inputString.slice(56, 58)));
  execution.txCalldata = event.transaction.input;
  execution.jobCalldata = Bytes.fromHexString(inputString.slice(64, inputString.length));

  execution.createTxHash = event.transaction.hash;
  execution.block = event.block.number;
  execution.createdAt = event.block.timestamp;
  execution.keeperWorker = event.transaction.from;
  execution.keeper = event.params.keeperId.toString();

  execution.job = jobKey;
  execution.jobAddress = event.params.job;
  execution.binJobAfter = event.params.binJobAfter;
  execution.compensation = event.params.compensation;

  execution.jobGasUsed = event.params.gasUsed;
  execution.txGasUsed = event.receipt!.gasUsed;
  execution.txGasLimit = event.transaction.gasLimit;
  execution.baseFee = event.params.baseFee;
  execution.gasPrice = event.params.gasPrice;
  execution.profit = BIG_INT_ZERO;
  if (execution.txGasUsed.gt(BIG_INT_ZERO)) {
    execution.expenses = execution.gasPrice.times(execution.txGasUsed);
    execution.profit = event.params.compensation.minus(execution.expenses);
  }

  execution.txIndex = event.transaction.index;
  execution.txNonce = event.transaction.nonce;

  const job = getJobByKey(jobKey);
  const jobOwner = getOrCreateJobOwner(job.owner);

  execution.jobOwner = job.owner;

  if (job.useJobOwnerCredits) {
    jobOwner.credits = jobOwner.credits.minus(event.params.compensation);
  } else {
    job.credits = job.credits.minus(event.params.compensation);
  }
  job.totalCompensations = job.totalCompensations.plus(event.params.compensation);
  job.totalExpenses = job.totalExpenses.plus(execution.expenses);
  job.lastExecutionAt = event.block.timestamp;
  job.totalProfit = job.totalProfit.plus(execution.profit);
  job.executionCount = job.executionCount.plus(BIG_INT_ONE);
  job.save();

  const keeper = getKeeper(execution.keeper);
  if (execution.keeperConfig.bitAnd(FLAG_ACCRUE_REWARD) != BIG_INT_ZERO) {
    keeper.compensationsToWithdraw = keeper.compensationsToWithdraw.plus(event.params.compensation);
  }

  keeper.compensations = keeper.compensations.plus(execution.compensation);
  keeper.expenses = keeper.expenses.plus(execution.expenses);
  keeper.profit = keeper.profit.plus(execution.profit);

  keeper.executionCount = keeper.executionCount.plus(BIG_INT_ONE);

  jobOwner.save();
  execution.save();
  keeper.save();
}

export function commonHandleRegisterJob(event: RegisterJob): void {
  const jobKey = event.params.jobKey.toHexString();
  const job = createJob(jobKey);
  const jobOwner = getOrCreateJobOwner(event.params.owner.toHexString());

  jobOwner.save();

  job.createTxHash = event.transaction.hash;
  job.createdAt = event.block.timestamp;
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

  job.totalCompensations = BIG_INT_ZERO;
  job.totalProfit = BIG_INT_ZERO;
  job.totalExpenses = BIG_INT_ZERO;

  job.executionCount = BIG_INT_ZERO;
  job.executionRevertCount = BIG_INT_ZERO;
  job.slashingCount = BIG_INT_ZERO;
  job.depositCount = BIG_INT_ZERO;
  job.withdrawalCount = BIG_INT_ZERO;

  job.jobCreatedAt = event.block.timestamp;
  job.jobNextKeeperId = BIG_INT_ZERO;
  job.jobReservedSlasherId = BIG_INT_ZERO;
  job.jobSlashingPossibleAfter = BIG_INT_ZERO;

  job.save();
}

export function commonHandleJobUpdate(event: JobUpdate): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.minKeeperCVP = event.params.jobMinCvp;
  job.rewardPct = event.params.rewardPct;
  job.fixedReward = event.params.fixedReward;
  job.maxBaseFeeGwei = event.params.maxBaseFeeGwei;
  job.intervalSeconds = event.params.intervalSeconds;

  job.save();
}

export function commonHandleSetJobConfig(event: SetJobConfig): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.active = event.params.isActive_;
  job.useJobOwnerCredits = event.params.useJobOwnerCredits_;
  job.assertResolverSelector = event.params.assertResolverSelector_;

  job.save();
}

export function commonHandleInitiateJobTransfer(event: InitiateJobTransfer): void {
  const job = getJobByKey(event.params.jobKey.toHexString());
  job.pendingOwner = event.params.to.toHexString();
  job.save();
}

export function commonHandleAcceptJobTransfer(event: AcceptJobTransfer): void {
  const job = getJobByKey(event.params.jobKey_.toHexString());

  job.owner = event.params.to_.toHexString();
  job.pendingOwner = null;

  job.save();
}

export function commonHandleDepositJobCredits(event: DepositJobCredits): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  const depositKey = event.params.jobKey.toHexString().concat("-").concat(job.depositCount.toString());
  const deposit = createJobDeposit(depositKey);
  deposit.job = event.params.jobKey.toHexString();
  deposit.createTxHash = event.transaction.hash;
  deposit.depositor = event.params.depositor;
  deposit.amount = event.params.amount;
  deposit.fee = event.params.fee;
  deposit.total = event.params.fee.plus(event.params.amount);
  deposit.createdAt = event.block.timestamp;
  deposit.save();

  job.credits = job.credits.plus(event.params.amount);
  job.depositCount = job.depositCount.plus(BIG_INT_ONE);
  job.save();
}

export function commonHandleWithdrawJobCredits(event: WithdrawJobCredits): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  const withdrawalKey = event.params.jobKey.toHexString().concat("-").concat(job.withdrawalCount.toString());
  const withdrawal = createJobWithdrawal(withdrawalKey);
  withdrawal.job = event.params.jobKey.toHexString();
  withdrawal.createTxHash = event.transaction.hash;
  withdrawal.owner = event.params.owner;
  withdrawal.to = event.params.to;
  withdrawal.amount = event.params.amount;
  withdrawal.createdAt = event.block.timestamp;
  withdrawal.save();

  job.credits = job.credits.minus(event.params.amount);
  job.withdrawalCount = job.withdrawalCount.plus(BIG_INT_ONE);
  job.save();
}

export function commonHandleDepositJobOwnerCredits(event: DepositJobOwnerCredits): void {
  const jobOwner = getOrCreateJobOwner(event.params.jobOwner.toHexString());

  const depositKey = event.params.jobOwner.toHexString().concat("-").concat(jobOwner.depositCount.toString());
  const deposit = createJobOwnerDeposit(depositKey);
  deposit.jobOwner = event.params.jobOwner.toHexString();
  deposit.createTxHash = event.transaction.hash;
  deposit.amount = event.params.amount;
  deposit.fee = event.params.fee;
  deposit.total = event.params.fee.plus(event.params.amount);
  deposit.createdAt = event.block.timestamp;
  deposit.depositor = event.params.depositor;
  deposit.save();

  jobOwner.credits = jobOwner.credits.plus(event.params.amount);
  jobOwner.depositCount = jobOwner.depositCount.plus(BIG_INT_ONE);
  jobOwner.save();
}

export function commonHandleWithdrawJobOwnerCredits(event: WithdrawJobOwnerCredits): void {
  const jobOwner = getOrCreateJobOwner(event.params.jobOwner.toHexString());

  const withdrawalKey = event.params.jobOwner.toHexString().concat("-").concat(jobOwner.withdrawalCount.toString());
  const withdrawal = createJobOwnerWithdrawal(withdrawalKey);
  withdrawal.createTxHash = event.transaction.hash;
  withdrawal.jobOwner = event.params.jobOwner.toHexString();
  withdrawal.to = event.params.to;
  withdrawal.amount = event.params.amount;
  withdrawal.createdAt = event.block.timestamp;
  withdrawal.save();

  jobOwner.credits = jobOwner.credits.minus(event.params.amount);
  jobOwner.withdrawalCount = jobOwner.withdrawalCount.plus(BIG_INT_ONE);
  jobOwner.save();
}

export function commonHandleSetJobPreDefinedCalldata(event: SetJobPreDefinedCalldata): void {
  const job = getJobByKey(event.params.jobKey.toHexString());
  job.preDefinedCalldata = event.params.preDefinedCalldata;
  job.save();
}

export function commonHandleSetJobResolver(event: SetJobResolver): void {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.resolverAddress = event.params.resolverAddress;
  job.resolverCalldata = event.params.resolverCalldata;

  job.save();
}

export function commonHandleRegisterAsKeeper(event: RegisterAsKeeper): void {
  const keeperId = event.params.keeperId.toString();
  const keeper = createKeeper(keeperId);

  keeper.createTxHash = event.transaction.hash;
  keeper.createdAt = event.block.timestamp;
  keeper.active = false;
  keeper.numericalId = BigInt.fromString(keeperId);
  keeper.admin = event.params.keeperAdmin;
  keeper.worker = event.params.keeperWorker;

  keeper.slashedStake = BIG_INT_ZERO;
  keeper.currentStake = BIG_INT_ZERO;
  keeper.compensationsToWithdraw = BIG_INT_ZERO;
  keeper.compensations = BIG_INT_ZERO;
  keeper.expenses = BIG_INT_ZERO;
  keeper.profit = BIG_INT_ZERO;
  keeper.pendingWithdrawalAmount = BIG_INT_ZERO;
  keeper.pendingWithdrawalEndsAt = BIG_INT_ZERO;
  keeper.keeperActivationCanBeFinalizedAt = BIG_INT_ZERO;
  keeper.executionCount = BIG_INT_ZERO;

  keeper.stakeCount = BIG_INT_ZERO;
  keeper.redeemInitCount = BIG_INT_ZERO;
  keeper.redeemFinalizeCount = BIG_INT_ZERO;
  keeper.compensationWithdrawalCount = BIG_INT_ZERO;

  keeper.save();
}

export function commonHandleSetWorkerAddress(event: SetWorkerAddress): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.worker = event.params.worker;
  keeper.save();
}

export function commonHandleWithdrawCompensation(event: WithdrawCompensation): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.compensationsToWithdraw = keeper.compensationsToWithdraw.minus(event.params.amount);
  keeper.save();
}

export function commonHandleStake(event: Stake): void {
  const keeper = getKeeper(event.params.keeperId.toString());

  const stakeKey = event.params.keeperId.toString().concat("-").concat(keeper.stakeCount.toString());
  const stake = createKeeperStake(stakeKey);
  stake.createTxHash = event.transaction.hash;
  stake.keeper = event.params.keeperId.toString();
  stake.staker = event.params.staker;
  stake.amount = event.params.amount;
  stake.createdAt = event.block.timestamp;
  stake.save();

  keeper.currentStake = keeper.currentStake.plus(event.params.amount);
  keeper.stakeCount = keeper.stakeCount.plus(BIG_INT_ONE);
  keeper.save();
}

export function commonHandleSlash(event: Slash): void {
  const keeper = getKeeper(event.params.keeperId.toString());

  keeper.currentStake = keeper.currentStake.minus(event.params.currentAmount);
  keeper.slashedStake = keeper.slashedStake.plus(event.params.currentAmount);

  keeper.pendingWithdrawalAmount = keeper.pendingWithdrawalAmount.minus(event.params.pendingAmount);

  keeper.save();
}

export function commonHandleInitiateRedeem(event: InitiateRedeem, pendingWithdrawalTimeoutSeconds: BigInt): BigInt {
  const keeper = getKeeper(event.params.keeperId.toString());

  const initKey = keeper.id.toString().concat("-").concat(keeper.redeemInitCount.toString());
  const init = createKeeperRedeemInit(initKey);
  init.createTxHash = event.transaction.hash;
  init.createdAt = event.block.timestamp;
  init.keeper = event.params.keeperId.toString();
  init.inputAmount = event.params.redeemAmount;
  init.slashedStakeReduction = event.params.slashedStakeAmount;
  init.stakeReduction = event.params.stakeAmount;
  init.initiatedAt = event.block.timestamp;
  init.availableAt = event.block.timestamp.plus(pendingWithdrawalTimeoutSeconds);
  init.cooldownSeconds = pendingWithdrawalTimeoutSeconds;
  init.save();

  const stakeOfToReduceAmount = event.params.redeemAmount.minus(keeper.slashedStake);
  keeper.currentStake = keeper.currentStake.minus(stakeOfToReduceAmount);
  keeper.pendingWithdrawalAmount = keeper.pendingWithdrawalAmount.plus(stakeOfToReduceAmount);
  keeper.pendingWithdrawalEndsAt = event.block.timestamp.plus(pendingWithdrawalTimeoutSeconds);

  keeper.slashedStake = BIG_INT_ZERO;

  keeper.redeemInitCount = keeper.redeemInitCount.plus(BIG_INT_ONE);

  keeper.save();

  return stakeOfToReduceAmount;
}

export function commonHandleFinalizeRedeem(event: FinalizeRedeem): void {
  const keeper = getKeeper(event.params.keeperId.toString());

  const finalizeKey = keeper.id.toString().concat("-").concat(keeper.redeemFinalizeCount.toString());
  const finalize = createKeeperRedeemFinalize(finalizeKey);
  finalize.createTxHash = event.transaction.hash;
  finalize.keeper = event.params.keeperId.toString();
  finalize.to = event.params.beneficiary;
  finalize.amount = event.params.amount;
  finalize.createdAt = event.block.timestamp;
  finalize.save();

  keeper.pendingWithdrawalAmount = BIG_INT_ZERO;
  keeper.pendingWithdrawalEndsAt = BIG_INT_ZERO;
  keeper.redeemFinalizeCount = keeper.redeemFinalizeCount.plus(BIG_INT_ONE);

  keeper.save();
}
