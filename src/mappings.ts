import {
  AcceptJobTransfer, DepositJobCredits, DepositJobOwnerCredits, Execute,
  InitiateJobTransfer,
  JobUpdate,
  RegisterJob,
  SetJobConfig, SetJobPreDefinedCalldata, SetJobResolver, WithdrawJobCredits, WithdrawJobOwnerCredits
} from "../generated/PPAgentV2/PPAgentV2";
import {BIG_INT_ZERO, createJobByKey, getJobByKey, getOrCreateJobOwner} from "./common";
import {Execution} from "../generated/schema";
import {BigInt} from "@graphprotocol/graph-ts";

export function handleExecution(event: Execute): void {
  const id = event.block.timestamp.toString().concat("-").concat(event.transaction.hash.toHexString());
  let execution = new Execution(id);
  const jobKey = event.params.jobKey.toHexString();

  execution.txHash = event.transaction.hash;
  execution.block = event.block.number;
  execution.timestamp = event.block.timestamp;
  execution.keeperWorker = event.transaction.from;
  execution.keeperId = event.params.keeperId;

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

  jobOwner.save();
  execution.save();
}

export function handleRegisterJob(event: RegisterJob): void {
  const jobKey = event.params.jobKey.toHexString();
  const job = createJobByKey(jobKey);

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
  job.credits = job.credits.plus(event.params.amount);
  job.save();
}

export function handleWithdrawJobCredits(event: WithdrawJobCredits): void {
  const job = getJobByKey(event.params.jobKey.toHexString());
  job.credits = job.credits.minus(event.params.amount);
  job.save();
}

export function handleDepositJobOwnerCredits(event: DepositJobOwnerCredits): void {
  const jobOwner = getOrCreateJobOwner(event.params.jobOwner.toHexString());
  jobOwner.credits = jobOwner.credits.plus(event.params.amount);
  jobOwner.save();
}

export function handleWithdrawJobOwnerCredits(event: WithdrawJobOwnerCredits): void {
  const jobOwner = getOrCreateJobOwner(event.params.jobOwner.toHexString());
  jobOwner.credits = jobOwner.credits.minus(event.params.amount);
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
