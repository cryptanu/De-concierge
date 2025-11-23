// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {PropertyRegistry} from "../src/PropertyRegistry.sol";
import {PaymentEscrow} from "../src/PaymentEscrow.sol";

contract PaymentEscrowTest is Test {
    PropertyRegistry private registry;
    PaymentEscrow private escrow;

    address private constant HOST = address(0xBEEF);
    address private constant GUEST = address(0xCAFE);
    uint256 private propertyId;

    function setUp() public {
        registry = new PropertyRegistry();
        escrow = new PaymentEscrow(registry);

        vm.prank(HOST);
        propertyId = registry.registerProperty(keccak256("escrow-property"), "cid://meta", "loft.host.eth");
    }

    function testDepositAndRelease() public {
        uint256 bookingId = 1;

        vm.deal(GUEST, 2 ether);

        vm.prank(GUEST);
        escrow.deposit{value: 1 ether}(bookingId, propertyId);

        PaymentEscrow.Deposit memory depositData = escrow.getDeposit(bookingId);
        assertEq(depositData.amount, 1 ether);
        assertEq(depositData.guest, GUEST);
        assertEq(depositData.host, HOST);

        vm.prank(HOST);
        escrow.release(bookingId);

        assertEq(HOST.balance, 1 ether);
        depositData = escrow.getDeposit(bookingId);
        assertTrue(depositData.released);
        assertEq(depositData.amount, 0);
    }

    function testDepositAndRefund() public {
        uint256 bookingId = 77;

        vm.deal(GUEST, 2 ether);

        vm.prank(GUEST);
        escrow.deposit{value: 1 ether}(bookingId, propertyId);

        vm.prank(GUEST);
        escrow.refund(bookingId);

        assertEq(GUEST.balance, 2 ether);
        PaymentEscrow.Deposit memory depositData = escrow.getDeposit(bookingId);
        assertTrue(depositData.refunded);
    }
}

