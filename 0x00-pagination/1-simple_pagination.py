#!/usr/bin/env python3
"""  Simple pagination module """
import csv
import math
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """ Returns a tuple """
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return (start_index, end_index)

class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """takes two integer arguments page with default
        value 1 and page_size with default value 10 and returns a page
        """
        assert type(page) is int and page > 0
        assert type(page_size) is int and page_size > 0

        indexes =  index_range(page, page_size)

        try:
            data = self.dataset()
            return data[indexes[0]: indexes[1]]
        except IndexError:
            return []
