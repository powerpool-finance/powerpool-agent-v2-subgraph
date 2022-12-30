import {BigInt, Bytes} from "@graphprotocol/graph-ts";
import {Job, JobOwner, Keeper} from "../generated/schema";

export const BIG_INT_ZERO = BigInt.zero();

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
