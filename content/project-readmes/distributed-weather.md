# Distributed Weather Data System with Cassandra

A fault-tolerant weather data ingestion and analysis system built on Apache Cassandra. Features configurable consistency levels for read/write availability tradeoffs, automatic failover mechanisms, and real-time temperature analytics from NOAA weather stations across Wisconsin.

## Overview

This system processes weather data from the National Oceanic and Atmospheric Administration (NOAA), storing temperature readings from weather stations in a distributed Cassandra cluster. It demonstrates advanced distributed database concepts including tunable consistency, prepared statements, and graceful degradation under node failures.

## Architecture

![System Architecture](p6-cassandra-diagram.png)

The system consists of:
- **Cassandra Cluster** (3 nodes): Distributed database with 3x replication
- **gRPC Server**: API layer with Spark integration for data preprocessing
- **Weather Clients**: Data ingestion and query interfaces

## Key Features

### 🗄️ Distributed Data Model
- **Partitioning**: Data organized by station ID for efficient queries
- **Clustering**: Time-series ordering by date within partitions
- **Static Columns**: Station metadata stored once per partition
- **User-Defined Types**: Custom types for temperature records

### ⚖️ Tunable Consistency
- **Strong Consistency**: R + W > RF guarantees (R=2, W=1, RF=3)
- **High Availability**: Automatic fallback to relaxed consistency (R=1)
- **Write Optimization**: Always accept sensor data when any replica available
- **Read Profiles**: Dual-mode reads with automatic degradation

### 🛡️ Fault Tolerance
- **Automatic Failover**: Graceful degradation on node failures
- **Error Handling**: Clear "unavailable" messages when quorum lost
- **Data Durability**: 3x replication across cluster nodes
- **Prepared Statements**: Optimized queries with configurable consistency

### 🚀 Spark Integration
- **Data Preprocessing**: Parse and transform station metadata
- **Bulk Loading**: Efficient batch inserts into Cassandra
- **Text Processing**: Extract structured data from fixed-width files

## Technical Stack

- **Database**: Apache Cassandra 5.0+
- **Data Processing**: Apache Spark (local mode)
- **RPC Framework**: gRPC, Protocol Buffers
- **Backend**: Python 3.x
- **Client Connector**: cassandra-driver
- **Containerization**: Docker, Docker Compose

## Data Model

### Schema Design
```sql
CREATE KEYSPACE weather WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 3
};

CREATE TYPE weather.station_record (
  tmin int,  -- tenths of degrees Celsius
  tmax int   -- tenths of degrees Celsius
);

CREATE TABLE weather.stations (
  id text,                    -- Partition key: Station ID
  date date,                  -- Clustering key: Measurement date
  name text static,           -- Static: Station name
  record station_record,      -- UDT: Temperature readings
  PRIMARY KEY (id, date)
) WITH CLUSTERING ORDER BY (date ASC);
```

**Design Rationale**:
- **Partition Key** (`id`): Groups all data for a station together
- **Clustering Key** (`date`): Enables efficient time-range queries
- **Static Column** (`name`): Avoids redundant storage across dates
- **UDT** (`station_record`): Bundles related temperature fields

## API Operations

### 1. Schema Inspection
```bash
python3 ClientStationSchema.py
```
Returns the Cassandra table definition with all configuration details.

### 2. Station Lookup
```bash
python3 ClientStationName.py USW00014837
```
**Output**: `MADISON DANE CO RGNL AP`

Retrieves station name using partition key query.

### 3. Temperature Recording
```bash
python3 ClientRecordTemps.py
```
Ingests weather data from Parquet files into Cassandra with W=1 consistency.

**Sample Output**:
```
Inserted USW00014837 on 2022-01-01 with tmin=-99 and tmax=-32
Inserted USW00014837 on 2022-01-02 with tmin=-166 and tmax=-82
...
```

### 4. Maximum Temperature Query
```bash
python3 ClientStationMax.py USR0000WDDG
```
**Output**: `344` (34.4°C)

Returns the highest temperature ever recorded at a station.

## Consistency Guarantees

### Write Profile (RecordTemps)
- **Consistency Level**: `ONE` (W=1)
- **Rationale**: Maximize availability for sensor uploads
- **Behavior**: Accepts writes when any single replica reachable
- **Use Case**: Sensors with limited storage can't afford write failures

### Read Profile #1: Strong (StationMax)
- **Consistency Level**: `TWO` (R=2)
- **Guarantee**: R + W > RF ensures no stale reads
- **Behavior**: Requires quorum of replicas
- **Fallback**: Automatically switches to Available profile on failure

### Read Profile #2: Available (StationMax)
- **Consistency Level**: `ONE` (R=1)
- **Guarantee**: Best-effort availability
- **Behavior**: Returns data from any single replica
- **Tradeoff**: May return slightly stale data during conflicts

## Fault Tolerance Demonstration

### Scenario: Single Node Failure

**Initial State** - All nodes healthy:
```bash
$ docker exec p6-db-1 nodetool status
UN  172.27.0.4  70.28 KiB  16  64.1%  rack1
UN  172.27.0.3  70.26 KiB  16  65.9%  rack1
UN  172.27.0.2  70.28 KiB  16  70.0%  rack1
```

**Failure Injection**:
```bash
docker kill p6-db-2
```

**After Failure**:
```bash
$ docker exec p6-db-1 nodetool status
UN  172.27.0.4  70.28 KiB  16  64.1%  rack1
DN  172.27.0.3  70.26 KiB  16  65.9%  rack1  # DOWN
UN  172.27.0.2  70.28 KiB  16  70.0%  rack1
```

### System Behavior

**Writes** (W=1): ✅ Continue normally
```bash
$ python3 ClientRecordTemps.py
Inserted USW00014837 on 2022-01-01 with tmin=-99 and tmax=-32
# Success - at least one replica available
```

**Reads - Strong** (R=2): ⚠️ Cannot achieve quorum
- Primary profile fails (requires 2 of 3 replicas)
- Automatically falls back to Available profile

**Reads - Available** (R=1): ✅ Continue with fallback
```bash
$ python3 ClientStationMax.py USR0000WDDG
344 (fallback_to_available)
# Success using degraded consistency
```

## Implementation Highlights

### Prepared Statements

Prepared once in `__init__`, used many times:
```python
class StationService:
    def __init__(self):
        # Strong consistency read
        self.max_query_strong = self.session.prepare(
            "SELECT MAX(record.tmax) FROM weather.stations WHERE id = ?"
        )
        self.max_query_strong.consistency_level = ConsistencyLevel.TWO
        
        # Available fallback read
        self.max_query_available = self.session.prepare(
            "SELECT MAX(record.tmax) FROM weather.stations WHERE id = ?"
        )
        self.max_query_available.consistency_level = ConsistencyLevel.ONE
        
        # High-availability write
        self.insert_temp = self.session.prepare(
            "INSERT INTO weather.stations (id, date, record) VALUES (?, ?, ?)"
        )
        self.insert_temp.consistency_level = ConsistencyLevel.ONE
```

### Automatic Failover Logic
```python
def StationMax(self, request, context):
    try:
        # Try strong consistency first
        result = self.session.execute(
            self.max_query_strong, 
            [request.station]
        )
        return StationMaxReply(tmax=result[0].max_tmax, error="")
        
    except (Unavailable, NoHostAvailable):
        # Fall back to available profile
        try:
            result = self.session.execute(
                self.max_query_available, 
                [request.station]
            )
            return StationMaxReply(
                tmax=result[0].max_tmax, 
                error="fallback_to_available"
            )
        except (Unavailable, NoHostAvailable):
            return StationMaxReply(tmax=0, error="unavailable")
```

### Spark Data Loading
```python
# Parse fixed-width station metadata file
stations_df = spark.read.text("ghcnd-stations.txt") \
    .selectExpr(
        "SUBSTRING(value, 1, 11) AS id",
        "SUBSTRING(value, 39, 2) AS state",
        "SUBSTRING(value, 42, 30) AS name"
    ) \
    .filter("state = 'WI'")

# Bulk insert into Cassandra
for row in stations_df.collect():
    session.execute(
        "INSERT INTO weather.stations (id, name) VALUES (?, ?)",
        [row.id.strip(), row.name.strip()]
    )
```

## Data Sources

- **Station Metadata**: NOAA GHCND stations file (fixed-width format)
- **Weather Readings**: Parquet files with daily temperature observations
- **Coverage**: Wisconsin weather stations (2022 data)
- **Temperature Scale**: Tenths of degrees Celsius

## Deployment

### Build and Start Cluster
```bash
docker build -t weather-cassandra .
export PROJECT=weather
docker compose up -d
```

### Wait for Cluster Ready
```bash
docker exec weather-db-1 nodetool status
# Wait until all nodes show UN (Up/Normal)
```

### Generate gRPC Stubs
```bash
docker exec -w /src weather-db-1 sh -c \
  "python3 -m grpc_tools.protoc -I=. --python_out=. --grpc_python_out=. station.proto"
```

### Start Server
```bash
docker exec -it -w /src weather-db-1 python3 server.py
```

## Performance Characteristics

### Read Latency by Consistency Level

| Consistency | Healthy Cluster | 1 Node Down | 2 Nodes Down |
|-------------|-----------------|-------------|--------------|
| ONE (R=1)   | ~2ms           | ~2ms        | ~2ms         |
| TWO (R=2)   | ~4ms           | ~4ms        | UNAVAILABLE  |
| THREE (R=3) | ~6ms           | UNAVAILABLE | UNAVAILABLE  |

### Write Availability

| Consistency | Healthy Cluster | 1 Node Down | 2 Nodes Down |
|-------------|-----------------|-------------|--------------|
| ONE (W=1)   | 100%           | 100%        | 100%         |
| TWO (W=2)   | 100%           | 100%        | UNAVAILABLE  |

## Skills Demonstrated

- **Distributed Databases**: Cassandra architecture, replication strategies
- **Data Modeling**: Partition keys, clustering keys, static columns, UDTs
- **Consistency Tuning**: CAP theorem tradeoffs, quorum configuration
- **Fault Tolerance**: Graceful degradation, automatic failover
- **RPC Communication**: gRPC, Protocol Buffers
- **Data Processing**: Apache Spark for ETL
- **Error Handling**: Exception management, retry logic
- **Performance Optimization**: Prepared statements, query tuning

## Technologies

- Apache Cassandra (distributed NoSQL)
- Apache Spark (data preprocessing)
- gRPC & Protocol Buffers (RPC framework)
- Python 3.x (cassandra-driver, pyspark)
- Docker & Docker Compose (orchestration)

---

*A production-ready demonstration of distributed database design with tunable consistency and fault tolerance.*
