from  utils import execution_time
from datetime import datetime

class Market:
    def __init__(self, wines: list = None, beers: list = None) -> None:
        self.wines = wines if wines is not None else []
        self.beers = beers if beers is not None else []
        self.drinks = {}

        for wine in self.wines:
            self.drinks[wine.title] = wine
        for beer in self.beers:
            self.drinks[beer.title] = beer

    @execution_time
    def has_drink_with_title(self, title=None) -> bool:
        """
        Проверяет наличие напитка в магазине за О(1)

        :param title:
        :return: True|False
        """
        return title in self.drinks
    
    @execution_time
    def get_drinks_sorted_by_title(self) -> list:
        """
        Метод получения списка напитков (вина и пива) отсортированных по title

        :return: list
        """
        return sorted(self.drinks.keys())
    
    @execution_time
    def get_drinks_by_production_date(self, from_date=None, to_date=None) -> list:
        """
        Метод получения списка напитков в указанном диапазоне дат: с from_date по to_date

        :return: list
        """
        if from_date is None or to_date is None:
            raise ValueError("Обе границы (from_date и to_date) должны быть указаны.")
        
        try:
            from_date = datetime.strptime(from_date, "%Y-%m-%d")
            to_date = datetime.strptime(to_date, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Неверный формат даты. Используйте 'YYYY-MM-DD'.")

        if from_date > to_date:
            raise ValueError("from_date не может быть позже to_date.")

        result = []
        for drink in self.drinks.values():
            if isinstance(drink.production_date, datetime) and from_date <= drink.production_date <= to_date:
                result.append({
                    'title': drink.title,
                    'production_date': drink.production_date.strftime('%Y-%m-%d')
                })

        return result
