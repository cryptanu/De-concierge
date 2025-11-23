// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {PropertyRegistry} from "../src/PropertyRegistry.sol";

contract PropertyRegistryTest is Test {
    PropertyRegistry private registry;

    address private constant ALICE = address(0xA11CE);
    address private constant BOB = address(0xB0B);

    function setUp() public {
        registry = new PropertyRegistry();
    }

    function testRegisterProperty() public {
        bytes32 hash = keccak256("property-123");
        uint256 propertyId = registry.registerProperty(hash, "cid://initial", "loft1.host.eth");

        assertEq(propertyId, 1);

        PropertyRegistry.Property memory property = registry.getProperty(propertyId);
        assertEq(property.host, address(this));
        assertEq(property.propertyHash, hash);
        assertEq(property.metadataCID, "cid://initial");
        assertEq(property.ensName, "loft1.host.eth");
        assertTrue(property.active);
    }

    function testRegisterPropertyRevertsOnDuplicateHash() public {
        bytes32 hash = keccak256("duplicate");
        registry.registerProperty(hash, "cid://1", "prop.eth");

        vm.expectRevert(PropertyRegistry.PropertyHashAlreadyUsed.selector);
        registry.registerProperty(hash, "cid://2", "prop2.eth");
    }

    function testOnlyHostCanUpdateMetadata() public {
        bytes32 hash = keccak256("host-only");
        uint256 propertyId;

        vm.prank(ALICE);
        propertyId = registry.registerProperty(hash, "cid://old", "alice.eth");

        vm.prank(ALICE);
        registry.updateMetadata(propertyId, "cid://new");

        PropertyRegistry.Property memory property = registry.getProperty(propertyId);
        assertEq(property.metadataCID, "cid://new");

        vm.expectRevert(
            abi.encodeWithSelector(PropertyRegistry.NotPropertyHost.selector, propertyId, BOB)
        );
        vm.prank(BOB);
        registry.updateMetadata(propertyId, "cid://evil");
    }

    function testSetActive() public {
        bytes32 hash = keccak256("active-toggle");

        vm.prank(ALICE);
        uint256 propertyId = registry.registerProperty(hash, "cid://old", "alice.eth");

        vm.prank(ALICE);
        registry.setActive(propertyId, false);
        assertFalse(registry.isActive(propertyId));

        vm.prank(ALICE);
        registry.setActive(propertyId, true);
        assertTrue(registry.isActive(propertyId));
    }
}

