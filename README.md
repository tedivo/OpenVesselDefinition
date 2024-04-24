<img src="https://tedivo.com/images/logos/logo_Definition-horizontal-color.svg" width="320" height="75" alt="Open Vessel Definition" />

# Open Vessel Definition

Open Source definition / schema / specification of Container Vessel characteristics.

[![Tests](https://github.com/tedivo/OpenVesselDefinition/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/tedivo/OpenVesselDefinition/actions/workflows/main.yml)

## Tools

- TEDIVO LLC's interactive Vessel Designer at https://designer.tedivo.com

## License

M.I.T. License.

<img src="https://tedivo.com/images/illustrations/open-source.png" alt="Open Source" width="188" height="111" />

## Json Schema

[Download the Json Schema](https://github.com/tedivo/OpenVesselDefinition/blob/master/schema.json)

```json
{
  "$ref": "#/definitions/IOpenVesselDefinitionV1",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "IOpenVesselDefinitionV1": {
      "additionalProperties": false,
      "properties": {
        "$schema": {
          "type": "string"
        },
        "$schemaId": {
          "enum": ["OpenVesselDefinition", "IOpenVesselDefinitionV1"],
          "type": "string"
        },
        "baysData": {
          "items": {
            "$ref": "#/definitions/IBayLevelData"
          },
          "type": "array"
        },
        "lidData": {
          "items": {
            "$ref": "#/definitions/ILidData"
          },
          "type": "array"
        },
        "positionLabels": {
          "$ref": "#/definitions/IPositionLabels"
        },
        "shipData": {
          "$ref": "#/definitions/IShipData"
        },
        "sizeSummary": {
          "$ref": "#/definitions/ISizeSummary"
        },
        "version": {
          "$ref": "#/definitions/TVersion"
        }
      },
      "required": [
        "$schema",
        "$schemaId",
        "baysData",
        "lidData",
        "positionLabels",
        "shipData",
        "sizeSummary",
        "version"
      ],
      "type": "object"
    },
    "BayLevelEnum": {
      "description": "Bay Level. ABOVE = 1, BELOW = 2, TWINDECK = 3",
      "enum": [1, 2, 3],
      "type": "number"
    },
    "ForeAftEnum": {
      "description": "Fore Aft Enum. FWD = 1, AFT = 2",
      "enum": [1, 2],
      "type": "number"
    },
    "IAcceptsContainers": {
      "$ref": "#/definitions/Partial%3Cindexed-type-1364282619-642-705-1364282619-633-706-1364282619-380-707-1364282619-0-1427%3E",
      "description": "Dictionary of sizes. Value can be 0/1 (1 means the size is allowed) or an object of type  {@link  ISlotSizeOptions } . When this later object is present it's equivalent to value 1 (the size is allowed)."
    },
    "IBayLevelData": {
      "additionalProperties": false,
      "description": "Contains the information of a Bay and a Level (i.e. 003 - Above)",
      "properties": {
        "athwartShip": {
          "$ref": "#/definitions/TYesNo"
        },
        "bulkhead": {
          "$ref": "#/definitions/IBulkheadInfo"
        },
        "centerLineRow": {
          "$ref": "#/definitions/TYesNo",
          "description": "Does it has Center Line Row (00)?"
        },
        "doors": {
          "$ref": "#/definitions/ForeAftEnum",
          "description": "Where should the doors be. FWD or AFT"
        },
        "engineRmBulkFore": {
          "$ref": "#/definitions/TYesNo"
        },
        "foreHatch": {
          "$ref": "#/definitions/TYesNo"
        },
        "heatSrcFore": {
          "$ref": "#/definitions/TYesNo"
        },
        "ignitionSrcFore": {
          "$ref": "#/definitions/TYesNo"
        },
        "infoByContLength": {
          "$ref": "#/definitions/TRowInfoByLength",
          "description": "Dictionary: contains information that applies to all rows by container Length"
        },
        "isoBay": {
          "$ref": "#/definitions/IIsoBayPattern",
          "description": "3 digits ISO Bay"
        },
        "label20": {
          "type": "string"
        },
        "label40": {
          "type": "string"
        },
        "lashingBridges": {
          "description": "Number of Lashing bridges TIERS -only for ABOVE-",
          "type": "number"
        },
        "level": {
          "$ref": "#/definitions/BayLevelEnum",
          "description": "Above, Below"
        },
        "meta": {
          "additionalProperties": false,
          "properties": {
            "notes": {
              "type": "string"
            }
          },
          "type": "object"
        },
        "pairedBay": {
          "$ref": "#/definitions/ForeAftEnum",
          "description": "Refers to the Bay (not the current one). If it's FWD, it means current is AFT"
        },
        "perRowInfo": {
          "$ref": "#/definitions/TBayRowInfo",
          "description": "Dictionary: contains information per Row number (i.e. \"04\") like maxTier, minTier, maxWeight..."
        },
        "perSlotInfo": {
          "$ref": "#/definitions/IBaySlotData",
          "description": "Dictionary: contains information per Slot (i.e. \"0078\")"
        },
        "quartersFore": {
          "$ref": "#/definitions/TYesNo"
        },
        "reeferPlugLimit": {
          "type": "number"
        },
        "reeferPlugs": {
          "$ref": "#/definitions/ForeAftEnum",
          "description": "Where are the reefer plugs. FWD or AFT"
        },
        "telescoping": {
          "$ref": "#/definitions/TYesNo"
        },
        "ventilated": {
          "$ref": "#/definitions/TYesNo"
        }
      },
      "required": ["infoByContLength", "isoBay", "level"],
      "type": "object"
    },
    "IBayRowInfo": {
      "additionalProperties": false,
      "properties": {
        "bottomBase": {
          "type": "number"
        },
        "isoRow": {
          "$ref": "#/definitions/IIsoRowPattern"
        },
        "label": {
          "type": "string"
        },
        "maxHeight": {
          "type": "number"
        },
        "rowInfoByLength": {
          "$ref": "#/definitions/TRowInfoByLength",
          "description": "Overrides general bay LCG and Row Weight by length"
        },
        "tcg": {
          "type": "number"
        }
      },
      "required": ["isoRow"],
      "type": "object"
    },
    "IBaySlotData": {
      "additionalProperties": {
        "$ref": "#/definitions/ISlotData"
      },
      "type": "object"
    },
    "IBulkheadInfo": {
      "additionalProperties": false,
      "properties": {
        "aft": {
          "$ref": "#/definitions/TYesNo"
        },
        "aftLcg": {
          "type": "number"
        },
        "fore": {
          "$ref": "#/definitions/TYesNo"
        },
        "foreLcg": {
          "type": "number"
        }
      },
      "type": "object"
    },
    "IDangerousAndHazardous": {
      "additionalProperties": false,
      "properties": {
        "compatibilityGroups": {
          "description": "All the Class 1 compatibility groups allowed",
          "items": {
            "$ref": "#/definitions/TCompatibilityGroups"
          },
          "type": "array"
        },
        "imdgClasses": {
          "description": "All the available IMDG Classes for this ship",
          "items": {
            "$ref": "#/definitions/TImdgClasses"
          },
          "type": "array"
        },
        "unNumbers": {
          "description": "All the restricted UN Numbers allowed",
          "items": {
            "$ref": "#/definitions/TUnNumber"
          },
          "type": "array"
        }
      },
      "required": ["imdgClasses", "compatibilityGroups"],
      "type": "object"
    },
    "IFeaturesAllowed": {
      "additionalProperties": false,
      "properties": {
        "slotConeRequired": {
          "type": "boolean"
        },
        "slotCoolStowProhibited": {
          "type": "boolean"
        },
        "slotHazardousProhibited": {
          "type": "boolean"
        }
      },
      "required": [
        "slotCoolStowProhibited",
        "slotHazardousProhibited",
        "slotConeRequired"
      ],
      "type": "object"
    },
    "IIsoBayPattern": {
      "description": "ISO Bay pattern: 3 numbers",
      "type": "string"
    },
    "IIsoRowPattern": {
      "description": "ISO Row pattern: 2 numbers",
      "type": "string"
    },
    "IJoinedRowTierPattern": {
      "type": ["string"]
    },
    "ILCGOptions": {
      "additionalProperties": false,
      "properties": {
        "lpp": {
          "type": "number"
        },
        "orientationIncrease": {
          "$ref": "#/definitions/ForeAftEnum"
        },
        "originalDataSource": {
          "additionalProperties": false,
          "properties": {
            "orientationIncrease": {
              "$ref": "#/definitions/ForeAftEnum"
            },
            "reference": {
              "$ref": "#/definitions/LcgReferenceEnum"
            }
          },
          "type": "object"
        },
        "reference": {
          "$ref": "#/definitions/LcgReferenceEnum"
        },
        "values": {
          "$ref": "#/definitions/ValuesSourceEnum"
        }
      },
      "required": ["values", "lpp"],
      "type": "object"
    },
    "ILidData": {
      "additionalProperties": false,
      "properties": {
        "endIsoBay": {
          "$ref": "#/definitions/IIsoBayPattern"
        },
        "label": {
          "type": "string"
        },
        "overlapPort": {
          "$ref": "#/definitions/TYesNo"
        },
        "overlapStarboard": {
          "$ref": "#/definitions/TYesNo"
        },
        "portIsoRow": {
          "type": "string"
        },
        "starboardIsoRow": {
          "type": "string"
        },
        "startIsoBay": {
          "$ref": "#/definitions/IIsoBayPattern"
        },
        "weight": {
          "type": "number"
        }
      },
      "required": [
        "label",
        "portIsoRow",
        "starboardIsoRow",
        "startIsoBay",
        "endIsoBay"
      ],
      "type": "object"
    },
    "IMasterCGs": {
      "additionalProperties": false,
      "properties": {
        "aboveTcgs": {
          "additionalProperties": {
            "type": "number"
          },
          "type": "object"
        },
        "belowTcgs": {
          "additionalProperties": {
            "type": "number"
          },
          "type": "object"
        },
        "bottomBases": {
          "additionalProperties": {
            "type": "number"
          },
          "type": "object"
        }
      },
      "required": ["aboveTcgs", "belowTcgs", "bottomBases"],
      "type": "object"
    },
    "IPositionLabels": {
      "additionalProperties": false,
      "properties": {
        "bays": {
          "additionalProperties": {
            "additionalProperties": false,
            "properties": {
              "label20": {
                "type": "string"
              },
              "label40": {
                "type": "string"
              }
            },
            "type": "object"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "IRowInfoByLength": {
      "additionalProperties": false,
      "properties": {
        "bottomWeight": {
          "type": "number"
        },
        "lcg": {
          "type": "number"
        },
        "rowWeight": {
          "type": "number"
        },
        "size": {
          "$ref": "#/definitions/TContainerLengths"
        }
      },
      "required": ["size"],
      "type": "object"
    },
    "IShipData": {
      "additionalProperties": false,
      "properties": {
        "callSign": {
          "type": "string"
        },
        "containersLengths": {
          "description": "All the available container lengths. 20' and 40' should be available in most of the cases",
          "items": {
            "$ref": "#/definitions/TContainerLengths"
          },
          "type": "array"
        },
        "featuresAllowed": {
          "$ref": "#/definitions/IFeaturesAllowed",
          "description": "Features allowed in slot or bay definitions"
        },
        "imoCode": {
          "type": "string"
        },
        "lcgOptions": {
          "$ref": "#/definitions/ILCGOptions"
        },
        "lineOperator": {
          "type": "string"
        },
        "loa": {
          "description": "LOA: Lenght Overall",
          "type": "number"
        },
        "masterCGs": {
          "$ref": "#/definitions/IMasterCGs",
          "description": "Calculated most observed CGs"
        },
        "metaInfo": {
          "$ref": "#/definitions/IShipMeta",
          "description": "Note and Revisions history"
        },
        "positionFormat": {
          "$ref": "#/definitions/PositionFormatEnum",
          "description": "Position format. Default is *BAY_STACK_TIER*: ##B#S#T"
        },
        "rowWeightCalculation": {
          "$ref": "#/definitions/RowWeightCalculationEnum"
        },
        "shipClass": {
          "type": "string"
        },
        "shipName": {
          "type": "string"
        },
        "shipNameAkas": {
          "description": "Ship _also known as_ Names",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "sternToAftPp": {
          "description": "Distance from Ster to Aft Perpendicular",
          "type": "number"
        },
        "tcgOptions": {
          "$ref": "#/definitions/ITGCOptions"
        },
        "vcgOptions": {
          "$ref": "#/definitions/IVGCOptions"
        },
        "yearBuilt": {
          "type": "number"
        }
      },
      "required": [
        "containersLengths",
        "lcgOptions",
        "masterCGs",
        "positionFormat",
        "shipClass",
        "tcgOptions",
        "vcgOptions"
      ],
      "type": "object"
    },
    "IShipMeta": {
      "additionalProperties": false,
      "properties": {
        "note": {
          "description": "This notes display in the profile of the ship",
          "type": "string"
        }
      },
      "type": "object"
    },
    "ISizeSummary": {
      "additionalProperties": false,
      "properties": {
        "centerLineRow": {
          "$ref": "#/definitions/TYesNo"
        },
        "isoBays": {
          "type": "number"
        },
        "maxAboveTier": {
          "type": "number"
        },
        "maxBelowTier": {
          "type": "number"
        },
        "maxRow": {
          "type": "number"
        },
        "minAboveTier": {
          "type": "number"
        },
        "minBelowTier": {
          "type": "number"
        }
      },
      "required": ["isoBays", "centerLineRow"],
      "type": "object"
    },
    "ISlotData": {
      "additionalProperties": false,
      "properties": {
        "coolStowProhibited": {
          "$ref": "#/definitions/TYesNo",
          "description": "Cannot stow containers that need/are cool"
        },
        "hazardousProhibited": {
          "anyOf": [
            {
              "const": true,
              "type": "boolean"
            },
            {
              "$ref": "#/definitions/IDangerousAndHazardous"
            }
          ],
          "description": "Cannot stow container that are dangerous"
        },
        "pos": {
          "$ref": "#/definitions/IJoinedRowTierPattern",
          "description": "STACK_TIER. 2 chars for Row, 2 or 3 for Tier. i.e.: 0780 or 0014 or 00100"
        },
        "reefer": {
          "$ref": "#/definitions/TYesNo",
          "description": "Reefer plug?"
        },
        "restricted": {
          "$ref": "#/definitions/TYesNo",
          "description": "A slot without sizes can optionally be declared as restricted to signify the empty slot"
        },
        "sizes": {
          "$ref": "#/definitions/IAcceptsContainers",
          "description": "An object with sizes allowed of type  {@link  IAcceptsContainers }"
        }
      },
      "required": ["pos", "sizes"],
      "type": "object"
    },
    "ISlotSizeOptions": {
      "additionalProperties": false,
      "description": "This object, when present, has details per SIZE",
      "properties": {
        "cone": {
          "$ref": "#/definitions/TYesNo",
          "description": "Cone is required"
        }
      },
      "type": "object"
    },
    "ITGCOptions": {
      "additionalProperties": false,
      "properties": {
        "direction": {
          "$ref": "#/definitions/PortStarboardEnum"
        },
        "values": {
          "$ref": "#/definitions/ValuesSourceEnum"
        }
      },
      "required": ["values"],
      "type": "object"
    },
    "IVGCOptions": {
      "additionalProperties": false,
      "properties": {
        "heightFactor": {
          "type": "number"
        },
        "values": {
          "$ref": "#/definitions/ValuesSourceEnum"
        }
      },
      "required": ["values"],
      "type": "object"
    },
    "LcgReferenceEnum": {
      "description": "LCG Reference from STAF. MIDSHIPS = 1, AFT_PERPENDICULAR = 2, FWD_PERPENDICULAR = 3",
      "enum": [1, 2, 3],
      "type": "number"
    },
    "Partial<indexed-type-1364282619-642-705-1364282619-633-706-1364282619-380-707-1364282619-0-1427>": {
      "additionalProperties": false,
      "properties": {
        "20": {
          "anyOf": [
            {
              "$ref": "#/definitions/TYesNo"
            },
            {
              "$ref": "#/definitions/ISlotSizeOptions"
            }
          ]
        },
        "24": {
          "anyOf": [
            {
              "$ref": "#/definitions/TYesNo"
            },
            {
              "$ref": "#/definitions/ISlotSizeOptions"
            }
          ]
        },
        "40": {
          "anyOf": [
            {
              "$ref": "#/definitions/TYesNo"
            },
            {
              "$ref": "#/definitions/ISlotSizeOptions"
            }
          ]
        },
        "45": {
          "anyOf": [
            {
              "$ref": "#/definitions/TYesNo"
            },
            {
              "$ref": "#/definitions/ISlotSizeOptions"
            }
          ]
        },
        "48": {
          "anyOf": [
            {
              "$ref": "#/definitions/TYesNo"
            },
            {
              "$ref": "#/definitions/ISlotSizeOptions"
            }
          ]
        },
        "53": {
          "anyOf": [
            {
              "$ref": "#/definitions/TYesNo"
            },
            {
              "$ref": "#/definitions/ISlotSizeOptions"
            }
          ]
        }
      },
      "type": "object"
    },
    "Partial<indexed-type-1634338809-2925-2978-1634338809-2916-2979-1634338809-2882-2980-1634338809-0-4487>": {
      "additionalProperties": false,
      "properties": {
        "20": {
          "$ref": "#/definitions/IRowInfoByLength"
        },
        "24": {
          "$ref": "#/definitions/IRowInfoByLength"
        },
        "40": {
          "$ref": "#/definitions/IRowInfoByLength"
        },
        "45": {
          "$ref": "#/definitions/IRowInfoByLength"
        },
        "48": {
          "$ref": "#/definitions/IRowInfoByLength"
        },
        "53": {
          "$ref": "#/definitions/IRowInfoByLength"
        }
      },
      "type": "object"
    },
    "PortStarboardEnum": {
      "description": "Port & Stbd. PORT = 1, STARBOARD = 2",
      "enum": [1, 2],
      "type": "number"
    },
    "PositionFormatEnum": {
      "description": "Position Format (from STAF). BAY_STACK_TIER = 1, BAY_TIER_STACK = 2, STACK_BAY_TIER = 3, STACK_TIER_BAY = 4, TIER_BAY_STACK = 5, TIER_STACK_BAY = 6",
      "enum": [1, 2, 3, 4, 5, 6],
      "type": "number"
    },
    "RowWeightCalculationEnum": {
      "description": "Row Weight Calculation. CONTAINER_LENGTH = 1, LENGTH_40_AVG20 = 2",
      "enum": [1, 2],
      "type": "number"
    },
    "TBayRowInfo": {
      "additionalProperties": false,
      "properties": {
        "common": {
          "$ref": "#/definitions/TCommonBayInfo"
        },
        "each": {
          "additionalProperties": {
            "$ref": "#/definitions/IBayRowInfo"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "TCommonBayInfo": {
      "additionalProperties": false,
      "properties": {
        "bottomBase": {
          "type": "number"
        },
        "maxHeight": {
          "type": "number"
        }
      },
      "type": "object"
    },
    "TCompatibilityGroups": {
      "enum": ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "N", "S"],
      "type": "string"
    },
    "TContainerLengths": {
      "enum": [20, 40, 24, 45, 48, 53],
      "type": "number"
    },
    "TImdgClasses": {
      "enum": [
        "1.1",
        "1.2",
        "1.3",
        "1.4",
        "1.5",
        "1.6",
        "2",
        "2.1",
        "2.2",
        "2.3",
        "3",
        "3.1",
        "3.2",
        "3.3",
        "4.1",
        "4.2",
        "4.3",
        "5.1",
        "5.2",
        "6.1",
        "6.2",
        "7",
        "8",
        "9"
      ],
      "type": "string"
    },
    "TRowInfoByLength": {
      "$ref": "#/definitions/Partial%3Cindexed-type-1634338809-2925-2978-1634338809-2916-2979-1634338809-2882-2980-1634338809-0-4487%3E"
    },
    "TUnNumber": {
      "type": "string"
    },
    "TVersion": {
      "type": "string"
    },
    "TYesNo": {
      "description": "Yes = 1, No = 0",
      "enum": [1, 0],
      "type": "number"
    },
    "ValuesSourceEnum": {
      "description": "CGs Values Source (from STAF). ESTIMATED = 1, KNOWN = 2",
      "enum": [1, 2],
      "type": "number"
    }
  }
}
```
