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
} from "../generated/PPAgentV2Randao/PPAgentV2Randao";
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
  OwnershipTransferred as OwnershipTransferredLight,
  SetAgentParams as SetAgentParamsLight,
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
  commonHandleSetWorkerAddress, commonHandleSlash, commonHandleStake, commonHandleWithdrawCompensation,
  commonHandleWithdrawJobCredits,
  commonHandleWithdrawJobOwnerCredits,
} from "./common/mappings";

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
  commonHandleInitiateRedeem(fakeEvent);
}

export function handleFinalizeRedeem(event: FinalizeRedeemRandao): void {
  const fakeEvent: FinalizeRedeemLight = new FinalizeRedeemLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleFinalizeRedeem(fakeEvent);
}


export function handleOwnershipTransferred(event: OwnershipTransferredRandao): void {
  const fakeEvent: OwnershipTransferredLight = new OwnershipTransferredLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleOwnershipTransferred(fakeEvent);
}

export function handleSetAgentParams(event: SetAgentParamsRandao): void {
  const fakeEvent: SetAgentParamsLight = new SetAgentParamsLight(
    event.address, event.logIndex, event.transactionLogIndex, event.logType, event.block, event.transaction,
    event.parameters, event.receipt
  );
  commonHandleSetAgentParams(fakeEvent);
}
