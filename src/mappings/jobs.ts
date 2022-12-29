import {
  AcceptJobTransfer, DepositJobCredits, DepositJobOwnerCredits,
  InitiateJobTransfer,
  JobUpdate,
  RegisterJob,
  SetJobConfig, WithdrawJobCredits, WithdrawJobOwnerCredits
} from "../../generated/PPAgentV2/PPAgentV2";
import {BIG_INT_ZERO, createJobByKey, getJobByKey, getOrCreateJobOwner} from "./common";

export function handleRegisterJob(event: RegisterJob) {
  const jobKey = event.params.jobKey.toHexString();
  const job = createJobByKey(jobKey);

  job.active = true;
  job.jobAddress = event.params.jobAddress;
  job.jobId = event.params.jobId;
  job.owner = event.params.owner.toHexString();
  job.jobSelector = event.params.params.jobSelector;

  job.maxBaseFeeGwei = event.params.params.maxBaseFeeGwei;
  job.rewardPct = event.params.params.rewardPct;
  job.fixedReward = event.params.params.fixedReward;
  job.calldataSource = event.params.params.calldataSource;
  job.intervalSeconds = event.params.params.intervalSeconds;

  job.credits = BIG_INT_ZERO; // should be incremented by a deposit event handler
  job.lastExecutionAt = BIG_INT_ZERO;
  job.minKeeperCVP = event.params.params.jobMinCvp;

  job.useJobOwnerCredits = event.params.params.useJobOwnerCredits;
  job.assertResolverSelector = event.params.params.assertResolverSelector;

  job.save();
}

export function handleJobUpdate(event: JobUpdate) {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.minKeeperCVP = event.params.jobMinCvp;
  job.rewardPct = event.params.rewardPct;
  job.fixedReward = event.params.fixedReward;
  job.maxBaseFeeGwei = event.params.maxBaseFeeGwei;
  job.intervalSeconds = event.params.intervalSeconds;

  job.save();
}

export function handleSetJobConfig(event: SetJobConfig) {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.active = event.params.isActive_;
  job.useJobOwnerCredits = event.params.useJobOwnerCredits_;
  job.assertResolverSelector = event.params.assertResolverSelector_;

  job.save();
}

export function handleInitiateJobTransfer(event: InitiateJobTransfer) {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.pendingOwner = event.params.to.toHexString();

  job.save();
}

export function handleAcceptJobTransfer(event: AcceptJobTransfer) {
  const job = getJobByKey(event.params.jobKey_.toHexString());

  job.owner = event.params.to_.toHexString();
  job.pendingOwner = null;

  job.save();
}

export function handleDepositJobCredits(event: DepositJobCredits) {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.credits = job.credits.plus(event.params.amount);

  job.save();
}

export function handleWithdrawJobCredits(event: WithdrawJobCredits) {
  const job = getJobByKey(event.params.jobKey.toHexString());

  job.credits = job.credits.minus(event.params.amount);

  job.save();
}

export function handleDepositJobOwnerCredits(event: DepositJobOwnerCredits) {
  const jobOwner = getOrCreateJobOwner(event.params.jobOwner.toHexString());

  jobOwner.credits = jobOwner.credits.plus(event.params.amount);

  jobOwner.save();
}

export function handleWithdrawJobOwnerCredits(event: WithdrawJobOwnerCredits) {
  const jobOwner = getOrCreateJobOwner(event.params.jobOwner.toHexString());

  jobOwner.credits = jobOwner.credits.minus(event.params.amount);

  jobOwner.save();
}
