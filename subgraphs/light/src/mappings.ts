import {
  AcceptJobTransfer,
  DepositJobCredits,
  DepositJobOwnerCredits,
  Execute, FinalizeRedeem,
  InitiateJobTransfer, InitiateRedeem,
  JobUpdate, OwnershipTransferred, PPAgentV2Light, RegisterAsKeeper,
  RegisterJob, SetAgentParams,
  SetJobConfig,
  SetJobPreDefinedCalldata, SetJobResolver, SetWorkerAddress, Slash, Stake, WithdrawCompensation,
  WithdrawJobCredits,
  WithdrawJobOwnerCredits,
} from "subgraph-light/generated/PPAgentV2Light/PPAgentV2Light";
import {
  commonHandleAcceptJobTransfer,
  commonHandleDepositJobCredits,
  commonHandleDepositJobOwnerCredits,
  commonHandleExecution, commonHandleFinalizeRedeem,
  commonHandleInitiateJobTransfer, commonHandleInitiateRedeem,
  commonHandleJobUpdate,
  commonHandleRegisterAsKeeper,
  commonHandleRegisterJob,
  commonHandleSetJobConfig,
  commonHandleSetJobPreDefinedCalldata,
  commonHandleSetJobResolver,
  commonHandleSetWorkerAddress, commonHandleSlash, commonHandleStake,
  commonHandleWithdrawCompensation,
  commonHandleWithdrawJobCredits,
  commonHandleWithdrawJobOwnerCredits
} from "../../../common/helpers/mappings";
import {getOrCreateAgent} from "./initializers";
import {
  BIG_INT_ONE, BIG_INT_ZERO, ZERO_ADDRESS,
} from "../../../common/helpers/initializers";

export function handleExecution(event: Execute): void {
  commonHandleExecution(event);
}

export function handleRegisterJob(event: RegisterJob): void {
  commonHandleRegisterJob(event);

  const agent = getOrCreateAgent();
  agent.jobsCount = agent.jobsCount.plus(BIG_INT_ONE);
  agent.save();
}

export function handleJobUpdate(event: JobUpdate): void {
  commonHandleJobUpdate(event);
}

export function handleSetJobConfig(event: SetJobConfig): void {
  commonHandleSetJobConfig(event);
}

export function handleInitiateJobTransfer(event: InitiateJobTransfer): void {
  commonHandleInitiateJobTransfer(event);
}

export function handleAcceptJobTransfer(event: AcceptJobTransfer): void {
  commonHandleAcceptJobTransfer(event);
}


export function handleDepositJobCredits(event: DepositJobCredits): void {
  commonHandleDepositJobCredits(event);
}

export function handleWithdrawJobCredits(event: WithdrawJobCredits): void {
  commonHandleWithdrawJobCredits(event);
}

export function handleDepositJobOwnerCredits(event: DepositJobOwnerCredits): void {
  commonHandleDepositJobOwnerCredits(event);
}

export function handleWithdrawJobOwnerCredits(event: WithdrawJobOwnerCredits): void {
  commonHandleWithdrawJobOwnerCredits(event);
}


export function handleSetJobPreDefinedCalldata(event: SetJobPreDefinedCalldata): void {
  commonHandleSetJobPreDefinedCalldata(event);
}

export function handleSetJobResolver(event: SetJobResolver): void {
  commonHandleSetJobResolver(event);
}


export function handleRegisterAsKeeper(event: RegisterAsKeeper): void {
  commonHandleRegisterAsKeeper(event);

  const agent = getOrCreateAgent();
  agent.lastKeeperId = event.params.keeperId;
  agent.save();
}

export function handleSetWorkerAddress(event: SetWorkerAddress): void {
  commonHandleSetWorkerAddress(event);
}

export function handleWithdrawCompensation(event: WithdrawCompensation): void {
  commonHandleWithdrawCompensation(event);
}

export function handleStake(event: Stake): void {
  commonHandleStake(event);
}

export function handleSlash(event: Slash): void {
  commonHandleSlash(event);
}

export function handleInitiateRedeem(event: InitiateRedeem): void {
  const agent = getOrCreateAgent();
  commonHandleInitiateRedeem(event, agent.pendingWithdrawalTimeoutSeconds);
}

export function handleFinalizeRedeem(event: FinalizeRedeem): void {
  commonHandleFinalizeRedeem(event);
}


export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const agent = getOrCreateAgent();

  // Init block
  if (agent.owner == ZERO_ADDRESS) {
    const agentContract = PPAgentV2Light.bind(event.address);

    // Fetch CVP
    const res1 = agentContract.try_CVP();
    if (res1.reverted) {
      throw new Error('Init: Unable to fetch CVP');
    }
    agent.cvp = res1.value;

    // Fetch minKeeperCVP
    const res2 = agentContract.try_getConfig();
    if (res2.reverted) {
      throw new Error('Init: Unable to fetch config');
    }
    agent.address = event.address;
    agent.minKeeperCVP = res2.value.getMinKeeperCvp_();
    agent.pendingWithdrawalTimeoutSeconds = res2.value.getPendingWithdrawalTimeoutSeconds_();
    agent.feePpm = res2.value.getFeePpm_();
    agent.feeTotal = res2.value.getFeeTotal_();
    agent.lastKeeperId = res2.value.getLastKeeperId_();
    agent.jobsCount = BIG_INT_ZERO;
  }

  agent.owner = event.params.newOwner;
  agent.save();
}

export function handleSetAgentParams(event: SetAgentParams): void {
  const agent = getOrCreateAgent();
  agent.minKeeperCVP = event.params.minKeeperCvp_;
  agent.pendingWithdrawalTimeoutSeconds = event.params.timeoutSeconds_;
  agent.feePpm = event.params.feePct_; // the event has misspelled name "feePct_" but actually means "feePpm_"

  agent.save();
}
