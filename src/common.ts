import {BigInt, Bytes} from "@graphprotocol/graph-ts";
import {Job, JobDeposit, JobOwner, JobWithdrawal, Keeper} from "../generated/schema";

export const BIG_INT_ZERO = BigInt.zero();
export const BIG_INT_ONE = BigInt.fromI32(1);

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

export function getOrCreateJobOwner(ownerAddress: string): JobOwner {
  let jobOwner = JobOwner.load(ownerAddress)
  if (!jobOwner) {
    jobOwner = new JobOwner(ownerAddress);
    jobOwner.credits = BIG_INT_ZERO;
  }
  return jobOwner;
}

export function createKeeper(id: string): Keeper {
  let keeper = Keeper.load(id)
  if (keeper) {
    throw new Error(`Keeper with address ${id} already exists`);
  }
  return new Keeper(id);
}

export function getKeeper(id: string): Keeper {
  let keeper = Keeper.load(id)
  if (!keeper) {
    throw new Error(`Keeper with address ${id} does not exists`);
  }
  return keeper;
}

export function createJobDeposit(id: string): JobDeposit {
  let jobDeposit = JobDeposit.load(id)
  if (jobDeposit) {
    throw new Error(`JobDeposit with the key ${id} already exists`);
  }
  return new JobDeposit(id);
}

export function createJobWithdrawal(id: string): JobWithdrawal {
  let jobWithdrawal = JobWithdrawal.load(id)
  if (jobWithdrawal) {
    throw new Error(`JobWithdrawal with the key ${id} already exists`);
  }
  return new JobWithdrawal(id);
}
