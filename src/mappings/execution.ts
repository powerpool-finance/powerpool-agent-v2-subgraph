import {Execution} from "../../generated/schema";
import {Execute} from "../../generated/PPAgentV2/PPAgentV2";

export function handleExecution(event: Execute): void {
  const id = event.block.timestamp.toString().concat("-").concat(event.transaction.hash.toHexString());
  let execution = new Execution(id);

  execution.txHash = event.transaction.hash;
  execution.block = event.block.number;
  execution.timestamp = event.block.timestamp;
  execution.keeperWorker = event.transaction.from;
  execution.keeperId = event.params.keeperId;

  execution.jobKey = event.params.jobKey;
  execution.job = event.params.job;
  execution.binJobAfter = event.params.binJobAfter;
  execution.compensation = event.params.compensation;

  execution.jobGasUsed = event.params.gasUsed;
  execution.txGasLimit = event.transaction.gasLimit;
  execution.baseFee = event.params.baseFee;
  execution.gasPrice = event.params.gasPrice;

  execution.txIndex = event.transaction.index;
  execution.txNonce = event.transaction.nonce;

  execution.save();
}
