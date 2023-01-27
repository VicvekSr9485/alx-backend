#!/usr/bin/env python3
""" MRU Caching module """

from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """ MRU caching system """
    def __init__(self):
        """ init method for MRU caching """
        super().__init__()
        self.cache_data_list = []

    def put(self, key, item):
        """ add an item to the caching system """
        if key is None or item is None:
            return
        if key in self.cache_data:
            self.cache_data_list.remove(key)
        elif len(self.cache_data) >= self.MAX_ITEMS:
            discarded_key = self.cache_data_list.pop(0)
            self.cache_data.pop(discarded_key)
            print(f"DISCARD: {discarded_key}")
        self.cache_data[key] = item
        self.cache_data_list.append(key)

    def get(self, key):
        """ get an item from the cache """
        if key is None or key not in self.cache_data:
            return None
        self.cache_data_list.remove(key)
        self.cache_data_list.append(key)
        return self.cache_data[key]
