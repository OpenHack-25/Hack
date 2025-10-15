# DermaDetectAI

## Team Name
Trailblazers

## Team Members
- Muhammad Qasim (Team Lead) - [@Qasim-Soomro](https://github.com/Qasim-Soomro)
- Sonia Kumari - [@sonia724](https://github.com/sonia724)
- Khadija - [@khadija405](https://github.com/khadija405)

## Problem Statement
Early detection of skin cancer, particularly melanoma, is critical for improving patient outcomes. However, access to immediate dermatological assessment can be limited, leading to dangerous delays. Our project addresses the need for an accessible, preliminary screening tool that can help users assess the risk associated with a skin lesion and encourage them to seek timely professional consultation.

## Solution
DermaDetectAI is an AI-powered web application that provides an instant risk assessment of skin lesions from user-uploaded images. The entire solution is contained within a single Google Colab notebook for maximum accessibility and reproducibility. 

Our approach is as follows:
1.  **Data Processing:** The well-known HAM10000 dataset is downloaded directly into the environment using the KaggleHub API.
2.  **AI Model:** A Convolutional Neural Network (CNN) using transfer learning with MobileNetV2 is trained to classify lesions with a binary outcome ("High Risk" or "Low Risk").
3.  **Explainable AI (XAI):** We integrated the LIME library to provide a visual explanation of the model's decision. This highlights the key features in the uploaded image that contributed to the prediction, building user trust.
4.  **Web App:** The model is served through a user-friendly web interface created with Gradio, which runs directly from the notebook and provides a shareable public link for easy demonstration.

## Tech Stack
- **Languages:** Python
- **Platform:** Google Colab
- **Libraries:** TensorFlow, Keras, Gradio, LIME, Pandas, Scikit-learn
- **Tools:** KaggleHub API, Git, GitHub

## Setup Instructions
The entire project is self-contained in a single Google Colab notebook for ease of use and to overcome local environment dependencies.

1.  Upload the `index.ipynb` notebook to [Google Colab](https://colab.research.google.com).
2.  Enable the GPU hardware accelerator for faster training:
    - In the menu, go to **Runtime** → **Change runtime type**.
    - Select **T4 GPU** and click **Save**.
3.  Run the single large code cell. The cell will:
    - Install all dependencies.
    - Download the dataset.
    - Train the AI model.
    - Launch the Gradio web application.
4.  At the end of the output, click the public **`.gradio.live`** URL to access the DermaDetectAI app.

## Category
Healthcare

## Challenges Faced
Our primary challenge was overcoming local development environment constraints. Initial attempts on a Chromebook were hindered by `externally-managed-environment` errors and missing Python `venv` tools. We solved this by pivoting to Google Colab, which not only resolved the setup issues but also provided free GPU access, dramatically accelerating our model training cycles from hours to minutes. This strategic shift allowed us to focus more time on model tuning and building the user interface.

## Learnings
- **The Power of Cloud IDEs:** We learned that for ML-heavy hackathons, cloud-based environments like Google Colab are invaluable for bypassing setup friction and leveraging powerful hardware.
- **Rapid Prototyping with Gradio:** We discovered how incredibly fast and effective Gradio is for building and sharing interactive ML demos without the overhead of traditional web frameworks like Flask or Streamlit.
- **Importance of XAI:** Implementing LIME taught us that a model's prediction is only half the solution; providing a clear explanation is crucial for building user trust, especially in a critical domain like healthcare.

## License
MIT License