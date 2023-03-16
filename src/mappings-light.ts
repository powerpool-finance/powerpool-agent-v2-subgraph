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
} from "../generated/PPAgentV2Light/PPAgentV2Light";
import {
  commonHandleAcceptJobTransfer,
  commonHandleDepositJobCredits,
  commonHandleDepositJobOwnerCredits,
  commonHandleExecution, commonHandleFinalizeRedeem,
  commonHandleInitiateJobTransfer, commonHandleInitiateRedeem,
  commonHandleJobUpdate, commonHandleOwnershipTransferred,
  commonHandleRegisterAsKeeper,
  commonHandleRegisterJob, commonHandleSetAgentParams,
  commonHandleSetJobConfig,
  commonHandleSetJobPreDefinedCalldata,
  commonHandleSetJobResolver,
  commonHandleSetWorkerAddress, commonHandleSlash, commonHandleStake,
  commonHandleWithdrawCompensation,
  commonHandleWithdrawJobCredits,
  commonHandleWithdrawJobOwnerCredits
} from "./common/mappings";
import {
  BIG_INT_ONE, BIG_INT_ZERO,
  createJobDeposit, createJobOwnerDeposit, createJobOwnerWithdrawal,
  createJobWithdrawal, createKeeper, createKeeperRedeemFinalize, createKeeperRedeemInit, createKeeperStake,
  getJobByKey, getKeeper, getOrCreateAgent,
  getOrCreateJobOwner, ZERO_ADDRESS
} from "./common/initializers";
import {BigInt} from "@graphprotocol/graph-ts";

export function handleExecution(event: Execute): void {
  commonHandleExecution(event);
}

export function handleRegisterJob(event: RegisterJob): void {
  commonHandleRegisterJob(event);
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
  commonHandleInitiateRedeem(event);
}

export function handleFinalizeRedeem(event: FinalizeRedeem): void {
  commonHandleFinalizeRedeem(event);
}


export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  commonHandleOwnershipTransferred(event);
}

export function handleSetAgentParams(event: SetAgentParams): void {
  commonHandleSetAgentParams(event);
}
