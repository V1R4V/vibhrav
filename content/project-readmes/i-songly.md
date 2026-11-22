

# i-Songly: An Interactive Song Management App

i-Songly is a command-line application designed to manage and explore a collection of songs efficiently. It enables users to load songs from a file, filter them by attributes like energy and danceability, and retrieve the top recent tracks. The app is built with modular design principles, leveraging advanced data structures and algorithms to ensure scalability and performance.

## Features

- **Load Songs**: Import a song database from a CSV file.
- **Filter by Danceability**: Apply a filter to display songs matching a specified danceability threshold.
- **Retrieve Songs by Energy Range**: Find songs that fall within a specified range of energy levels.
- **Top 5 Recent Songs**: Display the five most recent songs in the collection.
- **Interactive Command-Line Interface**: User-friendly CLI for seamless interaction.

## System Architecture

The application is divided into three main components:
1. **Frontend**: Provides the user interface, accepts commands, and interacts with the backend.
2. **Backend**: Manages the song data, processes user queries, and applies filters.
3. **Data Structures**: Organizes song data efficiently for fast access and updates.

## Data Structures and Algorithms Used

1. **Binary Search Tree (BST)**: 
   - The core data structure used to store songs in an ordered manner. 
   - Supports efficient insertion and retrieval operations based on song attributes.

2. **Red-Black Tree (RBT)**: 
   - A self-balancing binary search tree variant.
   - Ensures logarithmic time complexity for insertion, deletion, and search operations.
   - Provides robust performance for managing large datasets.

3. **Iterable Sorted Collection**:
   - An abstraction built over the BST/RBT to enable iteration over songs in a sorted order.
   - Facilitates operations like finding ranges of songs by energy.

4. **Custom Comparator**:
   - Implements domain-specific ordering logic for sorting songs based on their attributes, like energy and danceability.

5. **Selection Sort**:
   - Used in specific scenarios for fine-tuning the order of songs based on additional criteria.

## Key Algorithms

- **Filtering**: The `setFilter` method applies a danceability threshold to restrict the results to songs meeting the criteria.
- **Range Query**: Retrieves songs with energy levels within a user-defined range, utilizing tree traversal for efficiency.
- **Top 5 Recent**: Leverages the ordered structure of the tree to quickly fetch the latest entries.

## How It Works

1. **Loading Songs**: Songs are loaded from a CSV file and inserted into the Red-Black Tree. The tree ensures the data remains sorted and accessible.
2. **Querying**: Users specify energy ranges or filters, and the backend retrieves matching results by traversing the tree.
3. **Sorting and Displaying**: Songs are sorted based on user preferences or filters before being displayed.

## File Overview

- **`Frontend.java`**: Handles user interactions and displays results.
- **`Backend.java`**: Implements the core logic for loading data, filtering, and retrieving songs.
- **`BinarySearchTree.java`** and **`RedBlackTree.java`**: Core data structures for storing and managing song data.
- **`Song.java`** and **`SongCompare.java`**: Represent song objects and define comparison logic.
- **`TextUITester.java`**: Includes test cases for verifying app functionality.
- **Other Support Files**: Interfaces and placeholders ensure modularity and extensibility.

## Usage Instructions

1. Compile the project using `javac`:
   ```bash
   javac *.java
   ```
2. Run the application:
   ```bash
   java App
   ```
   <img width="1421" alt="image" src="https://github.com/user-attachments/assets/59e68ef3-a1ee-4304-bb06-5774580fcda0" />

3. Follow the on-screen instructions to load songs, apply filters, and explore the collection.

## Future Enhancements

- GUI support for a more interactive user experience.
- Enhanced sorting and filtering options.
- Integration with external song databases for live data.

## Contributors

- **Vibhrav**: Development and design of the app.
- **Collaborators**: None
