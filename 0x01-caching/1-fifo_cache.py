#!/usr/bin/env python3
""" FIFO caching module """

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """ FIFO cache class.
        Inherits from BaseCaching
    """
    def __init__(self):
        """ init method of FIFO cache """
        super().__init__()
        self.cache_data_list = []

    def put(self, key, item):
        """ add an item to the FIFO cache """
        if key and item:
            self.cache_data[key] = item
            self.cache_data_list.append(key)
        if len(self.cache_data_list) > BaseCaching.MAX_ITEMS:
            self.cache_data.pop(self.cache_data_list[0])
            discard = self.cache_data_list.pop(0)
            print("DISCARD: {}".format(discard))

    def get(self, key):
        """ get a key from the cache """
        if key in self.cache_data:
            return self.cache_data[key]
        return None
