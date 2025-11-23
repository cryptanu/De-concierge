// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PropertyRegistry} from "./PropertyRegistry.sol";

/**
 * @title BookingLedger
 * @notice Tracks booking intents and their lifecycle with references to PropertyRegistry.
 *         Payments are handled separately by PaymentEscrow, but booking IDs line up.
 */
contract BookingLedger {
    enum Status {
        Pending,
        Confirmed,
        Cancelled
    }

    struct Booking {
        address guest;
        uint256 propertyId;
        uint64 checkIn;
        uint64 checkOut;
        uint256 amount;
        Status status;
        bytes32 evidenceCID;
    }

    PropertyRegistry public immutable registry;
    uint256 private _nextBookingId = 1;
    mapping(uint256 => Booking) private _bookings;

    event BookingCreated(
        uint256 indexed bookingId,
        uint256 indexed propertyId,
        address indexed guest,
        uint64 checkIn,
        uint64 checkOut,
        uint256 amount,
        bytes32 evidenceCID
    );
    event BookingStatusUpdated(uint256 indexed bookingId, Status status);

    error InvalidDates();
    error PropertyInactive(uint256 propertyId);
    error BookingNotFound(uint256 bookingId);
    error Unauthorized(uint256 bookingId, address caller);
    error InvalidStatusTransition(Status expected, Status current);

    constructor(PropertyRegistry registry_) {
        registry = registry_;
    }

    function createBooking(
        uint256 propertyId,
        uint64 checkIn,
        uint64 checkOut,
        uint256 amount,
        bytes32 evidenceCID
    ) external returns (uint256 bookingId) {
        if (checkIn == 0 || checkOut <= checkIn) revert InvalidDates();
        if (!registry.isActive(propertyId)) revert PropertyInactive(propertyId);

        bookingId = _nextBookingId++;
        _bookings[bookingId] = Booking({
            guest: msg.sender,
            propertyId: propertyId,
            checkIn: checkIn,
            checkOut: checkOut,
            amount: amount,
            status: Status.Pending,
            evidenceCID: evidenceCID
        });

        emit BookingCreated(bookingId, propertyId, msg.sender, checkIn, checkOut, amount, evidenceCID);
    }

    function confirmBooking(uint256 bookingId) external {
        Booking storage booking = _bookings[bookingId];
        _assertExists(bookingId, booking);
        _onlyHost(bookingId, booking);
        if (booking.status != Status.Pending) {
            revert InvalidStatusTransition(Status.Pending, booking.status);
        }

        booking.status = Status.Confirmed;
        emit BookingStatusUpdated(bookingId, Status.Confirmed);
    }

    function cancelBooking(uint256 bookingId) external {
        Booking storage booking = _bookings[bookingId];
        _assertExists(bookingId, booking);
        if (msg.sender != booking.guest && msg.sender != registry.getPropertyHost(booking.propertyId)) {
            revert Unauthorized(bookingId, msg.sender);
        }
        if (booking.status == Status.Cancelled) {
            revert InvalidStatusTransition(Status.Pending, booking.status);
        }

        booking.status = Status.Cancelled;
        emit BookingStatusUpdated(bookingId, Status.Cancelled);
    }

    function getBooking(uint256 bookingId) external view returns (Booking memory booking) {
        booking = _bookings[bookingId];
        if (booking.guest == address(0)) revert BookingNotFound(bookingId);
    }

    function _onlyHost(uint256 bookingId, Booking storage booking) internal view {
        address host = registry.getPropertyHost(booking.propertyId);
        if (host != msg.sender) revert Unauthorized(bookingId, msg.sender);
    }

    function _assertExists(uint256 bookingId, Booking storage booking) internal view {
        if (booking.guest == address(0)) revert BookingNotFound(bookingId);
    }
}

