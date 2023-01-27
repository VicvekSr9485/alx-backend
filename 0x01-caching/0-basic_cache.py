#!/usr/bin/env python3
""" Basic dictionary caching module """

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """ Basic dictionary caching module """
    def __init__(self):
        """ init method """
        super().__init__()
        self.cache_data = {}

    def put(self, key, item):
        """ add item to the caching system """
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """ gets an item from the caching system """
        if key in self.cache_data:
            return self.cache_data[key]
        return None
