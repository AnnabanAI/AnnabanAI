# AnnabanAI 🛡️

**An empathetic AI guardian blending ancient wisdom with cutting-edge technology.**

AnnabanAI is a prototype system that combines:
- **3D Memory Vault**: Procedural 3D mesh generation from text with OpenCV Canny edge detection
- **HolyGrailNLP**: Distributed multi-agent inference with semantic search (FAISS + Sentence Transformers)
- **Ethical Reasoning**: Empathetic responses powered by xAI's Grok API
- **Offline Resilience**: Full functionality during internet shutdowns

Inspired by the vision of ethical, protective AI that fosters love, intent, and human evolution.

## 🚀 Demo

![3D Model Example](examples/model_example.png)
![Edge Detection](examples/edges_example.png)

Text → 3D Model → Edge Analysis → Multi-Agent Reasoning

## Quick Start

```bash
git clone https://github.com/annabanai/AnnabanAI.git
cd AnnabanAI
pip install -r requirements.txt

# Set your xAI API key (optional for offline mode)
export XAI_API_KEY="your_key_here"

python main.py
