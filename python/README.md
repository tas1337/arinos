# Python Steganography Tool

This is the original standalone Python implementation of the steganography encoder/decoder.

## Usage

### Encode a message
```bash
python stego_app.py encode --image photo.jpg --output encoded.png --message "Your message here"
```

### Decode a message
```bash
python stego_app.py decode --image encoded.png
```

## Requirements

```bash
pip install Pillow
```

## Note

This is the legacy Python version. The main application now uses Node.js/Angular. This Python tool is kept for:
- Command-line usage
- Batch processing
- Integration into Python projects
- Reference implementation




