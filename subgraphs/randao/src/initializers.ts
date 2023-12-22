import {Agent as RandaoAgent, Job} from "../generated/schema";
import {
  BIG_INT_ONE,
  BIG_INT_ZERO,
  createJobOwner, createKeeper,
  ZERO_ADDRESS
} from "../../../common/helpers/initializers";
import {Bytes} from "@graphprotocol/graph-ts";

const AGENT_ID = "Agent";

export function getOrCreateRandaoAgent(): RandaoAgent {
  let randaoAgent = RandaoAgent.load(AGENT_ID);
  if (!randaoAgent) {
    randaoAgent = new RandaoAgent(AGENT_ID);

    randaoAgent.jobsCount = BIG_INT_ZERO;
    randaoAgent.keepersCount = BIG_INT_ZERO;
    randaoAgent.activeKeepersCount = BIG_INT_ZERO;
    randaoAgent.executionsCount = BIG_INT_ZERO;
    randaoAgent.stakeCount = BIG_INT_ZERO;
    randaoAgent.activeJobsCount = BIG_INT_ZERO;
    randaoAgent.jobsBalanceCount = BIG_INT_ZERO;
    randaoAgent.jobOwnersCount = BIG_INT_ZERO;
    randaoAgent.paidCount = BIG_INT_ZERO;
    randaoAgent.profitCount = BIG_INT_ZERO;
    randaoAgent.address = ZERO_ADDRESS;
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
    randaoAgent.jobFixedRewardFinney = BIG_INT_ZERO;

    // Creating zero job owners when creating randao agent
    const zeroJobOwner = createJobOwner(ZERO_ADDRESS.toHexString());
    zeroJobOwner.save();
    // Create zero keeper when creating randao agent
    createZeroKeeper();
  }

  return randaoAgent;
}

function createZeroKeeper(): void {
  const zeroKeeper = createKeeper('0');
  zeroKeeper.createTxHash = Bytes.empty();
  zeroKeeper.createdAt = BIG_INT_ZERO;
  zeroKeeper.active = false;
  zeroKeeper.keeperActivationCanBeFinalizedAt = BIG_INT_ZERO;
  zeroKeeper.numericalId = BIG_INT_ZERO;
  zeroKeeper.admin = ZERO_ADDRESS;
  zeroKeeper.worker = ZERO_ADDRESS;
  zeroKeeper.currentStake = BIG_INT_ZERO;
  zeroKeeper.slashedStake = BIG_INT_ZERO;
  zeroKeeper.getBySlashStake = BIG_INT_ZERO;
  zeroKeeper.slashedStakeCounter = BIG_INT_ZERO;
  zeroKeeper.getBySlashStakeCounter = BIG_INT_ZERO;
  zeroKeeper.assignedJobsCount = BIG_INT_ZERO;
  zeroKeeper.compensationsToWithdraw = BIG_INT_ZERO;
  zeroKeeper.pendingWithdrawalAmount = BIG_INT_ZERO;
  zeroKeeper.pendingWithdrawalEndsAt = BIG_INT_ZERO;
  zeroKeeper.executionCount = BIG_INT_ZERO;

  zeroKeeper.compensations = BIG_INT_ZERO;
  zeroKeeper.expenses = BIG_INT_ZERO;
  zeroKeeper.profit = BIG_INT_ZERO;

  zeroKeeper.stakeCount = BIG_INT_ZERO;
  zeroKeeper.redeemInitCount = BIG_INT_ZERO;
  zeroKeeper.redeemFinalizeCount = BIG_INT_ZERO;
  zeroKeeper.compensationWithdrawalCount = BIG_INT_ZERO;
  zeroKeeper.save();
}

export function getJobByKey(jobKey: string): Job {
  let job = Job.load(jobKey)
  if (!job) {
    throw new Error(`Job with a key ${jobKey} should exist`);
  }
  return job
}

