#!/usr/bin/env python3
""" LFU Caching module """

from base_caching import BaseCaching
from collections import Counter


class LFUCache(BaseCaching):
    """ LFU caching system """
    def __init__(self):
        """ init method for LFU caching """
        super().__init__()
        self.counter = Counter()

    def put(self, key, item):
        """Add an item to the cache"""
        if key is None or item is None:
            return
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            min_freq = min(self.counter.values())
            lfu_keys = [k for k, v in self.counter.items() if v == min_freq]
            lru_key = min(lfu_keys, key=lambda k: self.cache_data[k][1])
            print("DISCARD: {}".format(lru_key))
            del self.cache_data[lru_key]
            del self.counter[lru_key]
        self.counter[key] += 1
        self.cache_data[key] = (item, self.counter[key])

    def get(self, key):
        """Get an item from the cache"""
        if key is None or key not in self.cache_data:
            return None
        self.counter[key] += 1
        self.cache_data[key] = (self.cache_data[key][0], self.counter[key])
        return self.cache_data[key][0]
