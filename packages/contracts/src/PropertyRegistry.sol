// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PropertyRegistry
 * @notice Minimal registry that links ENS-branded properties to hosts and verifiable metadata.
 *         Provides read hooks for BookingLedger and PaymentEscrow contracts.
 */
contract PropertyRegistry {
    struct Property {
        address host;
        bytes32 propertyHash;
        string metadataCID;
        string ensName;
        bool active;
    }

    uint256 private _nextPropertyId = 1;

    mapping(uint256 => Property) private _properties;
    mapping(bytes32 => bool) private _hashUsed;

    event PropertyRegistered(
        uint256 indexed propertyId,
        address indexed host,
        bytes32 indexed propertyHash,
        string metadataCID,
        string ensName
    );

    event PropertyMetadataUpdated(uint256 indexed propertyId, string metadataCID);
    event PropertyEnsUpdated(uint256 indexed propertyId, string ensName);
    event PropertyStatusUpdated(uint256 indexed propertyId, bool active);

    error PropertyNotFound(uint256 propertyId);
    error NotPropertyHost(uint256 propertyId, address caller);
    error PropertyHashAlreadyUsed();

    /**
     * @notice Registers a new property for the caller.
     * @param propertyHash Fingerprint of the property characteristics.
     * @param metadataCID Filecoin/IPFS CID with rich metadata.
     * @param ensName ENS name or subname mapped to the property.
     */
    function registerProperty(
        bytes32 propertyHash,
        string calldata metadataCID,
        string calldata ensName
    ) external returns (uint256 propertyId) {
        if (_hashUsed[propertyHash]) revert PropertyHashAlreadyUsed();

        propertyId = _nextPropertyId++;
        _properties[propertyId] = Property({
            host: msg.sender,
            propertyHash: propertyHash,
            metadataCID: metadataCID,
            ensName: ensName,
            active: true
        });
        _hashUsed[propertyHash] = true;

        emit PropertyRegistered(propertyId, msg.sender, propertyHash, metadataCID, ensName);
    }

    function updateMetadata(uint256 propertyId, string calldata metadataCID) external {
        Property storage property = _properties[propertyId];
        _assertHost(propertyId, property);

        property.metadataCID = metadataCID;
        emit PropertyMetadataUpdated(propertyId, metadataCID);
    }

    function updateEnsName(uint256 propertyId, string calldata ensName) external {
        Property storage property = _properties[propertyId];
        _assertHost(propertyId, property);

        property.ensName = ensName;
        emit PropertyEnsUpdated(propertyId, ensName);
    }

    function setActive(uint256 propertyId, bool active) external {
        Property storage property = _properties[propertyId];
        _assertHost(propertyId, property);

        property.active = active;
        emit PropertyStatusUpdated(propertyId, active);
    }

    function getProperty(uint256 propertyId) external view returns (Property memory property) {
        property = _properties[propertyId];
        if (property.host == address(0)) revert PropertyNotFound(propertyId);
    }

    function getPropertyHost(uint256 propertyId) external view returns (address) {
        Property storage property = _properties[propertyId];
        if (property.host == address(0)) revert PropertyNotFound(propertyId);
        return property.host;
    }

    function isActive(uint256 propertyId) external view returns (bool) {
        Property storage property = _properties[propertyId];
        if (property.host == address(0)) revert PropertyNotFound(propertyId);
        return property.active;
    }

    function _assertHost(uint256 propertyId, Property storage property) internal view {
        if (property.host == address(0)) revert PropertyNotFound(propertyId);
        if (property.host != msg.sender) revert NotPropertyHost(propertyId, msg.sender);
    }
}

