# CIFAR-100 Image Classification with LeNet (PyTorch)

A LeNet-style convolutional neural network, trained from scratch in PyTorch to classify the 100 fine-grained classes of CIFAR-100 (32×32 RGB images).

## Model

```text
input 3×32×32
 → Conv2d(3→6, 5×5)  → ReLU → MaxPool 2×2   → 6×14×14
 → Conv2d(6→16, 5×5) → ReLU → MaxPool 2×2   → 16×5×5
 → Flatten                                   → 400
 → Linear(400→256) → ReLU
 → Linear(256→128) → ReLU
 → Linear(128→100)                           → class logits
```

That's about **151K trainable parameters**. `forward()` returns the logits plus a dictionary of each stage's output shape, which makes it easy to sanity-check the architecture.

## Training setup

- Loss: cross-entropy
- Optimizer: SGD with momentum 0.9
- Defaults: learning rate 0.001, batch size 32, 10 epochs (all configurable)
- After every epoch the model is evaluated on the test set, and a checkpoint is written. The best-accuracy model is saved separately, and training can resume from any checkpoint.

## Files

| File | Purpose |
| --- | --- |
| `lenet.py` | Model definition, parameter count, train and test loops |
| `dataloader.py` | CIFAR-100 dataset: download, extraction, and PyTorch `Dataset` |
| `train_cifar100.py` | Training entry point with checkpointing and resume |
| `eval_cifar100.py` | Evaluate a saved checkpoint on the test set |

## Usage

```bash
pip install -r requirements.txt

python train_cifar100.py --epochs 10 --lr 0.001 --batch-size 32
python train_cifar100.py --resume outputs/checkpoint.pth.tar      # continue training
python eval_cifar100.py --load outputs/model_best.pth.tar
```

Data is cached under `data/` and checkpoints are written to `outputs/`. Neither is committed.

---

*Date finished: April 7, 2025*
