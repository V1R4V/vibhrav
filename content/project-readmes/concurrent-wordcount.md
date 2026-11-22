# Concurrent Word Count & Performance Benchmarking System

A high-performance, multi-threaded word counting application with comprehensive benchmarking capabilities. This project explores concurrent programming patterns, Python's Global Interpreter Lock (GIL) behavior, and data format performance characteristics across CSV, Parquet, and Apache Arrow.

## Features

### 🚀 Multi-threaded Processing
- Configurable thread pool for parallel file processing
- Thread-safe data structures with fine-grained locking
- Efficient work distribution across compressed text files
- Real-time processing status logging

### 📊 Multiple Output Formats
- **CSV**: Human-readable tabular output
- **Parquet**: Columnar storage with compression
- **Apache Arrow**: Zero-copy in-memory format with memory mapping

### 🔬 Comprehensive Benchmarking Suite
- Thread scaling analysis (GIL vs. No-GIL Python)
- Format performance comparison
- Automated test generation and validation
- Visual performance reporting with SVG charts

## Technical Stack

- **Language**: Python 3.13 (with and without GIL)
- **Concurrency**: Threading with mutex locks
- **Data Formats**: CSV, Parquet, Apache Arrow
- **Testing**: pytest framework
- **Containerization**: Docker
- **Data Processing**: pandas, pyarrow, fastparquet

## Architecture

### Core Components

**Word Counter Engine** (`final.py`)
- Processes gzipped text files in parallel
- Maintains per-file and aggregate word counts
- Thread-safe accumulation with optimized locking strategy
- Supports 3 output formats based on file extension

**Test Suite** (`test.py`)
- 6+ comprehensive test cases covering edge cases
- Format validation across CSV, Parquet, and Arrow
- Concurrent processing correctness verification
- Parameterized tests for format-agnostic validation

**Thread Performance Benchmark** (`thread_bench.py`)
- Compares GIL vs. No-GIL Python performance
- Tests thread scaling from 1-16+ threads
- Generates synthetic datasets (256 files, 1M words each)
- Produces comparative visualizations and CSV results

**Format Performance Benchmark** (`format_bench.py`)
- Evaluates read performance across formats
- Implements format-specific optimizations:
  - Parquet: Selective column reading
  - Arrow: Memory-mapped file access
- Measures real-world query performance

## Usage

### Basic Word Counting
```bash
python3 final.py <input_directory> <output_file> <threads>
```

**Arguments:**
- `input_directory`: Directory containing `.txt.gz` files
- `output_file`: Output path (`.csv`, `.parquet`, or `.arrow`)
- `threads`: Number of worker threads

**Example:**
```bash
python3 final.py ./data ./results/wordcount.parquet 8
```

### Running Benchmarks

**Thread Scaling Analysis:**
```bash
python3 thread_bench.py ./outputs
```

**Format Comparison:**
```bash
python3 format_bench.py ./outputs
```

## Docker Deployment

### Build Image
```bash
docker build -t wordcount-benchmark .
```

### Run with Standard Python (GIL)
```bash
docker run -v ./inputs:/inputs -v ./outputs:/outputs \
  wordcount-benchmark python3.13 final.py /inputs /outputs/output.csv 4
```

### Run with Python No-GIL
```bash
docker run -v ./inputs:/inputs -v ./outputs:/outputs \
  wordcount-benchmark python3.13-nogil final.py /inputs /outputs/output.parquet 8
```

### Run Test Suite
```bash
docker run -e PROGRAM=final.py wordcount-benchmark python3.13 -m pytest /app/test.py
```

## Output Format

The word count table includes:
- **word**: The word (case-insensitive)
- **count**: Total occurrences across all files
- **[filename].gz**: Per-file occurrence counts

**Example:**

| word    | count | file1.gz | file2.gz | file3.gz |
|---------|-------|----------|----------|----------|
| python  | 150   | 50       | 75       | 25       |
| data    | 200   | 100      | 50       | 50       |

## Performance Insights

### Thread Scaling (Sample Results)

![Thread Benchmark](outputs/threads.svg)

The benchmarks demonstrate:
- Linear scaling in No-GIL Python up to CPU core count
- GIL limitations in standard Python for CPU-bound tasks
- Optimal thread count varies by workload characteristics

### Format Performance (Sample Results)

![Format Benchmark](outputs/formats.svg)

Key findings:
- **Parquet**: Best for selective column queries (5-10x faster reads)
- **Arrow**: Optimal for zero-copy operations with memory mapping
- **CSV**: Human-readable but slower for large datasets

## Implementation Highlights

### Concurrent Design
- **Lock Granularity**: Fine-grained locks minimize contention
- **Work Distribution**: File-level parallelism ensures balanced workloads
- **Thread Safety**: All shared data structures protected by mutexes
- **Efficiency**: I/O operations performed outside critical sections

### Testing Strategy
- Parameterized tests for format validation
- Edge case coverage (empty files, single words, large vocabularies)
- Performance regression detection
- Cross-implementation validation

### Benchmarking Methodology
- Synthetic dataset generation (1000-word vocabulary, 256 files)
- Consistent test conditions across runs
- Multiple trials for statistical significance
- Visual and tabular result presentation

## Skills Demonstrated

- **Concurrent Programming**: Thread management, synchronization, race condition prevention
- **Performance Engineering**: GIL analysis, benchmarking, optimization
- **Data Engineering**: Multi-format support, columnar storage, memory mapping
- **Software Testing**: Comprehensive test design, edge case coverage
- **Containerization**: Multi-stage Docker builds, Python version management
- **Data Visualization**: Performance chart generation with matplotlib

## Requirements

- Python 3.13 (with/without GIL)
- pandas, pyarrow, fastparquet
- pytest (for testing)
- Docker (for containerized execution)

---

*A deep dive into Python concurrency, GIL behavior, and data format performance characteristics.*
