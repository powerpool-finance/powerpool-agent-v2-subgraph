import {Address, BigInt, Bytes} from "@graphprotocol/graph-ts";
import {
  Execution,
  Job,
  JobDeposit,
  JobOwner,
  JobOwnerDeposit,
  JobOwnerWithdrawal,
  JobWithdrawal,
  Keeper,
  KeeperRedeemFinalize,
  KeeperRedeemInit,
  KeeperStake
} from "subgraph-light/generated/schema";

export const BIG_INT_ZERO = BigInt.zero();
export const BIG_INT_ONE = BigInt.fromI32(1);
export const BIG_INT_TWO = BigInt.fromI32(2);
export const ZERO_ADDRESS = Address.zero();

export function createJob(jobKey: string): Job {
  let job = Job.load(jobKey)
  if (job) {
    throw new Error(`Job with a key ${jobKey} already exists`);
  }
  return new Job(jobKey);
}

export function getJobByKey(jobKey: string): Job {
  let job = Job.load(jobKey)
  if (!job) {
    throw new Error(`Job with a key ${jobKey} should exist`);
  }
  return job
}

export function getCertainJobByKey(jobKey: string): Job {
  // load in block used when we are certain entity created in the same block, so graph won't try access database and save time while indexing
  let job = Job.loadInBlock(jobKey)
  if (!job) {
    throw new Error(`Job with a key ${jobKey} should exist`);
  }
  return job
}

export function getJobOwner(ownerAddress: string): JobOwner {
  const jobOwner = JobOwner.load(ownerAddress)
  if (!jobOwner) {
    throw new Error(`JobOwner with a key ${ownerAddress} should exist`);
  }
  return jobOwner;
}

export function getOrCreateJobOwner(ownerAddress: string): JobOwner {
  let jobOwner = JobOwner.load(ownerAddress)
  if (!jobOwner) {
    jobOwner = new JobOwner(ownerAddress);
    jobOwner.credits = BIG_INT_ZERO;
    jobOwner.depositCount = BIG_INT_ZERO;
    jobOwner.withdrawalCount = BIG_INT_ZERO;
  }
  return jobOwner;
}

export function createKeeper(id: string): Keeper {
  let keeper = Keeper.load(id);
  if (keeper) {
    throw new Error(`Keeper with address ${id} already exists`);
  }
  return new Keeper(id);
}

export function getExecution(id: string): Execution {
  let execution = Execution.load(id)
  if (!execution) {
    throw new Error(`Execution with address ${id} does not exists`);
  }
  return execution;
}

export function getCertainExecution(id: string): Execution {
  // load in block used when we are certain entity created in the same block, so graph won't try access database and save time while indexing
  let execution = Execution.loadInBlock(id);
  if (!execution) {
    throw new Error(`Execution with address ${id} does not exists`);
  }
  return execution;
}

export function getKeeper(id: string): Keeper {
  let keeper = Keeper.load(id)
  if (!keeper) {
    throw new Error(`Keeper with address ${id} does not exists`);
  }
  return keeper;
}

export function getCertainKeeper(id: string): Keeper {
  // load in block used when we are certain entity created in the same block, so graph won't try access database and save time while indexing
  let keeper = Keeper.loadInBlock(id)
  if (!keeper) {
    throw new Error(`Keeper with address ${id} does not exists`);
  }
  return keeper;
}

export function createJobDeposit(id: string): JobDeposit {
  let deposit = JobDeposit.load(id)
  if (deposit) {
    throw new Error(`JobDeposit with the key ${id} already exists`);
  }
  return new JobDeposit(id);
}

export function createJobWithdrawal(id: string): JobWithdrawal {
  let withdrawal = JobWithdrawal.load(id)
  if (withdrawal) {
    throw new Error(`JobWithdrawal with the key ${id} already exists`);
  }
  return new JobWithdrawal(id);
}

export function createJobOwnerDeposit(id: string): JobOwnerDeposit {
  let deposit = JobOwnerDeposit.load(id)
  if (deposit) {
    throw new Error(`JobOwnerDeposit with the key ${id} already exists`);
  }
  return new JobOwnerDeposit(id);
}

export function createJobOwnerWithdrawal(id: string): JobOwnerWithdrawal {
  let withdrawal = JobOwnerWithdrawal.load(id)
  if (withdrawal) {
    throw new Error(`JobOwnerWithdrawal with the key ${id} already exists`);
  }
  return new JobOwnerWithdrawal(id);
}

export function createKeeperStake(id: string): KeeperStake {
  let stake = KeeperStake.load(id)
  if (stake) {
    throw new Error(`KeeperStake with the key ${id} already exists`);
  }
  return new KeeperStake(id);
}

export function createKeeperRedeemInit(id: string): KeeperRedeemInit {
  let init = KeeperRedeemInit.load(id)
  if (init) {
    throw new Error(`KeeperRedeemInit with the key ${id} already exists`);
  }
  return new KeeperRedeemInit(id);
}

export function createKeeperRedeemFinalize(id: string): KeeperRedeemFinalize {
  let finalize = KeeperRedeemFinalize.load(id)
  if (finalize) {
    throw new Error(`KeeperRedeemFinalize with the key ${id} already exists`);
  }
  return new KeeperRedeemFinalize(id);
}
