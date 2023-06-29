import {Agent as RandaoAgent, Job, ExecutionRevert} from "../generated/schema";
import { ExecutionReverted as RevertEvent } from "subgraph-randao/generated/PPAgentV2Randao/PPAgentV2Randao";
import {
  BIG_INT_ONE,
  BIG_INT_ZERO,
  ZERO_ADDRESS
} from "../../../common/helpers/initializers";

const AGENT_ID = "Agent";

export function getOrCreateRandaoAgent(): RandaoAgent {
  let randaoAgent = RandaoAgent.load(AGENT_ID);
  if (!randaoAgent) {
    randaoAgent = new RandaoAgent(AGENT_ID);

    randaoAgent.jobsCount = BIG_INT_ONE;
    randaoAgent.owner = ZERO_ADDRESS;
    randaoAgent.cvp = ZERO_ADDRESS;
    randaoAgent.feeTotal = BIG_INT_ZERO;
    randaoAgent.feePpm = BIG_INT_ZERO;
    randaoAgent.minKeeperCVP = BIG_INT_ZERO;
    randaoAgent.lastKeeperId = BIG_INT_ZERO;
    randaoAgent.pendingWithdrawalTimeoutSeconds = BIG_INT_ZERO;

    randaoAgent.slashingEpochBlocks = BIG_INT_ZERO;
    randaoAgent.period1 = BIG_INT_ZERO;
    randaoAgent.period2 = BIG_INT_ZERO;
    randaoAgent.slashingFeeFixedCVP = BIG_INT_ZERO;
    randaoAgent.slashingFeeBps = BIG_INT_ZERO;
    randaoAgent.jobMinCreditsFinney = BIG_INT_ZERO;
    randaoAgent.agentMaxCvpStake = BIG_INT_ZERO;
    randaoAgent.jobCompensationMultiplierBps = BIG_INT_ZERO;
    randaoAgent.stakeDivisor = BIG_INT_ZERO;
    randaoAgent.keeperActivationTimeoutHours = BIG_INT_ZERO;
  }

  return randaoAgent;
}

export function getJobByKey(jobKey: string): Job {
  let job = Job.load(jobKey)
  if (!job) {
    throw new Error(`Job with a key ${jobKey} should exist`);
  }
  return job
}

export function createExecutionRevert(event: RevertEvent): ExecutionRevert {
  const id = event.transaction.hash.toString();
  const revert = new ExecutionRevert(id);

  revert.txHash = event.transaction.hash;
  revert.txIndex = event.transaction.index;
  revert.txNonce = event.transaction.nonce;
  revert.executionResponse = event.params.executionReturndata;

  revert.job = event.params.jobKey.toString();
  revert.keeper = event.params.keeperId.toString();

  return revert;
}

