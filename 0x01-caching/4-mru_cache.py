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
        if key and item:
            self.cache_data[key] = item
            if key not in self.cache_data_list:
                self.cache_data_list.append(key)
            else:
                self.cache_data_list.remove(key)
                self.cache_data_list.append(key)
            if len(self.cache_data_list) > BaseCaching.MAX_ITEMS:
                discard = self.cache_data_list.pop(0)
                del self.cache_data[discard]
                print("DISCARD:{}".format(discard))

    def get(self, key):
        """ get an item from the cache """
        if key:
            if key in self.cache_data:
                self.cache_data_list.remove(key)
                self.cache_data_list.append(key)
                return self.cache_data[key]
        return None
