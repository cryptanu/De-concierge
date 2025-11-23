// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PropertyRegistry} from "./PropertyRegistry.sol";

/**
 * @title PaymentEscrow
 * @notice Simple ETH escrow keyed by bookingId. In production this will handle stablecoins,
 *         but for testing we keep ETH to reduce integration complexity.
 */
contract PaymentEscrow {
    struct Deposit {
        address guest;
        address host;
        uint256 amount;
        bool released;
        bool refunded;
    }

    PropertyRegistry public immutable registry;
    mapping(uint256 => Deposit) private _deposits;

    event Deposited(uint256 indexed bookingId, address indexed guest, address indexed host, uint256 amount);
    event Released(uint256 indexed bookingId, address host, uint256 amount);
    event Refunded(uint256 indexed bookingId, address guest, uint256 amount);

    error DepositAlreadyExists(uint256 bookingId);
    error InvalidDeposit(uint256 bookingId);
    error Unauthorized(uint256 bookingId, address caller);
    error NothingToRelease(uint256 bookingId);
    error NothingToRefund(uint256 bookingId);

    constructor(PropertyRegistry registry_) {
        registry = registry_;
    }

    function deposit(uint256 bookingId, uint256 propertyId) external payable {
        if (_deposits[bookingId].amount > 0) revert DepositAlreadyExists(bookingId);
        address host = registry.getPropertyHost(propertyId);
        if (msg.value == 0 || host == address(0)) revert InvalidDeposit(bookingId);

        _deposits[bookingId] = Deposit({
            guest: msg.sender,
            host: host,
            amount: msg.value,
            released: false,
            refunded: false
        });

        emit Deposited(bookingId, msg.sender, host, msg.value);
    }

    function release(uint256 bookingId) external {
        Deposit storage depositData = _deposits[bookingId];
        if (depositData.amount == 0) revert InvalidDeposit(bookingId);
        if (depositData.host != msg.sender) revert Unauthorized(bookingId, msg.sender);
        if (depositData.released || depositData.refunded) revert NothingToRelease(bookingId);

        depositData.released = true;
        uint256 amount = depositData.amount;
        depositData.amount = 0;
        (bool success, ) = depositData.host.call{value: amount}("");
        require(success, "TRANSFER_FAILED");

        emit Released(bookingId, depositData.host, amount);
    }

    function refund(uint256 bookingId) external {
        Deposit storage depositData = _deposits[bookingId];
        if (depositData.amount == 0) revert InvalidDeposit(bookingId);
        if (msg.sender != depositData.host && msg.sender != depositData.guest) {
            revert Unauthorized(bookingId, msg.sender);
        }
        if (depositData.released || depositData.refunded) revert NothingToRefund(bookingId);

        depositData.refunded = true;
        uint256 amount = depositData.amount;
        depositData.amount = 0;
        (bool success, ) = depositData.guest.call{value: amount}("");
        require(success, "TRANSFER_FAILED");

        emit Refunded(bookingId, depositData.guest, amount);
    }

    function getDeposit(uint256 bookingId) external view returns (Deposit memory) {
        return _deposits[bookingId];
    }
}

