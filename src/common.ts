import {BigInt, Bytes} from "@graphprotocol/graph-ts";
import {Job, JobOwner} from "../generated/schema";

export const BIG_INT_ZERO = BigInt.zero();

export function createJobByKey(jobKey: string): Job {
  let pool = Job.load(jobKey)
  if (pool) {
    throw new Error(`Job with a key ${jobKey} already exists`);
  }
  return new Job(jobKey);
}

export function getJobByKey(jobKey: string): Job {
  let pool = Job.load(jobKey)
  if (!pool) {
    throw new Error(`Job with a key ${jobKey} should exist`);
  }
  return pool
}

export function getOrCreateJobOwner(ownerAddress: string): JobOwner {
  let jobOwner = JobOwner.load(ownerAddress)
  if (!jobOwner) {
    return new JobOwner(ownerAddress);
  }
  return jobOwner;
}
