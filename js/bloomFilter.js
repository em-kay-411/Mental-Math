class BloomFilter {
    constructor(size = 100000, hashFunctions = [this.hash1, this.hash2]) {
        this.size = size;
        this.hashFunctions = hashFunctions;
        this.filter = new Array(size).fill(false);
    }

    add(item) {
        for (const fn of this.hashFunctions) {
            const index = fn(item, this.size);
            this.filter[index] = true;
        }
    }

    has(item) {
        for (const fn of this.hashFunctions) {
            const index = fn(item, this.size);
            if (!this.filter[index]) {
                return false;
            }
        }
        return true;
    }

    //djb2 hash
    hash1(item, size) {
        let hash = 0;
        for (let i = 0; i < item.length; i++) {
            hash = (hash << 5) + hash + item.charCodeAt(i);
            hash &= hash;
            hash = Math.abs(hash);
        }
        return hash % size;
    }

    //Jenkins hash
    hash2(item, size) {
        let hash = 5381;
        for (let i = 0; i < item.length; i++) {
            hash = (hash * 33) ^ item.charCodeAt(i);
        }
        return Math.abs(hash % size);
    }
}

module.exports = BloomFilter;