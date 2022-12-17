import {Execution} from "../../generated/schema";
import {Execute} from "../../generated/PPAgentV2/PPAgentV2";

export function handleExecution(event: Execute): void {
  const id = event.block.timestamp.toString().concat("-").concat(event.transaction.hash.toHexString());
  let execution = new Execution(id);

  execution.transactionHash = event.transaction.hash;
  execution.block = event.block.number;
  execution.timestamp = event.block.timestamp;

  execution.keeperWorker = event.transaction.from;
  execution.keeperId = event.params.keeperId;

  execution.save();
}
