from datetime import datetime 
from functools import wraps



def execution_time(target_function):
    @wraps(target_function)
    def wrapper(*args, **kwargs):
        start_time = datetime.now()
        result = target_function(*args, **kwargs)
        end_time = datetime.now()

        execution_time = end_time - start_time
        print(f"Время выполнения {target_function.__name__}: {execution_time.total_seconds():.8f} секунд")
        return result
    return wrapper
