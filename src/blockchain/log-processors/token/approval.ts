import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../../types";
import { augurEmitter } from "../../../events";

export function processApprovalLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  // TODO divide value by numTicks for share tokens transfer logs
  const tokenApprovalDataToInsert = {
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    owner:           log.owner,
    spender:         log.spender,
    token:           log.address,
    value:           log.value,
    blockNumber:     log.blockNumber,
  };
  augurEmitter.emit("TokenApproval", tokenApprovalDataToInsert);
  db.transacting(trx).insert(tokenApprovalDataToInsert).into("approvals").asCallback(callback);
}

export function processApprovalLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("TokenApproval", log);
  db.transacting(trx).from("approvals").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
}
