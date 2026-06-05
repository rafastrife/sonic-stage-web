# Quickstart: Python 3.14 Requirements Fix

To test and verify this fix, follow these steps:

1. Create a Python 3.14 virtual environment (or use any version between 3.10 and 3.14):
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On Linux/macOS
   source venv/bin/activate
   ```

2. Navigate to the backend directory:
   ```bash
   cd sonic-stage-api
   ```

3. Install the updated requirements:
   ```bash
   pip install -r requirements.txt
   ```

4. Verify installation and Django compatibility:
   ```bash
   python manage.py check
   ```
