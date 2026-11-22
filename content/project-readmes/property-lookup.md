# Distributed Property Lookup Service

A high-performance, fault-tolerant address lookup system built with gRPC, Docker, and Python. This microservices architecture demonstrates distributed systems principles including load balancing, failover mechanisms, and intelligent caching strategies.

## Architecture

![Architecture Diagram](arch.png)

The system consists of two service layers:
- **Dataset Layer**: Redundant gRPC servers providing property data access
- **Cache Layer**: HTTP API servers with LRU caching for optimized performance

## Key Features

### 🔄 Fault Tolerance & High Availability
- Automatic failover between redundant dataset servers
- Intelligent retry mechanism with exponential backoff
- Service continues operation even with partial infrastructure failures

### ⚡ Performance Optimization
- LRU cache implementation (size: 3) to minimize database calls
- Load balancing across multiple backend servers
- Smart caching strategy: stores 8 addresses per zipcode for efficient serving

### 🐳 Containerized Deployment
- Multi-container architecture using Docker Compose
- Horizontal scaling with 3 cache replicas and 2 dataset replicas
- Environment-based configuration for flexible deployments

### 🔌 Modern Communication Protocols
- gRPC for efficient inter-service communication
- RESTful HTTP API for client access
- Protocol Buffers for serialization

## Technical Stack

- **Backend**: Python, Flask
- **RPC Framework**: gRPC, Protocol Buffers
- **Containerization**: Docker, Docker Compose
- **Caching**: Custom LRU cache implementation
- **Data Processing**: Pandas (gzipped CSV handling)

## API Usage

### Lookup addresses by zipcode:
```bash
GET /lookup/{zipcode}?limit=4
```

**Response:**
```json
{
  "addrs": ["123 Main St", "456 Oak Ave", ...],
  "source": "cache|1|2",
  "error": null
}
```

- `source`: Indicates data origin - "cache" (served from cache) or "1"/"2" (from dataset server 1 or 2)
- `limit`: Number of addresses to return (default: 4)

## Architecture Highlights

### Load Balancing
Requests alternate between dataset servers (round-robin) to distribute load evenly across the infrastructure.

### Failover Strategy
When a dataset server is unavailable:
1. Automatically switches to alternate server after 100ms
2. Retries up to 5 times across both servers
3. Returns graceful error message if all attempts fail

### Caching Strategy
- Cache entries store 8 addresses per zipcode for optimal reuse
- Requests for <8 addresses can be served from cache
- Requests for >8 addresses still populate cache with first 8 results
- Enables limited functionality even during complete backend failure

## Deployment
```bash
# Build images
docker build . -f Dockerfile.cache -t property-cache
docker build . -f Dockerfile.dataset -t property-dataset

# Deploy services
export PROJECT=property-lookup
docker compose up -d
```

## Project Outcomes

This project demonstrates proficiency in:
- Distributed systems design and implementation
- Microservices architecture patterns
- gRPC and Protocol Buffers
- Container orchestration with Docker
- Fault tolerance and reliability engineering
- Cache implementation and optimization
- API design and development

## Data Source

Property address data sourced from Madison City Open Data Portal (Citywide Addresses dataset).
