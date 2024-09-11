import requests
import time


API_TOKEN = "apify_api_rSWGTHoyy88EABr5pWmPHVMa0rOFcw1GGMk6"


START_RUN_URL = "https://api.apify.com/v2/actor-runs/dGnY7hYXyxXVe8Iks?token=" + API_TOKEN
GET_INPUT_URL = "https://api.apify.com/v2/key-value-stores/JDd3rjl7EfE5epzfM/records/INPUT?token=" + API_TOKEN
GET_OUTPUT_URL = "https://api.apify.com/v2/key-value-stores/JDd3rjl7EfE5epzfM/records/OUTPUT?token=" + API_TOKEN
GET_DATASET_URL = "https://api.apify.com/v2/datasets/TKiH7CmbBCyuxR4Sb/items?token=" + API_TOKEN
GET_LOG_URL = "https://api.apify.com/v2/logs/dGnY7hYXyxXVe8Iks?token=" + API_TOKEN
ABORT_RUN_URL = "https://api.apify.com/v2/actor-runs/dGnY7hYXyxXVe8Iks/abort?token=" + API_TOKEN
RESURRECT_RUN_URL = "https://api.apify.com/v2/actor-runs/dGnY7hYXyxXVe8Iks/resurrect?token=" + API_TOKEN

def start_run():
    """Starts the scraper and returns the run details."""
    response = requests.get(START_RUN_URL)
    if response.status_code == 200:
        print("Run started successfully.")
        return response.json()
    else:
        print("Error starting the run:", response.status_code)
        return None

def get_input():
    """Fetch the input of the scraping run."""
    response = requests.get(GET_INPUT_URL)
    if response.status_code == 200:
        print("Input data fetched successfully.")
        return response.json()
    else:
        print("Error fetching input:", response.status_code)
        return None

def get_output():
    """Fetch the output of the scraping run."""
    response = requests.get(GET_OUTPUT_URL)
    if response.status_code == 200:
        print("Output data fetched successfully.")
        return response.json()
    else:
        print("Error fetching output:", response.status_code)
        return None

def get_dataset():
    """Fetch the dataset of the scraping run."""
    response = requests.get(GET_DATASET_URL)
    if response.status_code == 200:
        print("Dataset items fetched successfully.")
        return response.json()
    else:
        print("Error fetching dataset:", response.status_code)
        return None

def get_log():
    """Fetch the logs of the scraping run."""
    response = requests.get(GET_LOG_URL)
    if response.status_code == 200:
        print("Log data fetched successfully.")
        return response.text
    else:
        print("Error fetching log:", response.status_code)
        return None

def abort_run():
    """Abort the current run."""
    response = requests.post(ABORT_RUN_URL)
    if response.status_code == 200:
        print("Run aborted successfully.")
    else:
        print("Error aborting the run:", response.status_code)

def resurrect_run():
    """Resurrect the current run."""
    response = requests.post(RESURRECT_RUN_URL)
    if response.status_code == 200:
        print("Run resurrected successfully.")
    else:
        print("Error resurrecting the run:", response.status_code)

def main():
    # Step 1: Start the run
    run_details = start_run()
    if not run_details:
        return

    # Step 2: Optionally fetch input data
    input_data = get_input()
    print("Input Data:", input_data)

    # Step 3: Wait for some time to ensure the scraper has enough time to collect data
    print("Waiting for scraper to complete...")
    time.sleep(10)  # Sleep for 10 seconds (adjust as needed)

    # Step 4: Fetch output, dataset, and logs
    output_data = get_output()
    print("Output Data:", output_data)

    dataset_items = get_dataset()
    print("Dataset Items:", dataset_items)

    log_data = get_log()
    print("Log Data:", log_data)

    # Optional: Abort or Resurrect the run if needed
    # abort_run()
    # resurrect_run()

if __name__ == "__main__":
    main()
