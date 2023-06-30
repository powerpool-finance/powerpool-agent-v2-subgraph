import {
  Execute as ExecuteRandao,
  RegisterJob as RegisterJobRandao,
  JobUpdate as JobUpdateRandao,
  SetJobConfig as SetJobConfigRandao,
  InitiateJobTransfer as InitiateJobTransferRandao,
  AcceptJobTransfer as AcceptJobTransferRandao,
  DepositJobCredits as DepositJobCreditsRandao,
  WithdrawJobCredits as WithdrawJobCreditsRandao,
  DepositJobOwnerCredits as DepositJobOwnerCreditsRandao,
  WithdrawJobOwnerCredits as WithdrawJobOwnerCreditsRandao,
  SetJobResolver as SetJobResolverRandao,
  SetJobPreDefinedCalldata as SetJobPreDefinedCalldataRandao,
  RegisterAsKeeper as RegisterAsKeeperRandao,
  SetWorkerAddress as SetWorkerAddressRandao,
  WithdrawCompensation as WithdrawCompensationRandao,
  Stake as StakeRandao,
  Slash as SlashRandao,
  InitiateRedeem as InitiateRedeemRandao,
  FinalizeRedeem as FinalizeRedeemRandao,
  OwnershipTransferred as OwnershipTransferredRandao,
  SetAgentParams as SetAgentParamsRandao,
  SetRdConfig,
  PPAgentV2Randao,
  JobKeeperChanged,
  InitiateSlashing,
  DisableKeeper,
  InitiateKeeperActivation,
  FinalizeKeeperActivation,
  ExecutionReverted,
} from "subgraph-randao/generated/PPAgentV2Randao/PPAgentV2Randao";
import {
  Execute as ExecuteLight,
  RegisterJob as RegisterJobLight,
  JobUpdate as JobUpdateLight,
  SetJobConfig as SetJobConfigLight,
  InitiateJobTransfer as InitiateJobTransferLight,
  AcceptJobTransfer as AcceptJobTransferLight,
  DepositJobCredits as DepositJobCreditsLight,
  WithdrawJobCredits as WithdrawJobCreditsLight,
  DepositJobOwnerCredits as DepositJobOwnerCreditsLight,
  WithdrawJobOwnerCredits as WithdrawJobOwnerCreditsLight,
  SetJobResolver as SetJobResolverLight,
  SetJobPreDefinedCalldata as SetJobPreDefinedCalldataLight,
  RegisterAsKeeper as RegisterAsKeeperLight,
  SetWorkerAddress as SetWorkerAddressLight,
  WithdrawCompensation as WithdrawCompensationLight,
  Stake as StakeLight,
  Slash as SlashLight,
  InitiateRedeem as InitiateRedeemLight,
  FinalizeRedeem as FinalizeRedeemLight,
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
  commonHandleSetWorkerAddress, commonHandleSlash, commonHandleStake, commonHandleWithdrawCompensation,
  commonHandleWithdrawJobCredits,
  commonHandleWithdrawJobOwnerCredits,
} from "../../../common/helpers/mappings";
import {BigInt} from "@graphprotocol/graph-ts";
import {getOrCreateRandaoAgent, getJobByKey} from "./initializers";
import {
  BIG_INT_ONE, BIG_INT_ZERO, getKeeper, ZERO_ADDRESS,
} from "../../../common/helpers/initializers";
import { ExecutionRevert } from "../generated/schema";

export function handleExecution(event: ExecuteRandao): void {
  const fakeEvent: ExecuteLight = new ExecuteLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleExecution(fakeEvent);
}

export function handleRegisterJob(event: RegisterJobRandao): void {
  const fakeEvent: RegisterJobLight = new RegisterJobLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleRegisterJob(fakeEvent);

  const agent = getOrCreateRandaoAgent();
  agent.jobsCount = agent.jobsCount.plus(BIG_INT_ONE);
  agent.save();
}

export function handleJobUpdate(event: JobUpdateRandao): void {
  const fakeEvent: JobUpdateLight = new JobUpdateLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleJobUpdate(fakeEvent);
}

export function handleSetJobConfig(event: SetJobConfigRandao): void {
  const fakeEvent: SetJobConfigLight = new SetJobConfigLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSetJobConfig(fakeEvent);
}

export function handleInitiateJobTransfer(event: InitiateJobTransferRandao): void {
  const fakeEvent: InitiateJobTransferLight = new InitiateJobTransferLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleInitiateJobTransfer(fakeEvent);
}

export function handleAcceptJobTransfer(event: AcceptJobTransferRandao): void {
  const fakeEvent: AcceptJobTransferLight = new AcceptJobTransferLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleAcceptJobTransfer(fakeEvent);
}


export function handleDepositJobCredits(event: DepositJobCreditsRandao): void {
  const fakeEvent: DepositJobCreditsLight = new DepositJobCreditsLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleDepositJobCredits(fakeEvent);
}

export function handleWithdrawJobCredits(event: WithdrawJobCreditsRandao): void {
  const fakeEvent: WithdrawJobCreditsLight = new WithdrawJobCreditsLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleWithdrawJobCredits(fakeEvent);
}

export function handleDepositJobOwnerCredits(event: DepositJobOwnerCreditsRandao): void {
  const fakeEvent: DepositJobOwnerCreditsLight = new DepositJobOwnerCreditsLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleDepositJobOwnerCredits(fakeEvent);
}

export function handleWithdrawJobOwnerCredits(event: WithdrawJobOwnerCreditsRandao): void {
  const fakeEvent: WithdrawJobOwnerCreditsLight = new WithdrawJobOwnerCreditsLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleWithdrawJobOwnerCredits(fakeEvent);
}


export function handleSetJobPreDefinedCalldata(event: SetJobPreDefinedCalldataRandao): void {
  const fakeEvent: SetJobPreDefinedCalldataLight = new SetJobPreDefinedCalldataLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSetJobPreDefinedCalldata(fakeEvent);
}

export function handleSetJobResolver(event: SetJobResolverRandao): void {
  const fakeEvent: SetJobResolverLight = new SetJobResolverLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSetJobResolver(fakeEvent);
}


export function handleRegisterAsKeeper(event: RegisterAsKeeperRandao): void {
  const fakeEvent: RegisterAsKeeperLight = new RegisterAsKeeperLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleRegisterAsKeeper(fakeEvent);

  const agent = getOrCreateRandaoAgent();
  agent.lastKeeperId = event.params.keeperId;
  agent.save();
}

export function handleSetWorkerAddress(event: SetWorkerAddressRandao): void {
  const fakeEvent: SetWorkerAddressLight = new SetWorkerAddressLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSetWorkerAddress(fakeEvent);
}

export function handleWithdrawCompensation(event: WithdrawCompensationRandao): void {
  const fakeEvent: WithdrawCompensationLight = new WithdrawCompensationLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleWithdrawCompensation(fakeEvent);
}

export function handleStake(event: StakeRandao): void {
  const fakeEvent: StakeLight = new StakeLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleStake(fakeEvent);
}

export function handleSlash(event: SlashRandao): void {
  const fakeEvent: SlashLight = new SlashLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSlash(fakeEvent);
}

export function handleInitiateRedeem(event: InitiateRedeemRandao): void {
  const fakeEvent: InitiateRedeemLight = new InitiateRedeemLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  const agent = getOrCreateRandaoAgent();
  commonHandleInitiateRedeem(fakeEvent, agent.pendingWithdrawalTimeoutSeconds);
}

export function handleFinalizeRedeem(event: FinalizeRedeemRandao): void {
  const fakeEvent: FinalizeRedeemLight = new FinalizeRedeemLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleFinalizeRedeem(fakeEvent);
}


export function handleOwnershipTransferred(event: OwnershipTransferredRandao): void {
  const agent = getOrCreateRandaoAgent();

  // Init block
  if (agent.owner == ZERO_ADDRESS) {
    const agentContract = PPAgentV2Randao.bind(event.address);

    // Fetch CVP
    const res1 = agentContract.try_CVP();
    if (res1.reverted) {
      throw new Error('Init: Unable to fetch CVP');
    }
    agent.cvp = res1.value;
  }

  agent.owner = event.params.newOwner;
  agent.save();
}

export function handleSetAgentParams(event: SetAgentParamsRandao): void {
  const agent = getOrCreateRandaoAgent();

  agent.minKeeperCVP = event.params.minKeeperCvp_;
  agent.pendingWithdrawalTimeoutSeconds = event.params.timeoutSeconds_;
  agent.feePpm = event.params.feePpm_;

  agent.save();
}

/****** RANDAO-SPECIFIC HANDLERS ******/
export function handleSetRdConfig(event: SetRdConfig): void {
  const randaoAgent = getOrCreateRandaoAgent();
  randaoAgent.slashingEpochBlocks = BigInt.fromI32(event.params.rdConfig.slashingEpochBlocks);
  randaoAgent.period1 = BigInt.fromI32(event.params.rdConfig.period1);
  randaoAgent.period2 = BigInt.fromI32(event.params.rdConfig.period2);
  randaoAgent.slashingFeeFixedCVP = BigInt.fromI32(event.params.rdConfig.slashingFeeFixedCVP);
  randaoAgent.slashingFeeBps = BigInt.fromI32(event.params.rdConfig.slashingFeeBps);
  randaoAgent.jobMinCreditsFinney = BigInt.fromI32(event.params.rdConfig.jobMinCreditsFinney);
  randaoAgent.agentMaxCvpStake = event.params.rdConfig.agentMaxCvpStake;
  randaoAgent.jobCompensationMultiplierBps = BigInt.fromI32(event.params.rdConfig.jobCompensationMultiplierBps);
  randaoAgent.stakeDivisor = event.params.rdConfig.stakeDivisor;
  randaoAgent.keeperActivationTimeoutHours = BigInt.fromI32(event.params.rdConfig.keeperActivationTimeoutHours);
  randaoAgent.save();
}

export function handleJobKeeperChanged(event: JobKeeperChanged): void {
  const job = getJobByKey(event.params.jobKey.toHexString());
  job.jobNextKeeperId = event.params.keeperTo;
  job.save();
}

export function handleInitiateSlashing(event: InitiateSlashing): void {
  const job = getJobByKey(event.params.jobKey.toHexString());
  job.jobReservedSlasherId = event.params.slasherKeeperId;
  job.jobSlashingPossibleAfter = event.params.jobSlashingPossibleAfter;

  job.save();
}

export function handleDisableKeeper(event: DisableKeeper): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.active = false;

  keeper.save();
}

export function handleInitKeeperActivation(event: InitiateKeeperActivation): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.keeperActivationCanBeFinalizedAt = event.params.canBeFinalizedAt;

  keeper.save();
}

export function handleFinalizeKeeperActivation(event: FinalizeKeeperActivation): void {
  const keeper = getKeeper(event.params.keeperId.toString());
  keeper.keeperActivationCanBeFinalizedAt = BIG_INT_ZERO;
  keeper.active = true;

  keeper.save();
}

export function handleExecutionReverted(event: ExecutionReverted): void {
  const id = event.transaction.hash.toString();
  const revert = new ExecutionRevert(id);

  revert.txHash = event.transaction.hash;
  revert.txIndex = event.transaction.index;
  revert.txNonce = event.transaction.nonce;
  revert.executionResponse = event.params.executionReturndata;

  revert.job = event.params.jobKey.toString();
  revert.keeper = event.params.keeperId.toString();

  revert.save();

  // const job = getJobByKey(event.params.jobKey.toHexString());
  // job.credits.minus(event.params.compensation)

  // job.save();
}
