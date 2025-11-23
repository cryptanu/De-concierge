// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {PropertyRegistry} from "../src/PropertyRegistry.sol";
import {BookingLedger} from "../src/BookingLedger.sol";
import {PaymentEscrow} from "../src/PaymentEscrow.sol";

contract Deploy is Script {
    function run() external returns (PropertyRegistry registry, BookingLedger ledger, PaymentEscrow escrow) {
        vm.startBroadcast();
        registry = new PropertyRegistry();
        ledger = new BookingLedger(registry);
        escrow = new PaymentEscrow(registry);
        vm.stopBroadcast();
    }
}

