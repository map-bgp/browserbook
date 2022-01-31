pragma solidity ^0.8.0;

struct IndexValue { uint keyIndex; uint value; }
struct KeyFlag { address key; bool exists; }

struct itmap {
    mapping(address => IndexValue) data;
    KeyFlag[] keys;
    uint size;
}

library IterableMapping {
    function insert(itmap storage self, address key, uint value) internal returns (bool inserted) {
        uint keyIndex = self.data[key].keyIndex;
        if (keyIndex > 0 || self.keys[keyIndex].exists == true)
            return false;
        else {
            keyIndex = self.keys.length + 1;
            self.keys.push();
            self.data[key].keyIndex = keyIndex;
            self.data[key].value = value;
            self.keys[keyIndex].key = key;
            self.keys[keyIndex].exists = true;
            self.size++;
            return true;
        }
    }

    function increase(itmap storage self, address key, uint256 nextValue) internal returns (bool updated) {
        uint keyIndex = self.data[key].keyIndex;
        uint previousValue = self.data[key].keyIndex;
        if (keyIndex > 0 && self.keys[keyIndex].exists == true){
            self.data[key].value = previousValue + nextValue;
            return true;
        }
        else{
            return false;
        }
    }

    function reduce(itmap storage self, address key, uint256 nextValue) internal returns (bool updated) {
        uint keyIndex = self.data[key].keyIndex;
        uint previousValue = self.data[key].keyIndex;
        if (keyIndex > 0 && self.keys[keyIndex].exists == true){
            self.data[key].value = previousValue - nextValue;
            return true;
        }
        else{
            return false;
        }
    }

    function remove(itmap storage self, address key) internal returns (bool success) {
        uint keyIndex = self.data[key].keyIndex;
        if (keyIndex == 0)
            return false;
        delete self.data[key];
        self.keys[keyIndex].exists = false;
        self.size --;
    }

    function contains(itmap storage self, address key) internal view returns (bool) {
        return self.data[key].keyIndex > 0;
    }

    function valid(itmap storage self, uint keyIndex) internal view returns (bool) {
        return keyIndex < self.keys.length;
    }

    function get(itmap storage self, uint keyIndex) internal view returns (address key, uint value) {
        key = self.keys[keyIndex].key;
        value = self.data[key].value;
    }

    function getKeyIndex(itmap storage self, address key) internal view returns (uint) {
        return self.data[key].keyIndex;
    }
}