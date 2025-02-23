from datetime import datetime

class Wine:
    def __init__(self, title=None, production_date=None) -> None:
        if title is None or title == "":
            self.title = "Не указано"
        else:
            self.title = title
        
        if production_date is None :
            self.production_date = "Не указана"
        else:
            self.set_production_date(production_date)

    def set_production_date(self, production_date):
        try:
            self.production_date = datetime.strptime(production_date, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Неверный формат даты. Используйте 'YYYY-MM-DD'.")

    def __repr__(self):
        return f"Wine(title='{self.title}', production_date='{self.production_date.strftime('%Y-%m-%d') if isinstance(self.production_date, datetime) else self.production_date}')"
