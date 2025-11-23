// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {PropertyRegistry} from "../src/PropertyRegistry.sol";
import {BookingLedger} from "../src/BookingLedger.sol";

contract BookingLedgerTest is Test {
    PropertyRegistry private registry;
    BookingLedger private ledger;

    address private constant HOST = address(0xBEEF);
    address private constant GUEST = address(0xCAFE);

    uint256 private propertyId;

    function setUp() public {
        registry = new PropertyRegistry();
        ledger = new BookingLedger(registry);

        vm.prank(HOST);
        propertyId = registry.registerProperty(keccak256("booking-property"), "cid://meta", "loft.host.eth");
    }

    function testCreateBooking() public {
        vm.prank(GUEST);
        uint256 bookingId = ledger.createBooking(propertyId, 1 days, 2 days, 1 ether, keccak256("evidence"));

        assertEq(bookingId, 1);

        BookingLedger.Booking memory booking = ledger.getBooking(bookingId);
        assertEq(booking.guest, GUEST);
        assertEq(booking.propertyId, propertyId);
        assertEq(uint256(booking.status), uint256(BookingLedger.Status.Pending));
        assertEq(booking.amount, 1 ether);
    }

    function testConfirmBookingOnlyHost() public {
        vm.prank(GUEST);
        uint256 bookingId = ledger.createBooking(propertyId, 1 days, 2 days, 1 ether, keccak256("evidence"));

        vm.expectRevert(
            abi.encodeWithSelector(BookingLedger.Unauthorized.selector, bookingId, GUEST)
        );
        vm.prank(GUEST);
        ledger.confirmBooking(bookingId);

        vm.prank(HOST);
        ledger.confirmBooking(bookingId);

        BookingLedger.Booking memory booking = ledger.getBooking(bookingId);
        assertEq(uint256(booking.status), uint256(BookingLedger.Status.Confirmed));
    }

    function testCancelBookingByGuestOrHost() public {
        vm.prank(GUEST);
        uint256 bookingId = ledger.createBooking(propertyId, 1 days, 2 days, 1 ether, keccak256("evidence"));

        vm.prank(GUEST);
        ledger.cancelBooking(bookingId);

        BookingLedger.Booking memory booking = ledger.getBooking(bookingId);
        assertEq(uint256(booking.status), uint256(BookingLedger.Status.Cancelled));

        // create another booking
        vm.prank(GUEST);
        uint256 secondBookingId = ledger.createBooking(propertyId, 3 days, 4 days, 2 ether, keccak256("evidence2"));

        vm.prank(HOST);
        ledger.cancelBooking(secondBookingId);
        booking = ledger.getBooking(secondBookingId);
        assertEq(uint256(booking.status), uint256(BookingLedger.Status.Cancelled));
    }
}

