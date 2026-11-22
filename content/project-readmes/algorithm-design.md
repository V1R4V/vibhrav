# Algorithm Design in Python

Three classic algorithms, each a standalone program that reads test instances from stdin and writes one answer per instance.

| Program | Problem | Technique | Complexity |
| --- | --- | --- | --- |
| [`graph_dfs.py`](graph_dfs.py) | Visit every node of a (possibly disconnected) directed graph | Iterative depth-first search with an explicit stack | O(V + E) |
| [`furthest_in_future_cache.py`](furthest_in_future_cache.py) | Minimize cache misses for a known request sequence | Belady's optimal offline eviction: evict the page used furthest in the future | O(n·k) |
| [`line_crossings_fenwick.py`](line_crossings_fenwick.py) | Count crossing pairs among segments joining two parallel lines | Sort by top endpoint, then count inversions of bottom endpoints with a Fenwick (binary indexed) tree | O(n log n) |

## Input formats

**DFS**: the number of instances, then for each instance a node count followed by one line per node: `node neighbor1 neighbor2 …`. Nodes are explored in input order.

**Furthest-in-future**: the number of instances, then for each instance the cache size, the request count, and one line of page requests.

**Line crossings**: the number of instances, then for each instance `n`, `n` top-line points, and `n` bottom-line points (one per line). Segment *i* connects top point *i* to bottom point *i*.

## Examples

```bash
$ python3 graph_dfs.py < samples/dfs_input.txt
A B C
1 2 4 5 3

$ python3 furthest_in_future_cache.py < samples/cache_input.txt
5
7

$ python3 line_crossings_fenwick.py < samples/crossings_input.txt
4
7
```

No dependencies beyond Python 3.

---

*Date finished: October 15, 2025*
