import {
  IIsoBayPattern,
  TYesNo,
} from "../../models/base/types/IPositionPatterns";
import ILidData, { ILidDataFromStaf } from "../../models/v1/parts/ILidData";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { pad2 } from "../../helpers/pad";

// A STAF file describes a hatch cover ("lid") once per ISO bay it sits over, even when
// the physical lid actually spans several adjacent bays. Each per-bay record repeats the
// same `label` for all bays under that one physical lid, and carries `joinLidFwdLabel` /
// `joinLidAftLabel` pointers to the neighboring bay's record so the full bay range can be
// reconstructed. This function turns those per-bay STAF records back into one OVD lid per
// physical hatch cover, with a single startIsoBay/endIsoBay range.
export default function transformLids(lidData: ILidDataFromStaf[]): ILidData[] {
  const lidsByLabel: { [name: string]: ILidDataTemp } = {};

  const result = joinAftFwdLids(lidData, lidsByLabel);

  return result;
}

function joinAftFwdLids(
  lidDataFromStaf: ILidDataFromStaf[],
  lidsByLabel: { [name: string]: ILidDataTemp },
): ILidData[] {
  if (!lidDataFromStaf || lidDataFromStaf.length === 0) {
    return [];
  }

  // Step 1: index every per-bay STAF lid record by its label. At this point each record
  // still covers just its own single bay, so startIsoBay and endIsoBay are both set to
  // that one isoBay - the loop below is what widens them to the lid's true extent.
  // (Two unrelated lids can legally share the same label, e.g. after a missing/blank
  // label falls back to a generated one; when that happens the second record is stored
  // under a synthetic `L##` key instead of overwriting the first.)
  lidDataFromStaf.forEach((lid, idx) => {
    const label = lid.label || `L${pad2(idx)}`;
    const newLid = {
      label,
      level: lid.level,
      portIsoRow: lid.portIsoRow,
      starboardIsoRow: lid.starboardIsoRow,
      overlapPort: lid.overlapPort ? 1 : (0 as TYesNo),
      overlapStarboard: lid.overlapStarboard ? 1 : (0 as TYesNo),
      startIsoBay: lid.isoBay,
      endIsoBay: lid.isoBay,
      joinLidFwdLabel: lid.joinLidFwdLabel,
      joinLidAftLabel: lid.joinLidAftLabel,
    };

    if (!lidsByLabel[label]) {
      lidsByLabel[label] = newLid;
    } else {
      lidsByLabel[`L${pad2(idx)}`] = newLid;
    }
  });

  Object.keys(lidsByLabel).forEach((label) => {
    // Join FWD: `joinLidFwdLabel` points to the record for the bay immediately toward
    // the bow. If that neighboring record's startIsoBay is further forward (a lower bay
    // number) than what we currently have, pull our startIsoBay back to match it - this
    // is how the lid's range grows forward one bay at a time as neighbors are chained.
    if (lidsByLabel[label].joinLidFwdLabel) {
      const joinLidFwdLabel = lidsByLabel[label].joinLidFwdLabel;
      const currentStartIsoBay = Number(lidsByLabel[label].startIsoBay);

      if (lidsByLabel[joinLidFwdLabel]) {
        const proposedStartIsoBay = Number(
          lidsByLabel[joinLidFwdLabel].startIsoBay,
        );
        if (proposedStartIsoBay < currentStartIsoBay)
          lidsByLabel[label].startIsoBay =
            lidsByLabel[joinLidFwdLabel].startIsoBay;
      }
    }

    // Join AFT: mirror image of the FWD block above. `joinLidAftLabel` points to the
    // record for the bay immediately toward the stern. If that neighbor's endIsoBay
    // extends further aft (a higher bay number) than what we currently have, grow our
    // endIsoBay to match it.
    if (lidsByLabel[label].joinLidAftLabel) {
      const joinLidAftLabel = lidsByLabel[label].joinLidAftLabel;

      const strCurrentEndIsoBay = lidsByLabel[label].endIsoBay;
      const strProposedEndIsoBay = lidsByLabel[joinLidAftLabel]?.endIsoBay;

      if (
        strCurrentEndIsoBay !== undefined &&
        strProposedEndIsoBay !== undefined
      ) {
        const currentEndIsoBay = Number(strCurrentEndIsoBay);
        const proposedEndIsoBay = Number(strProposedEndIsoBay);

        if (proposedEndIsoBay > currentEndIsoBay)
          lidsByLabel[label].endIsoBay = strProposedEndIsoBay;
      }
    }
  });

  // Step 2: after joining, some entries (e.g. ones created under a synthetic `L##` key
  // above, or partially-joined duplicates) can end up describing an identical lid -
  // same bay range, level and rows. Hash each lid on those fields and keep only the
  // first record for each distinct hash, discarding the rest as duplicates.
  const hashes: Set<string> = new Set();
  Object.keys(lidsByLabel).forEach((label) => {
    const obj = lidsByLabel[label];
    const hash = `${obj.startIsoBay}/${obj.endIsoBay}/${obj.level}/${obj.portIsoRow}/${obj.starboardIsoRow}`;
    obj.hash = hash;
    hashes.add(hash);
  });

  const result = Object.keys(lidsByLabel)
    .filter((k) => {
      const hash = lidsByLabel[k].hash;
      if (hash && hashes.has(hash)) {
        hashes.delete(hash);
        return true;
      }
      return false;
    })
    .map((k) => {
      // Strip the STAF-only bookkeeping fields (join labels, hash) before handing the
      // lid off to the rest of the OVD pipeline.
      const { joinLidFwdLabel, joinLidAftLabel, hash, ...newLidData } =
        lidsByLabel[k];
      return newLidData;
    });

  return justOneLevel(result as ILidDataWithLevel[]);
}

// STAF stores a lid record per level (ABOVE/BELOW) even though a physical lid sits at
// one level only; the same bay boundary can therefore show up carrying both an ABOVE
// and a BELOW record. This function picks a single winning level per bay boundary and
// discards the lid record(s) for the other level at that boundary.
function justOneLevel(lidData: ILidDataWithLevel[]): ILidData[] {
  const isoBays: { [name: IIsoBayPattern]: Set<BayLevelEnum> } = {};
  const levelPerBay: { [name: string]: BayLevelEnum } = {};
  // For every bay that appears as a lid's start or end boundary, collect which
  // level(s) (ABOVE/BELOW) have a lid touching that boundary.
  lidData.forEach((lid) => {
    if (!isoBays[lid.startIsoBay]) isoBays[lid.startIsoBay] = new Set();
    if (!isoBays[lid.endIsoBay]) isoBays[lid.endIsoBay] = new Set();
    isoBays[lid.startIsoBay].add(lid.level);
    isoBays[lid.endIsoBay].add(lid.level);
  });

  Object.keys(isoBays).forEach((bay) => {
    const levels = isoBays[bay as IIsoBayPattern];
    const v = Array.from(levels);
    // Use min because the Enum has below=2 and above=1
    levelPerBay[bay] = Math.min.apply(null, v);
  });

  // Keep a lid only if its own level matches the winning level at either of its
  // boundaries (i.e. it wasn't shadowed by a lid of the other level at that bay), then
  // drop the now-redundant `level` field and any 0/false overlap flags from the output.
  return lidData
    .filter(
      (lid) =>
        levelPerBay[lid.startIsoBay] === lid.level ||
        levelPerBay[lid.endIsoBay] === lid.level,
    )
    .map((lid) => {
      // Remove level
      const { level, ...withoutLevel } = lid;
      // Clean
      if (!withoutLevel.overlapPort) delete withoutLevel.overlapPort;
      if (!withoutLevel.overlapStarboard) delete withoutLevel.overlapStarboard;
      return withoutLevel;
    });
}

interface ILidDataTemp extends ILidData {
  joinLidFwdLabel?: string;
  joinLidAftLabel?: string;
  hash?: string;
  level?: BayLevelEnum;
}

interface ILidDataWithLevel extends ILidData {
  level: BayLevelEnum;
}
