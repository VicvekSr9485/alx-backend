#!/usr/bin/env python3
""" LIFO Caching System Module """

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """ LIFO Caching class
        Inherits from BaseCaching
    """
    def __init__(self):
        """ init method for LIFO caching """
        super().__init__()
        self.cache_data_list = []

    def put(self, key, item):
        """ add an item to the cache """
        if key and item:
            self.cache_data[key] = item
            self.cache_data_list.append(key)
        if len(self.cache_data_list) > BaseCaching.MAX_ITEMS:
            self.cache_data.pop(self.cache_data_list[-1])
            discard = self.cache_data_list.pop(-1)
            print("DISCARD: {}".format(discard))

    def get(self, key):
        """ get an item from the cache """
        if key in self.cache_data:
            return self.cache_data[key]
        return None
