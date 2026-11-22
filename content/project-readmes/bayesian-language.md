# User Manual for Bayesian Language Detection
## Overview

### This project implements a Bayesian language detection model to classify text (shredded documents) as either English or Spanish based on the distribution of letters. The core of the model uses Bayes' Theorem to compute posterior probabilities for each language hypothesis and then classifies the document into the language with the higher posterior probability.

### Setting Up the Environment
To try out the Bayesian language detection, follow these steps:

Clone the Repository If you haven't already, clone this repository to your local machine:

bash
Copy
Edit
git clone https://github.com/CS540.hw2
Install Dependencies Ensure you have Python 3.x installed, and then install the necessary libraries using pip:

bash
Copy
Edit
pip install -r requirements.txt
Dependencies include:

numpy for matrix operations
scikit-learn (if using any machine learning methods like Naive Bayes)
Understanding the Code Structure
The code is divided into two main parts:

### Bayesian Model (Core Algorithm)

Bayes' Rule Implementation: Contains the mathematical rules of Bayesian classification based on letter distributions.
Language Detection Logic: Uses a set of letter distributions for both English and Spanish (or any other languages you choose to add).
Main Program

Takes shredded document input, processes it to count the occurrence of each letter, and then computes which language the document most likely belongs to based on the Bayesian inference.
Running the Code
Prepare Your Data

The shredded document should be a string of random letters (with no spaces or punctuation), simulating a shredded text document.
Example Input:
python
Copy
Edit
shredded_text = "hwlqapvwdmrnqx"
Run the Language Detection You can run the language detection from the main function in language_detection.py. Here is an example:

bash
Copy
Edit
python language_detection.py
Or you can pass your own custom shredded document text to the function directly:

python
Copy
Edit
from language_detection import detect_language

# Example shredded text (input as a string of letters)
shredded_text = "hwlqapvwdmrnqx"

language = detect_language(shredded_text)
print(f"The detected language is: {language}")
Understand the Output

The output will print either "English" or "Spanish" depending on which language the Bayesian model has classified the shredded document as.
Example Output:
pgsql
Copy
Edit
The detected language is: English
How Does It Work?
Bayes' Theorem Applied: The model computes the posterior probability of the text being in English or Spanish using Bayes' Theorem.

Prior Probabilities: The initial assumption about the language (e.g., 60% English, 40% Spanish) is represented by the prior probabilities. You can modify these based on your use case.

Likelihood Computation: For each letter in the shredded document, the model calculates how likely it is to appear in English or Spanish based on predefined letter frequencies for each language.

Posterior Calculation: The final classification is determined by comparing the posterior probabilities of each language.

Logarithmic Adjustments: To avoid numerical underflow, the likelihoods are computed using logarithms, making the calculations more stable.

Customizing the Model
If you want to experiment with different languages or customize the prior probabilities, follow these steps:

Modify the Prior Probabilities:
Change the prior probabilities for English and Spanish or add new languages by modifying the prior_probabilities section in the code.
Customize Language Distributions:
You can update the letter distributions for English and Spanish. These distributions should be based on the frequency of letters in each language.
Add New Languages:
To add more languages, update the language_distributions dictionary with new language distributions, and modify the logic in detect_language to handle those.
Troubleshooting
Ensure Proper Data Input: Make sure the shredded document consists only of alphabetic characters (no spaces or special symbols).

Check for Libraries: Ensure all required libraries are installed correctly, especially if you encounter ImportError.

Large Documents: If you're working with large documents, you may need to optimize the code further to handle more complex cases efficiently.



# EXPLANATION

# Bayesian Language Detection

## Understanding Bayes' Theorem
Bayes' theorem is a mathematical rule that helps update our beliefs based on new evidence. It is written as:

$$
P(Y | X) = \frac{P(X | Y) P(Y)}{P(X)}
$$

Where:

- \( P(Y | X) \) is the **posterior probability**: the probability of a hypothesis \( Y \) (e.g., the language being English or Spanish) given the evidence \( X \) (the shredded text).
- \( P(X | Y) \) is the **likelihood**: the probability of seeing \( X \) if \( Y \) is true.
- \( P(Y) \) is the **prior probability**: our initial belief about \( Y \) before seeing any evidence.
- \( P(X) \) is the **evidence (marginal probability)**: the total probability of seeing \( X \) across all possible hypotheses.

## How Does This Apply to Language Detection?
We are trying to determine whether a given shredded document is in **English** or **Spanish** based on its letter distribution.

### Define the Hypotheses
The document could be:
- English (\( Y = \text{English} \))
- Spanish (\( Y = \text{Spanish} \))

We need to compute:

$$
P(Y = \text{English} | X) \quad \text{and} \quad P(Y = \text{Spanish} | X)
$$

### Define the Prior Probabilities \( P(Y) \)
These are given as:

$$
P(Y = \text{English}) = p_{\text{eng}}, \quad P(Y = \text{Spanish}) = p_{\text{spa}} = 1 - p_{\text{eng}}
$$

For example, if we assume English is more common, we might set:

$$
P(Y = \text{English}) = 0.6, \quad P(Y = \text{Spanish}) = 0.4
$$

### Compute the Likelihood \( P(X | Y) \)
- \( X \) represents the observed letter counts in the shredded document.
- We assume the probability of each letter in a language follows a **multinomial distribution**.
- The probabilities of letters in each language are stored in **parameter vectors**:  
    - \( e = (e_1, e_2, ..., e_{26}) \) for English  
    - \( s = (s_1, s_2, ..., s_{26}) \) for Spanish  
- Each \( e_i \) (or \( s_i \)) represents the probability of the *i-th letter* occurring in the given language.

The likelihood is computed as:

$$
P(X | Y = \text{English}) = \prod_{i=1}^{26} e_i^{X_i}
$$

$$
P(X | Y = \text{Spanish}) = \prod_{i=1}^{26} s_i^{X_i}
$$

Where:

- \( X_i \) is the number of times letter \( i \) appears in the shredded document.
- \( e_i \) and \( s_i \) are probabilities of that letter in English and Spanish.

### Compute the Evidence \( P(X) \)
To normalize probabilities, we sum over both possible languages:

$$
P(X) = P(X | Y = \text{English}) P(Y = \text{English}) + P(X | Y = \text{Spanish}) P(Y = \text{Spanish})
$$

In practice, we often **skip computing \( P(X) \)** because it is the same for both cases.

### Compute the Posterior Probability
Applying Bayes' Rule:

$$
P(Y = \text{English} | X) = \frac{P(X | Y = \text{English}) P(Y = \text{English})}{P(X)}
$$

$$
P(Y = \text{Spanish} | X) = \frac{P(X | Y = \text{Spanish}) P(Y = \text{Spanish})}{P(X)}
$$

Since \( P(X) \) is the same in both cases, we compare:

$$
P(X | Y = \text{English}) P(Y = \text{English})
$$

vs.

$$
P(X | Y = \text{Spanish}) P(Y = \text{Spanish})
$$

We choose the language with the higher probability.

## Why Use Log Probabilities?
Computing:

$$
P(X | Y = y) = \prod_{i=1}^{26} e_i^{X_i}
$$

involves **multiplying many small numbers**, leading to numerical underflow. To avoid this, we take the **logarithm**:

$$
\log P(X | Y = \text{English}) = \sum_{i=1}^{26} X_i \log e_i
$$

$$
\log P(X | Y = \text{Spanish}) = \sum_{i=1}^{26} X_i \log s_i
$$

Since logarithm is **monotonic**, we compare:

$$
\log P(X | Y = \text{English}) + \log P(Y = \text{English})
$$

vs.

$$
\log P(X | Y = \text{Spanish}) + \log P(Y = \text{Spanish})
$$

The larger value gives the most likely language.

## Understanding the Evidence \( P(X) \)

Recall that Bayes' theorem is given by:

$$
P(Y \mid X) = \frac{P(X \mid Y)P(Y)}{P(X)}
$$

where:
- \( P(Y \mid X) \) is the posterior probability (the probability of the hypothesis \( Y \) given the evidence \( X \)),
- \( P(X \mid Y) \) is the likelihood (the probability of observing \( X \) if \( Y \) is true),
- \( P(Y) \) is the prior probability of \( Y \),
- \( P(X) \) is the evidence (or marginal probability) of \( X \).

### Why is \( P(X) \) Expanded as a Sum?
The term \( P(X) \) represents the total probability of observing the evidence \( X \) across all possible hypotheses. In our language detection problem, we consider two mutually exclusive hypotheses: the document is either **English** or **Spanish**. Thus, by the law of total probability, we can write:

$$
P(X) = P(X \mid Y = \text{English})\,P(Y = \text{English}) + P(X \mid Y = \text{Spanish})\,P(Y = \text{Spanish})
$$

This expansion is necessary because:

1. **Total Probability:** It sums the contributions from every possible scenario (here, each language) that can produce the observed evidence \( X \).
2. **Normalization:** It acts as a normalization factor to ensure that the posterior probabilities \( P(Y \mid X) \) across all hypotheses add up to 1.
3. **Multiple Sources:** Each term, \( P(X \mid Y)P(Y) \), represents the probability of \( X \) being produced under a specific hypothesis, weighted by the prior probability of that hypothesis. Since \( X \) can arise from either source (English or Spanish), both contributions must be included.

### Why It Might Seem "Weird"

The expansion of \( P(X) \) might appear complicated because:
- The likelihood \( P(X \mid Y) \) for each hypothesis is often a product of many small probabilities (especially when modeled as a multinomial distribution over 26 letters). This can lead to a complex product term.
- In practice, these product terms can be very small, so it is common to work with logarithms to avoid numerical underflow. However, when comparing the two hypotheses, the common denominator \( P(X) \) cancels out.

### Intuitive Explanation

Imagine you have two boxes:
- One labeled *English*, containing a specific mix of letters.
- Another labeled *Spanish*, with a different letter mix.

When you observe a shredded document with letter distribution \( X \), you can compute the probability that \( X \) comes from either box by:

$$
P(X \mid Y = \text{English})\,P(Y = \text{English}) \quad \text{or} \quad P(X \mid Y = \text{Spanish})\,P(Y = \text{Spanish})
$$

Since you do not know which box produced \( X \), you add these two probabilities to get the total probability \( P(X) \).

This sum ensures that every possibility is taken into account and serves as a normalization factor when applying Bayes' theorem.
