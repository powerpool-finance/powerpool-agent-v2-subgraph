import {Agent, Job} from "../generated/schema";

const AGENT_ID = "Agent";
import {
  BIG_INT_ONE, BIG_INT_ZERO, ZERO_ADDRESS,
} from "../../../common/helpers/initializers";

export function getOrCreateAgent(): Agent {
  let agent = Agent.load(AGENT_ID);
  if (!agent) {
    agent = new Agent(AGENT_ID);
    agent.jobsCount = BIG_INT_ONE;
    agent.address = ZERO_ADDRESS;
    agent.owner = ZERO_ADDRESS;
    agent.cvp = ZERO_ADDRESS;
    agent.feeTotal = BIG_INT_ZERO;
    agent.feePpm = BIG_INT_ZERO;
    agent.minKeeperCVP = BIG_INT_ZERO;
    agent.lastKeeperId = BIG_INT_ZERO;
    agent.pendingWithdrawalTimeoutSeconds = BIG_INT_ZERO;
  }
  return agent;
}

export function getJobByKey(jobKey: string): Job {
  let job = Job.load(jobKey)
  if (!job) {
    throw new Error(`Job with a key ${jobKey} should exist`);
  }
  return job
}

