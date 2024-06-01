from typing import List


def total_count(arr: List[List]):
    count = 0
    for row in arr:
        print(len(row))
        count += len(row)
    return count
